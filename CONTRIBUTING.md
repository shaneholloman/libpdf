# Contributing to LibPDF

Thanks for your interest in contributing to LibPDF! This document covers how to get started.

## Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/LibPDF-js/core.git
   cd core
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Initialize reference submodules** (optional, for cross-referencing)

   ```bash
   git submodule update --init --recursive
   ```

## Commands

```bash
bun run test              # Run tests in watch mode
bun run test:run          # Run tests once
bun run typecheck         # Type check with tsc
bun run lint              # Check with oxlint + oxfmt
bun run lint:fix          # Fix lint issues
bun run build             # Build for distribution
bun run examples          # Run all examples
```

## Project Structure

```
src/                  # Source code
  index.ts            # Public API exports
  api/                # High-level API (PDF, PDFPage, PDFForm)
  parser/             # PDF parsing
  writer/             # PDF serialization
  objects/            # Low-level PDF objects (PdfDict, PdfArray, etc.)
  ...
fixtures/             # PDF test files
examples/             # Usage examples
```

## Code Style

We use oxlint and oxfmt for linting and formatting. Key conventions:

- **2-space indentation**, double quotes
- **Always use braces** for control flow (no single-line `if`)
- **Explicit return types** on public methods
- **Tests co-located** as `*.test.ts` files

See [CODE_STYLE.md](./CODE_STYLE.md) for the full guide.

## Writing Tests

Tests use Vitest and are co-located with source files:

```
src/parser/document-parser.ts
src/parser/document-parser.test.ts
```

Load test fixtures with the helper:

```typescript
import { loadFixture } from "./test-utils.ts";

const bytes = await loadFixture("basic", "hello.pdf");
```

Run specific tests:

```bash
bun run test:run -t "parser"
```

## AI-Assisted Development

We use [OpenCode](https://opencode.ai) for AI-assisted development. OpenCode provides custom commands and skills to help maintain consistency and streamline common workflows.

### Getting Started with OpenCode

1. Install OpenCode:
   ```bash
   curl -fsSL https://opencode.ai/install | bash
   ```
2. Configure your AI provider (Anthropic, OpenAI, Google, etc.) or use [Zen](https://opencode.ai/zen) for optimized models
3. Run `opencode` in the project root

### Available Commands

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `/implement <spec-path>` | Implement a spec from `.agents/plans/` autonomously  |
| `/continue <spec-path>`  | Continue implementing a spec from a previous session |
| `/interview <file-path>` | Deep-dive interview to flesh out a spec or design    |
| `/explore <topic>`       | Research how a feature works in reference libraries  |
| `/dx-review [module]`    | Review developer experience and API ergonomics       |
| `/document <module>`     | Generate documentation for a module or feature       |
| `/commit`                | Create a conventional commit for staged changes      |
| `/create-plan <slug>`    | Create a new plan file in `.agents/plans/`           |
| `/create-scratch <slug>` | Create a scratch file in `.agents/scratches/`        |

### Agent Files

The `.agents/` directory stores AI-generated artifacts:

- **`.agents/plans/`** — Feature specs and implementation plans
- **`.agents/scratches/`** — Temporary notes and explorations
- **`.agents/justifications/`** — Decision rationale and technical justifications

### Contribution Requirements

We accept contributions written with AI assistance, but with strict requirements:

1. **Include your prompts** — Add the prompts used to generate the code in your PR description
2. **Review before submitting** — You must review and understand all AI-generated code before submitting
3. **Meet quality standards** — AI-assisted code must meet the same quality bar as human-written code

**Important**: If we determine a contribution was AI-generated but not reviewed by a human, the contributor will be banned from the repository. We take this seriously because unreviewed AI code often contains subtle bugs, hallucinated APIs, or fails to integrate properly with the existing codebase.

## Pull Request Process

1. **Create a branch** from `main` using the naming convention:
   ```
   feat/short-description    # New features
   fix/short-description     # Bug fixes
   docs/short-description    # Documentation changes
   refactor/short-description # Code refactoring
   ```
2. **Write tests** for new functionality
3. **Run the full test suite** before submitting
4. **Keep commits focused** — prefer small, atomic changes
5. **Write clear commit messages** describing the "why"

## Writing Documentation

Documentation uses [Fumadocs](https://fumadocs.dev) with MDX files in `apps/docs/content/`.

See [WRITING_STYLE.md](./WRITING_STYLE.md) for documentation conventions.

## Reporting Issues

When reporting bugs, please include:

- LibPDF version
- Node/Bun version
- Minimal reproduction (code snippet or PDF file if possible)
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
