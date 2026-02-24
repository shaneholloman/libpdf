# Benchmark Report

> Generated on 2026-02-24 at 04:27:22 UTC
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
| libpdf    |   394.8 |  2.53ms |  4.75ms | ±3.32% |     198 |
| pdf-lib   |    25.2 | 39.64ms | 50.58ms | ±5.97% |      13 |

- **libpdf** is 15.65x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   16.3K |  61us |  181us | ±3.90% |   8,146 |
| pdf-lib   |    2.4K | 419us | 1.39ms | ±2.49% |   1,193 |

- **libpdf** is 6.83x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   10.4K |  96us |  144us | ±0.89% |   5,215 |
| pdf-lib   |    2.0K | 505us | 1.68ms | ±2.53% |     991 |

- **libpdf** is 5.27x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.3K |  302us |  709us | ±1.08% |   1,655 |
| pdf-lib   |   605.8 | 1.65ms | 5.66ms | ±5.93% |     304 |

- **libpdf** is 5.46x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   415.0 |  2.41ms |  4.38ms | ±2.25% |     208 |
| pdf-lib   |    11.6 | 86.36ms | 98.82ms | ±4.35% |      10 |

- **libpdf** is 35.83x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    23.8 | 42.06ms | 59.05ms | ±8.62% |      12 |
| pdf-lib   |    11.4 | 87.41ms | 97.76ms | ±3.63% |      10 |

- **libpdf** is 2.08x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   280.4 | 3.57ms |  4.00ms | ±0.55% |     141 |
| pdf-lib   |   109.6 | 9.13ms | 11.16ms | ±1.70% |      55 |

- **libpdf** is 2.56x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    30.9 | 32.41ms | 35.31ms | ±1.91% |      16 |
| pdf-lib   |    11.6 | 86.45ms | 89.32ms | ±2.16% |       6 |

- **libpdf** is 2.67x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.7 | 590.07ms | 590.07ms | ±0.00% |       1 |
| pdf-lib   |   0.618 |    1.62s |    1.62s | ±0.00% |       1 |

- **libpdf** is 2.74x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   224.4 |  4.46ms |  5.21ms | ±0.93% |     113 |
| pdf-lib   |    83.3 | 12.01ms | 13.65ms | ±1.62% |      42 |

- **libpdf** is 2.69x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    71.5 | 13.98ms | 17.43ms | ±1.76% |      36 |
| pdf-lib   |    18.8 | 53.22ms | 54.58ms | ±1.58% |      10 |

- **libpdf** is 3.81x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |    p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | -----: | -----: | ------: |
| copy 1 page                     |    1.0K |  958us | 1.88ms | ±2.33% |     522 |
| copy 10 pages from 100-page PDF |   225.7 | 4.43ms | 7.71ms | ±2.19% |     113 |
| copy all 100 pages              |   141.4 | 7.07ms | 8.97ms | ±1.13% |      71 |

- **copy 1 page** is 4.62x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.38x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate page 0                          |    1.2K | 848us | 1.28ms | ±0.84% |     590 |
| duplicate all pages (double the document) |    1.2K | 851us | 1.60ms | ±1.11% |     588 |

- **duplicate page 0** is 1.00x faster than duplicate all pages (double the document)

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   716.1 |  1.40ms |  2.60ms | ±1.20% |     359 |
| merge 10 small PDFs     |   140.5 |  7.12ms |  7.62ms | ±0.65% |      71 |
| merge 2 x 100-page PDFs |    76.3 | 13.11ms | 13.93ms | ±0.94% |      39 |

- **merge 2 small PDFs** is 5.10x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.39x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  502us | 1.03ms | ±1.39% |     996 |
| draw 100 rectangles                 |    1.8K |  541us | 1.14ms | ±1.54% |     925 |
| draw 100 circles                    |   793.7 | 1.26ms | 2.71ms | ±2.57% |     397 |
| create 10 pages with mixed content  |   756.3 | 1.32ms | 2.13ms | ±1.56% |     379 |
| draw 100 text lines (standard font) |   633.5 | 1.58ms | 2.39ms | ±1.55% |     317 |

- **draw 100 lines** is 1.08x faster than draw 100 rectangles
- **draw 100 lines** is 2.51x faster than draw 100 circles
- **draw 100 lines** is 2.63x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.14x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   344.6 |  2.90ms |  4.59ms | ±1.54% |     173 |
| get form fields   |   307.7 |  3.25ms |  6.00ms | ±3.44% |     154 |
| flatten form      |   122.7 |  8.15ms | 10.90ms | ±2.17% |      62 |
| fill text fields  |    91.2 | 10.96ms | 15.62ms | ±3.89% |      46 |

- **read field values** is 1.12x faster than get form fields
- **read field values** is 2.81x faster than flatten form
- **read field values** is 3.78x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   14.3K |   70us |  158us | ±3.57% |   7,168 |
| load medium PDF (19KB) |    8.9K |  113us |  236us | ±4.32% |   4,427 |
| load form PDF (116KB)  |   739.2 | 1.35ms | 2.59ms | ±2.29% |     370 |
| load heavy PDF (9.9MB) |   419.7 | 2.38ms | 3.61ms | ±1.62% |     210 |

- **load small PDF (888B)** is 1.62x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 19.39x faster than load form PDF (116KB)
- **load small PDF (888B)** is 34.16x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | -----: | -----: | ------: |
| save unmodified (19KB)             |    9.1K |  110us |  239us | ±0.87% |   4,555 |
| incremental save (19KB)            |    6.3K |  160us |  332us | ±0.79% |   3,133 |
| save with modifications (19KB)     |    1.4K |  725us | 1.15ms | ±0.86% |     690 |
| save heavy PDF (9.9MB)             |   427.9 | 2.34ms | 2.61ms | ±0.41% |     214 |
| incremental save heavy PDF (9.9MB) |   128.2 | 7.80ms | 9.18ms | ±3.21% |      65 |

- **save unmodified (19KB)** is 1.45x faster than incremental save (19KB)
- **save unmodified (19KB)** is 6.60x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 21.29x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 71.07x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |    1.0K |   969us |  1.86ms | ±2.28% |     516 |
| extractPages (1 page from 100-page PDF)  |   277.1 |  3.61ms |  6.75ms | ±3.25% |     139 |
| extractPages (1 page from 2000-page PDF) |    17.3 | 57.80ms | 67.70ms | ±4.42% |      10 |

- **extractPages (1 page from small PDF)** is 3.72x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 59.65x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    31.2 |  32.02ms |  36.15ms | ±3.50% |      16 |
| split 2000-page PDF (0.9MB) |     1.7 | 584.56ms | 584.56ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 18.25x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    17.7 | 56.37ms | 57.59ms | ±1.00% |       9 |
| extract first 100 pages from 2000-page PDF             |    16.7 | 59.79ms | 61.24ms | ±1.27% |       9 |
| extract every 10th page from 2000-page PDF (200 pages) |    15.3 | 65.36ms | 73.85ms | ±4.86% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.06x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.16x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
