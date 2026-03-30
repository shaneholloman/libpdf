# Benchmark Report

> Generated on 2026-03-30 at 07:26:55 UTC
>
> System: linux | AMD EPYC 7763 64-Core Processor (4 cores) | 16GB RAM | Bun 1.3.11

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

| Benchmark       | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------------- | ------: | ------: | ------: | -----: | ------: |
| libpdf          |   382.6 |  2.61ms |  5.01ms | ±2.63% |     192 |
| @cantoo/pdf-lib |    26.3 | 38.04ms | 40.83ms | ±2.01% |      14 |
| pdf-lib         |    25.9 | 38.68ms | 44.63ms | ±4.79% |      13 |

- **libpdf** is 14.55x faster than @cantoo/pdf-lib
- **libpdf** is 14.80x faster than pdf-lib

### Create blank PDF

| Benchmark       | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------------- | ------: | ----: | -----: | -----: | ------: |
| libpdf          |   19.1K |  52us |  117us | ±1.08% |   9,561 |
| pdf-lib         |    2.6K | 385us | 1.28ms | ±2.20% |   1,298 |
| @cantoo/pdf-lib |    2.4K | 419us | 1.46ms | ±2.38% |   1,194 |

- **libpdf** is 7.37x faster than pdf-lib
- **libpdf** is 8.01x faster than @cantoo/pdf-lib

### Add 10 pages

| Benchmark       | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------------- | ------: | ----: | -----: | -----: | ------: |
| libpdf          |   10.8K |  92us |  146us | ±0.84% |   5,414 |
| @cantoo/pdf-lib |    2.3K | 438us | 1.86ms | ±2.82% |   1,142 |
| pdf-lib         |    2.1K | 476us | 1.54ms | ±2.38% |   1,050 |

- **libpdf** is 4.74x faster than @cantoo/pdf-lib
- **libpdf** is 5.16x faster than pdf-lib

### Draw 50 rectangles

| Benchmark       | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------------- | ------: | -----: | -----: | -----: | ------: |
| libpdf          |    3.3K |  299us |  739us | ±1.22% |   1,672 |
| pdf-lib         |   659.5 | 1.52ms | 4.73ms | ±5.64% |     330 |
| @cantoo/pdf-lib |   502.6 | 1.99ms | 5.33ms | ±5.67% |     252 |

- **libpdf** is 5.07x faster than pdf-lib
- **libpdf** is 6.65x faster than @cantoo/pdf-lib

### Load and save PDF

| Benchmark       | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------- | ------: | -------: | -------: | -----: | ------: |
| libpdf          |   394.8 |   2.53ms |   4.60ms | ±2.63% |     198 |
| pdf-lib         |    11.4 |  87.84ms | 102.70ms | ±5.86% |      10 |
| @cantoo/pdf-lib |     6.4 | 156.25ms | 170.53ms | ±3.22% |      10 |

- **libpdf** is 34.68x faster than pdf-lib
- **libpdf** is 61.68x faster than @cantoo/pdf-lib

### Load, modify, and save PDF

| Benchmark       | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------- | ------: | -------: | -------: | -----: | ------: |
| libpdf          |    25.0 |  39.98ms |  54.20ms | ±6.57% |      13 |
| pdf-lib         |    11.7 |  85.79ms | 100.64ms | ±5.00% |      10 |
| @cantoo/pdf-lib |     6.5 | 152.81ms | 157.64ms | ±1.51% |      10 |

- **libpdf** is 2.15x faster than pdf-lib
- **libpdf** is 3.82x faster than @cantoo/pdf-lib

### Extract single page from 100-page PDF

| Benchmark       | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------------- | ------: | -----: | ------: | -----: | ------: |
| libpdf          |   286.6 | 3.49ms |  5.93ms | ±1.64% |     144 |
| pdf-lib         |   109.6 | 9.13ms | 13.80ms | ±3.19% |      55 |
| @cantoo/pdf-lib |   104.6 | 9.56ms | 11.92ms | ±2.08% |      53 |

