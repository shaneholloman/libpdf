#!/usr/bin/env npx tsx
/**
 * Run All Examples
 *
 * Executes all example files in sequence and reports results.
 *
 * Usage:
 *   npx tsx examples/run-all.ts           # Run all examples
 *   npx tsx examples/run-all.ts --quiet   # Suppress example output
 *   npx tsx examples/run-all.ts 01-basic  # Run only 01-basic examples
 */

import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

interface ExampleResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
}

const EXAMPLES_DIR = import.meta.dirname;

async function getExampleFiles(filter?: string): Promise<string[]> {
  const examples: string[] = [];

  const entries = await readdir(EXAMPLES_DIR);
  const dirs = entries
    .filter(e => e.match(/^\d{2}-/)) // Only numbered directories
    .filter(e => !filter || e.includes(filter))
    .sort();

  for (const dir of dirs) {
    const dirPath = join(EXAMPLES_DIR, dir);
    const dirStat = await stat(dirPath);

    if (!dirStat.isDirectory()) {
      continue;
    }

    const files = await readdir(dirPath);
    const tsFiles = files.filter(f => f.endsWith(".ts")).sort();

    for (const file of tsFiles) {
      examples.push(join(dir, file));
    }
  }

  return examples;
}

async function runExample(relativePath: string, quiet: boolean): Promise<ExampleResult> {
  const fullPath = join(EXAMPLES_DIR, relativePath);
  const start = Date.now();

  return new Promise(resolve => {
    const proc = spawn("bun", ["run", fullPath], {
      stdio: quiet ? "pipe" : "inherit",
      cwd: join(EXAMPLES_DIR, ".."),
    });

    let stderr = "";

    if (quiet && proc.stderr) {
      proc.stderr.on("data", data => {
        stderr += data.toString();
      });
    }

    proc.on("close", code => {
      const duration = Date.now() - start;
      resolve({
        name: relativePath,
        success: code === 0,
        duration,
        error: code !== 0 ? stderr || `Exit code: ${code}` : undefined,
      });
    });

    proc.on("error", err => {
      const duration = Date.now() - start;
      resolve({
        name: relativePath,
        success: false,
        duration,
        error: err.message,
      });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const quiet = args.includes("--quiet") || args.includes("-q");
  const filter = args.find(a => !a.startsWith("-"));

  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║                    @libpdf/core Examples                       ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  const examples = await getExampleFiles(filter);

  if (examples.length === 0) {
    console.log(`No examples found${filter ? ` matching "${filter}"` : ""}`);
    process.exit(1);
  }

  console.log(`Found ${examples.length} examples${filter ? ` matching "${filter}"` : ""}\n`);

  const results: ExampleResult[] = [];
  let currentCategory = "";

  for (const example of examples) {
    const category = example.split("/")[0];

    if (category !== currentCategory) {
      currentCategory = category;
      console.log(`\n── ${category} ${"─".repeat(50 - category.length)}\n`);
    }

    const shortName = example.split("/")[1];
    process.stdout.write(`  ${shortName}... `);

    const result = await runExample(example, quiet);
    results.push(result);

    if (result.success) {
      console.log(`✓ (${result.duration}ms)`);
    } else {
      console.log(`✗ FAILED`);
      if (result.error && !quiet) {
        console.log(`    Error: ${result.error.slice(0, 200)}`);
      }
    }
  }

  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`\n${"═".repeat(68)}\n`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`Total time: ${(totalTime / 1000).toFixed(2)}s`);

  if (failed > 0) {
    console.log("\nFailed examples:");
    for (const result of results.filter(r => !r.success)) {
      console.log(`  ✗ ${result.name}`);
      if (result.error) {
        console.log(`    ${result.error.slice(0, 100)}`);
      }
    }
    process.exit(1);
  }

  console.log("\n✓ All examples completed successfully!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
