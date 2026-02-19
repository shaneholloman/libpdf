# Benchmark Report

> Generated on 2026-02-19 at 22:39:12 UTC
>
> System: linux | AMD EPYC 7763 64-Core Processor (4 cores) | 16GB RAM | Bun 1.3.9

---

## Contents

- [Comparison](#comparison)
- [Copying](#copying)
- [Drawing](#drawing)
- [Forms](#forms)
- [Loading](#loading)
- [Saving](#saving)
- [Splitting](#splitting)

## Comparison

### Load PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   418.7 |  2.39ms |  3.46ms | ±1.58% |     210 |
| pdf-lib   |    25.6 | 39.09ms | 44.40ms | ±4.38% |      13 |

- **libpdf** is 16.37x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   17.9K |  56us |  115us | ±1.72% |   8,970 |
| pdf-lib   |    2.2K | 446us | 1.51ms | ±2.31% |   1,121 |

- **libpdf** is 8.01x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   10.0K | 100us |  200us | ±1.49% |   5,004 |
| pdf-lib   |    1.8K | 554us | 2.00ms | ±2.93% |     902 |

- **libpdf** is 5.55x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.0K |  338us |  837us | ±1.59% |   1,479 |
| pdf-lib   |   537.4 | 1.86ms | 7.76ms | ±8.07% |     269 |

- **libpdf** is 5.50x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   411.8 |  2.43ms |  4.18ms | ±1.82% |     206 |
| pdf-lib   |    11.6 | 86.33ms | 95.54ms | ±4.30% |      10 |

- **libpdf** is 35.55x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    18.1 | 55.10ms | 59.29ms | ±4.49% |      10 |
| pdf-lib   |    11.7 | 85.82ms | 92.38ms | ±2.80% |      10 |

- **libpdf** is 1.56x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   263.9 | 3.79ms |  6.34ms | ±1.84% |     132 |
| pdf-lib   |   112.3 | 8.91ms | 10.96ms | ±1.59% |      57 |

- **libpdf** is 2.35x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    29.5 | 33.91ms | 37.81ms | ±2.83% |      15 |
| pdf-lib   |    11.7 | 85.83ms | 93.19ms | ±4.89% |       6 |

- **libpdf** is 2.53x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.6 | 614.23ms | 614.23ms | ±0.00% |       1 |
| pdf-lib   |   0.617 |    1.62s |    1.62s | ±0.00% |       1 |

- **libpdf** is 2.64x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   206.6 |  4.84ms |  5.73ms | ±1.15% |     104 |
| pdf-lib   |    85.7 | 11.67ms | 12.71ms | ±1.17% |      43 |

- **libpdf** is 2.41x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    66.5 | 15.04ms | 21.35ms | ±3.26% |      34 |
| pdf-lib   |    18.7 | 53.55ms | 56.17ms | ±1.64% |      10 |

- **libpdf** is 3.56x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |    p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | -----: | -----: | ------: |
| copy 1 page                     |   957.3 | 1.04ms | 2.60ms | ±2.91% |     479 |
| copy 10 pages from 100-page PDF |   205.5 | 4.87ms | 7.09ms | ±2.02% |     103 |
| copy all 100 pages              |   132.5 | 7.55ms | 8.22ms | ±0.84% |      67 |

- **copy 1 page** is 4.66x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.23x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate all pages (double the document) |    1.1K | 908us | 1.34ms | ±0.74% |     551 |
| duplicate page 0                          |    1.1K | 922us | 1.64ms | ±1.05% |     543 |

- **duplicate all pages (double the document)** is 1.01x faster than duplicate page 0

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   662.7 |  1.51ms |  2.03ms | ±1.04% |     332 |
| merge 10 small PDFs     |   129.6 |  7.72ms |  8.21ms | ±0.80% |      65 |
| merge 2 x 100-page PDFs |    65.2 | 15.33ms | 26.25ms | ±5.77% |      33 |

- **merge 2 small PDFs** is 5.11x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 10.16x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  498us | 1.16ms | ±1.45% |   1,004 |
| draw 100 rectangles                 |    1.7K |  587us | 1.46ms | ±3.16% |     852 |
| draw 100 circles                    |   747.4 | 1.34ms | 3.19ms | ±2.96% |     374 |
| create 10 pages with mixed content  |   729.7 | 1.37ms | 2.50ms | ±2.04% |     365 |
| draw 100 text lines (standard font) |   607.0 | 1.65ms | 2.59ms | ±1.59% |     304 |

- **draw 100 lines** is 1.18x faster than draw 100 rectangles
- **draw 100 lines** is 2.69x faster than draw 100 circles
- **draw 100 lines** is 2.75x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.31x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   289.1 |  3.46ms |  6.26ms | ±3.80% |     145 |
| get form fields   |   273.7 |  3.65ms |  9.61ms | ±4.57% |     137 |
| flatten form      |   107.9 |  9.26ms | 11.95ms | ±2.39% |      54 |
| fill text fields  |    80.5 | 12.42ms | 16.22ms | ±3.49% |      41 |

- **read field values** is 1.06x faster than get form fields
- **read field values** is 2.68x faster than flatten form
- **read field values** is 3.59x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   15.5K |   64us |  149us | ±0.74% |   7,753 |
| load medium PDF (19KB) |   10.4K |   96us |  186us | ±0.59% |   5,184 |
| load form PDF (116KB)  |   723.8 | 1.38ms | 2.55ms | ±1.52% |     362 |
| load heavy PDF (9.9MB) |   438.5 | 2.28ms | 2.97ms | ±0.96% |     220 |

- **load small PDF (888B)** is 1.50x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 21.42x faster than load form PDF (116KB)
- **load small PDF (888B)** is 35.36x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | -----: | -----: | ------: |
| save unmodified (19KB)             |    9.0K |  111us |  255us | ±0.89% |   4,499 |
| incremental save (19KB)            |    5.4K |  184us |  395us | ±1.12% |   2,724 |
| save with modifications (19KB)     |    1.3K |  785us | 1.50ms | ±1.61% |     638 |
| save heavy PDF (9.9MB)             |   428.8 | 2.33ms | 2.76ms | ±0.62% |     215 |
| incremental save heavy PDF (9.9MB) |   174.5 | 5.73ms | 9.85ms | ±1.77% |      88 |

- **save unmodified (19KB)** is 1.65x faster than incremental save (19KB)
- **save unmodified (19KB)** is 7.06x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 20.98x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 51.56x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |   938.4 |  1.07ms |  2.30ms | ±2.93% |     470 |
| extractPages (1 page from 100-page PDF)  |   263.2 |  3.80ms |  6.34ms | ±2.18% |     132 |
| extractPages (1 page from 2000-page PDF) |    16.3 | 61.35ms | 62.81ms | ±1.40% |      10 |

- **extractPages (1 page from small PDF)** is 3.57x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 57.57x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    29.8 |  33.57ms |  43.09ms | ±5.63% |      15 |
| split 2000-page PDF (0.9MB) |     1.7 | 591.82ms | 591.82ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 17.63x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    16.1 | 62.10ms | 64.22ms | ±2.40% |       9 |
| extract first 100 pages from 2000-page PDF             |    15.4 | 65.10ms | 66.00ms | ±0.95% |       8 |
| extract every 10th page from 2000-page PDF (200 pages) |    13.2 | 76.02ms | 84.43ms | ±7.56% |       7 |

- **extract first 10 pages from 2000-page PDF** is 1.05x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.22x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
