#!/bin/bash
# Count lines of TypeScript code

# csv format: files,language,blank,comment,code
src_csv=$(cloc src --include-lang=TypeScript --not-match-f='\.test\.ts$' --csv --quiet | tail -1)
test_csv=$(cloc src --include-lang=TypeScript --match-f='\.test\.ts$' --csv --quiet | tail -1)

src_code=$(echo "$src_csv" | cut -d, -f5)
src_comment=$(echo "$src_csv" | cut -d, -f4)
test_code=$(echo "$test_csv" | cut -d, -f5)
test_comment=$(echo "$test_csv" | cut -d, -f4)

printf "        %8s %8s\n" "code" "comments"
printf "src:    %'8d %'8d\n" "$src_code" "$src_comment"
printf "test:   %'8d %'8d\n" "$test_code" "$test_comment"
printf "total:  %'8d %'8d\n" "$((src_code + test_code))" "$((src_comment + test_comment))"