- **libpdf** is 2.62x faster than pdf-lib
- **libpdf** is 2.74x faster than @cantoo/pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark       | ops/sec |    Mean |      p99 |    RME | Samples |
| :-------------- | ------: | ------: | -------: | -----: | ------: |
| libpdf          |    31.9 | 31.33ms |  35.74ms | ±3.98% |      16 |
| pdf-lib         |    11.8 | 84.95ms |  89.09ms | ±3.08% |       6 |
| @cantoo/pdf-lib |    10.9 | 91.38ms | 103.93ms | ±8.24% |       6 |

- **libpdf** is 2.71x faster than pdf-lib
- **libpdf** is 2.92x faster than @cantoo/pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark       | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------- | ------: | -------: | -------: | -----: | ------: |
| libpdf          |     1.8 | 550.89ms | 550.89ms | ±0.00% |       1 |
| pdf-lib         |   0.647 |    1.55s |    1.55s | ±0.00% |       1 |
| @cantoo/pdf-lib |   0.615 |    1.63s |    1.63s | ±0.00% |       1 |

- **libpdf** is 2.81x faster than pdf-lib
- **libpdf** is 2.95x faster than @cantoo/pdf-lib

### Copy 10 pages between documents

| Benchmark       | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------------- | ------: | ------: | ------: | -----: | ------: |
| libpdf          |   230.3 |  4.34ms |  5.05ms | ±0.89% |     116 |
| pdf-lib         |    86.7 | 11.53ms | 12.83ms | ±1.13% |      44 |
| @cantoo/pdf-lib |    74.5 | 13.42ms | 19.21ms | ±3.50% |      38 |

- **libpdf** is 2.66x faster than pdf-lib
- **libpdf** is 3.09x faster than @cantoo/pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark       | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------------- | ------: | ------: | ------: | -----: | ------: |
| libpdf          |    72.9 | 13.73ms | 19.84ms | ±3.66% |      37 |
| pdf-lib         |    19.3 | 51.86ms | 54.04ms | ±1.61% |      10 |
| @cantoo/pdf-lib |    16.1 | 62.14ms | 64.73ms | ±1.81% |       9 |

- **libpdf** is 3.78x faster than pdf-lib
- **libpdf** is 4.53x faster than @cantoo/pdf-lib

### Fill FINTRAC form fields

| Benchmark       | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------------- | ------: | ------: | ------: | -----: | ------: |
| libpdf          |    50.2 | 19.90ms | 25.60ms | ±4.49% |      26 |
| pdf-lib         |    31.2 | 32.05ms | 36.81ms | ±3.99% |      16 |
| @cantoo/pdf-lib |    30.7 | 32.61ms | 43.16ms | ±6.09% |      16 |

- **libpdf** is 1.61x faster than pdf-lib
- **libpdf** is 1.64x faster than @cantoo/pdf-lib

### Fill and flatten FINTRAC form

| Benchmark       | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------------- | ------: | ------: | ------: | -----: | ------: |
| libpdf          |    56.4 | 17.73ms | 21.07ms | ±3.26% |      29 |
| pdf-lib         |  FAILED |       - |       - |      - |       0 |
| @cantoo/pdf-lib |    27.0 | 37.08ms | 50.16ms | ±6.96% |      14 |

- **libpdf** is 2.09x faster than @cantoo/pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |    p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | -----: | -----: | ------: |
| copy 1 page                     |    1.0K |  977us | 2.38ms | ±2.85% |     512 |
| copy 10 pages from 100-page PDF |   232.6 | 4.30ms | 5.48ms | ±1.20% |     117 |
| copy all 100 pages              |   145.1 | 6.89ms | 8.08ms | ±1.25% |      73 |

- **copy 1 page** is 4.40x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.05x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate page 0                          |    1.2K | 817us | 1.25ms | ±0.89% |     612 |
| duplicate all pages (double the document) |    1.2K | 842us | 1.50ms | ±0.99% |     594 |

