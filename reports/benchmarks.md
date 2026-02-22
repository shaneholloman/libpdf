# Benchmark Report

> Generated on 2026-02-22 at 02:29:57 UTC
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
| libpdf    |   422.9 |  2.36ms |  3.93ms | ±1.72% |     212 |
| pdf-lib   |    25.9 | 38.65ms | 42.80ms | ±3.71% |      13 |

- **libpdf** is 16.35x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   17.8K |  56us |  128us | ±1.47% |   8,900 |
| pdf-lib   |    2.4K | 415us | 1.33ms | ±2.28% |   1,206 |

- **libpdf** is 7.38x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   10.0K | 100us |  190us | ±1.16% |   5,023 |
| pdf-lib   |    2.0K | 494us | 1.64ms | ±2.45% |   1,012 |

- **libpdf** is 4.97x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.2K |  310us |  677us | ±1.07% |   1,614 |
| pdf-lib   |   630.4 | 1.59ms | 5.66ms | ±5.86% |     316 |

- **libpdf** is 5.12x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |    Mean |      p99 |    RME | Samples |
| :-------- | ------: | ------: | -------: | -----: | ------: |
| libpdf    |   434.8 |  2.30ms |   3.46ms | ±1.32% |     218 |
| pdf-lib   |    11.4 | 87.36ms | 101.18ms | ±5.66% |      10 |

- **libpdf** is 37.99x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |    Mean |      p99 |     RME | Samples |
| :-------- | ------: | ------: | -------: | ------: | ------: |
| libpdf    |    17.5 | 57.18ms |  75.04ms | ±11.69% |      10 |
| pdf-lib   |    11.3 | 88.61ms | 102.46ms |  ±5.39% |      10 |

- **libpdf** is 1.55x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   268.7 | 3.72ms |  6.11ms | ±2.54% |     135 |
| pdf-lib   |   110.6 | 9.04ms | 12.13ms | ±2.01% |      56 |

- **libpdf** is 2.43x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    30.1 | 33.21ms | 35.60ms | ±1.97% |      16 |
| pdf-lib   |    11.4 | 87.34ms | 92.14ms | ±5.14% |       6 |

- **libpdf** is 2.63x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.6 | 613.36ms | 613.36ms | ±0.00% |       1 |
| pdf-lib   |   0.620 |    1.61s |    1.61s | ±0.00% |       1 |

- **libpdf** is 2.63x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   222.1 |  4.50ms |  5.21ms | ±1.15% |     112 |
| pdf-lib   |    85.0 | 11.76ms | 13.22ms | ±1.36% |      43 |

- **libpdf** is 2.61x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    68.4 | 14.61ms | 22.03ms | ±3.89% |      35 |
| pdf-lib   |    18.9 | 52.77ms | 54.27ms | ±1.11% |      10 |

- **libpdf** is 3.61x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |    p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | -----: | -----: | ------: |
| copy 1 page                     |   986.0 | 1.01ms | 2.25ms | ±2.56% |     493 |
| copy 10 pages from 100-page PDF |   220.1 | 4.54ms | 5.44ms | ±1.30% |     111 |
| copy all 100 pages              |   135.4 | 7.38ms | 8.03ms | ±0.76% |      68 |

- **copy 1 page** is 4.48x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.28x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate all pages (double the document) |    1.1K | 883us | 1.23ms | ±0.58% |     567 |
| duplicate page 0                          |    1.1K | 902us | 1.66ms | ±1.20% |     555 |

- **duplicate all pages (double the document)** is 1.02x faster than duplicate page 0

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   686.0 |  1.46ms |  1.86ms | ±0.86% |     343 |
| merge 10 small PDFs     |   134.3 |  7.45ms |  9.78ms | ±1.12% |      68 |
| merge 2 x 100-page PDFs |    70.4 | 14.20ms | 22.61ms | ±3.64% |      36 |

- **merge 2 small PDFs** is 5.11x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.74x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  489us | 1.08ms | ±1.38% |   1,023 |
| draw 100 rectangles                 |    1.8K |  557us | 1.22ms | ±2.31% |     899 |
| draw 100 circles                    |   769.0 | 1.30ms | 2.79ms | ±2.83% |     385 |
| create 10 pages with mixed content  |   745.3 | 1.34ms | 2.26ms | ±1.62% |     373 |
| draw 100 text lines (standard font) |   634.4 | 1.58ms | 2.32ms | ±1.21% |     318 |

- **draw 100 lines** is 1.14x faster than draw 100 rectangles
- **draw 100 lines** is 2.66x faster than draw 100 circles
- **draw 100 lines** is 2.74x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.22x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   332.5 |  3.01ms |  4.94ms | ±1.63% |     167 |
| get form fields   |   300.9 |  3.32ms |  6.03ms | ±2.98% |     151 |
| flatten form      |   120.4 |  8.31ms | 11.17ms | ±2.30% |      61 |
| fill text fields  |    92.4 | 10.83ms | 16.02ms | ±3.82% |      47 |

- **read field values** is 1.10x faster than get form fields
- **read field values** is 2.76x faster than flatten form
- **read field values** is 3.60x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   17.0K |   59us |  141us | ±0.64% |   8,509 |
| load medium PDF (19KB) |   11.0K |   91us |  167us | ±0.44% |   5,520 |
| load form PDF (116KB)  |   741.1 | 1.35ms | 2.54ms | ±1.35% |     371 |
| load heavy PDF (9.9MB) |   445.0 | 2.25ms | 2.61ms | ±0.50% |     223 |

- **load small PDF (888B)** is 1.54x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 22.96x faster than load form PDF (116KB)
- **load small PDF (888B)** is 38.24x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |     p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | ------: | -----: | ------: |
| save unmodified (19KB)             |    9.9K |  101us |   249us | ±0.89% |   4,942 |
| incremental save (19KB)            |    6.1K |  165us |   351us | ±0.91% |   3,034 |
| save with modifications (19KB)     |    1.4K |  737us |  1.40ms | ±1.18% |     679 |
| save heavy PDF (9.9MB)             |   444.4 | 2.25ms |  2.74ms | ±1.05% |     223 |
| incremental save heavy PDF (9.9MB) |   126.7 | 7.89ms | 14.99ms | ±9.42% |      64 |

- **save unmodified (19KB)** is 1.63x faster than incremental save (19KB)
- **save unmodified (19KB)** is 7.28x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 22.24x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 78.02x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |    1.0K |   972us |  1.90ms | ±2.16% |     515 |
| extractPages (1 page from 100-page PDF)  |   281.4 |  3.55ms |  4.35ms | ±0.96% |     141 |
| extractPages (1 page from 2000-page PDF) |    18.0 | 55.52ms | 56.39ms | ±0.81% |      10 |

- **extractPages (1 page from small PDF)** is 3.66x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 57.12x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    30.8 |  32.46ms |  40.17ms | ±4.27% |      16 |
| split 2000-page PDF (0.9MB) |     1.7 | 596.63ms | 596.63ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 18.38x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    17.6 | 56.90ms | 58.47ms | ±1.23% |       9 |
| extract first 100 pages from 2000-page PDF             |    16.7 | 59.84ms | 61.00ms | ±0.90% |       9 |
| extract every 10th page from 2000-page PDF (200 pages) |    15.2 | 65.98ms | 77.25ms | ±5.84% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.05x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.16x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
