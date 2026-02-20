# Benchmark Report

> Generated on 2026-02-20 at 02:53:32 UTC
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
| libpdf    |   399.5 |  2.50ms |  4.50ms | ±2.72% |     200 |
| pdf-lib   |    25.2 | 39.68ms | 49.18ms | ±5.52% |      13 |

- **libpdf** is 15.85x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   16.3K |  61us |  141us | ±1.59% |   8,175 |
| pdf-lib   |    2.5K | 407us | 1.30ms | ±2.34% |   1,229 |

- **libpdf** is 6.65x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   10.3K |  97us |  148us | ±0.88% |   5,138 |
| pdf-lib   |    2.0K | 490us | 1.60ms | ±2.43% |   1,020 |

- **libpdf** is 5.04x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.2K |  309us |  693us | ±1.13% |   1,618 |
| pdf-lib   |   593.8 | 1.68ms | 6.61ms | ±6.41% |     297 |

- **libpdf** is 5.45x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   414.9 |  2.41ms |  4.04ms | ±1.80% |     208 |
| pdf-lib   |    11.6 | 85.92ms | 96.85ms | ±4.81% |      10 |

- **libpdf** is 35.65x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    18.6 | 53.83ms | 59.83ms | ±5.33% |      10 |
| pdf-lib   |    11.8 | 84.80ms | 92.79ms | ±3.03% |      10 |

- **libpdf** is 1.58x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   260.2 | 3.84ms |  5.98ms | ±2.06% |     131 |
| pdf-lib   |   110.8 | 9.03ms | 11.83ms | ±1.46% |      56 |

- **libpdf** is 2.35x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |      p99 |    RME | Samples |
| :-------- | ------: | ------: | -------: | -----: | ------: |
| libpdf    |    29.1 | 34.36ms |  39.63ms | ±3.33% |      15 |
| pdf-lib   |    11.1 | 90.21ms | 106.00ms | ±9.20% |       6 |

- **libpdf** is 2.63x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.6 | 621.18ms | 621.18ms | ±0.00% |       1 |
| pdf-lib   |   0.609 |    1.64s |    1.64s | ±0.00% |       1 |

- **libpdf** is 2.64x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   215.5 |  4.64ms |  5.23ms | ±0.76% |     108 |
| pdf-lib   |    85.7 | 11.67ms | 12.62ms | ±0.99% |      43 |

- **libpdf** is 2.51x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    68.1 | 14.67ms | 17.77ms | ±1.65% |      35 |
| pdf-lib   |    19.1 | 52.30ms | 52.79ms | ±0.50% |      10 |

- **libpdf** is 3.56x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |     p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | ------: | -----: | ------: |
| copy 1 page                     |   981.6 | 1.02ms |  2.09ms | ±2.81% |     491 |
| copy 10 pages from 100-page PDF |   209.6 | 4.77ms |  8.80ms | ±3.20% |     105 |
| copy all 100 pages              |   131.9 | 7.58ms | 10.20ms | ±1.28% |      66 |

- **copy 1 page** is 4.68x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.44x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate page 0                          |    1.1K | 923us | 1.64ms | ±1.12% |     542 |
| duplicate all pages (double the document) |    1.0K | 960us | 1.72ms | ±1.28% |     521 |

- **duplicate page 0** is 1.04x faster than duplicate all pages (double the document)

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   682.2 |  1.47ms |  1.85ms | ±0.59% |     342 |
| merge 10 small PDFs     |   126.7 |  7.89ms |  8.48ms | ±0.77% |      64 |
| merge 2 x 100-page PDFs |    71.3 | 14.03ms | 14.72ms | ±0.75% |      36 |

- **merge 2 small PDFs** is 5.38x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.57x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  493us | 1.09ms | ±1.28% |   1,015 |
| draw 100 rectangles                 |    1.7K |  586us | 1.51ms | ±3.15% |     853 |
| draw 100 circles                    |   765.0 | 1.31ms | 2.90ms | ±2.67% |     383 |
| create 10 pages with mixed content  |   742.9 | 1.35ms | 2.37ms | ±1.75% |     372 |
| draw 100 text lines (standard font) |   633.6 | 1.58ms | 2.43ms | ±1.34% |     317 |

- **draw 100 lines** is 1.19x faster than draw 100 rectangles
- **draw 100 lines** is 2.65x faster than draw 100 circles
- **draw 100 lines** is 2.73x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.20x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   329.3 |  3.04ms |  3.68ms | ±0.98% |     165 |
| get form fields   |   283.8 |  3.52ms |  8.54ms | ±4.39% |     142 |
| flatten form      |   116.2 |  8.61ms | 11.78ms | ±2.55% |      59 |
| fill text fields  |    88.3 | 11.33ms | 14.62ms | ±3.67% |      45 |

- **read field values** is 1.16x faster than get form fields
- **read field values** is 2.83x faster than flatten form
- **read field values** is 3.73x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   16.1K |   62us |  147us | ±0.70% |   8,048 |
| load medium PDF (19KB) |   10.5K |   95us |  145us | ±0.41% |   5,242 |
| load form PDF (116KB)  |   742.3 | 1.35ms | 2.50ms | ±1.55% |     372 |
| load heavy PDF (9.9MB) |   443.0 | 2.26ms | 3.00ms | ±0.97% |     222 |

- **load small PDF (888B)** is 1.54x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 21.68x faster than load form PDF (116KB)
- **load small PDF (888B)** is 36.33x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | -----: | -----: | ------: |
| save unmodified (19KB)             |    9.0K |  111us |  262us | ±0.88% |   4,517 |
| incremental save (19KB)            |    5.6K |  178us |  377us | ±1.01% |   2,803 |
| save with modifications (19KB)     |    1.3K |  780us | 1.51ms | ±1.54% |     641 |
| save heavy PDF (9.9MB)             |   399.0 | 2.51ms | 2.89ms | ±0.53% |     200 |
| incremental save heavy PDF (9.9MB) |   179.5 | 5.57ms | 7.61ms | ±1.08% |      90 |

- **save unmodified (19KB)** is 1.61x faster than incremental save (19KB)
- **save unmodified (19KB)** is 7.05x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 22.64x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 50.33x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |   923.9 |  1.08ms |  2.21ms | ±2.65% |     462 |
| extractPages (1 page from 100-page PDF)  |   253.8 |  3.94ms |  6.70ms | ±3.20% |     127 |
| extractPages (1 page from 2000-page PDF) |    17.2 | 58.29ms | 59.47ms | ±1.11% |      10 |

- **extractPages (1 page from small PDF)** is 3.64x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 53.85x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    31.4 |  31.88ms |  36.70ms | ±3.18% |      16 |
| split 2000-page PDF (0.9MB) |     1.7 | 588.74ms | 588.74ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 18.47x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    16.6 | 60.28ms | 61.79ms | ±1.29% |       9 |
| extract first 100 pages from 2000-page PDF             |    15.7 | 63.84ms | 65.16ms | ±0.93% |       8 |
| extract every 10th page from 2000-page PDF (200 pages) |    14.4 | 69.45ms | 82.93ms | ±6.93% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.06x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.15x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