- **duplicate page 0** is 1.03x faster than duplicate all pages (double the document)

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   732.4 |  1.37ms |  2.07ms | ±1.13% |     367 |
| merge 10 small PDFs     |   140.1 |  7.14ms |  9.53ms | ±1.51% |      71 |
| merge 2 x 100-page PDFs |    77.1 | 12.97ms | 13.86ms | ±1.12% |      39 |

- **merge 2 small PDFs** is 5.23x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.50x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.2K |  465us | 1.06ms | ±1.49% |   1,077 |
| draw 100 rectangles                 |    1.8K |  542us | 1.25ms | ±2.43% |     923 |
| draw 100 circles                    |   841.0 | 1.19ms | 2.59ms | ±2.40% |     421 |
| create 10 pages with mixed content  |   782.8 | 1.28ms | 2.12ms | ±1.46% |     392 |
| draw 100 text lines (standard font) |   628.1 | 1.59ms | 2.31ms | ±1.37% |     315 |

- **draw 100 lines** is 1.17x faster than draw 100 rectangles
- **draw 100 lines** is 2.56x faster than draw 100 circles
- **draw 100 lines** is 2.75x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.43x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   363.5 |  2.75ms |  3.46ms | ±0.92% |     182 |
| get form fields   |   319.2 |  3.13ms |  5.49ms | ±3.07% |     160 |
| flatten form      |   126.5 |  7.91ms | 12.94ms | ±3.22% |      64 |
| fill text fields  |    88.9 | 11.25ms | 15.64ms | ±4.11% |      45 |

- **read field values** is 1.14x faster than get form fields
- **read field values** is 2.87x faster than flatten form
- **read field values** is 4.09x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   18.3K |   55us |  117us | ±0.56% |   9,173 |
| load medium PDF (19KB) |   11.5K |   87us |  182us | ±0.55% |   5,726 |
| load form PDF (116KB)  |   793.1 | 1.26ms | 2.29ms | ±1.39% |     397 |
| load heavy PDF (9.9MB) |   482.9 | 2.07ms | 2.45ms | ±0.64% |     242 |

- **load small PDF (888B)** is 1.60x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 23.13x faster than load form PDF (116KB)
- **load small PDF (888B)** is 37.99x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | -----: | -----: | ------: |
| save unmodified (19KB)             |   10.2K |   98us |  224us | ±0.76% |   5,094 |
| incremental save (19KB)            |    6.6K |  152us |  311us | ±0.86% |   3,301 |
| save with modifications (19KB)     |    1.4K |  713us | 1.36ms | ±1.30% |     702 |
| save heavy PDF (9.9MB)             |   457.2 | 2.19ms | 2.70ms | ±1.15% |     229 |
| incremental save heavy PDF (9.9MB) |   141.2 | 7.08ms | 8.20ms | ±2.61% |      71 |

- **save unmodified (19KB)** is 1.54x faster than incremental save (19KB)
- **save unmodified (19KB)** is 7.26x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 22.28x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 72.14x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |    1.1K |   935us |  2.41ms | ±2.92% |     535 |
| extractPages (1 page from 100-page PDF)  |   292.7 |  3.42ms |  6.21ms | ±2.01% |     147 |
| extractPages (1 page from 2000-page PDF) |    18.8 | 53.11ms | 54.62ms | ±1.53% |      10 |

- **extractPages (1 page from small PDF)** is 3.65x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 56.78x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    33.9 |  29.49ms |  35.02ms | ±3.65% |      17 |
| split 2000-page PDF (0.9MB) |     1.9 | 527.03ms | 527.03ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 17.87x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    18.1 | 55.34ms | 56.51ms | ±1.54% |      10 |
| extract first 100 pages from 2000-page PDF             |    17.2 | 58.24ms | 60.09ms | ±2.04% |       9 |
| extract every 10th page from 2000-page PDF (200 pages) |    15.6 | 63.93ms | 77.58ms | ±7.46% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.05x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.16x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
