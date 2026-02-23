# Benchmark Report

> Generated on 2026-02-23 at 03:22:37 UTC
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
| libpdf    |   396.0 |  2.53ms |  4.13ms | ±1.56% |     198 |
| pdf-lib   |    25.2 | 39.63ms | 44.44ms | ±2.77% |      13 |

- **libpdf** is 15.69x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   17.8K |  56us |  122us | ±1.20% |   8,897 |
| pdf-lib   |    2.5K | 404us | 1.23ms | ±2.27% |   1,237 |

- **libpdf** is 7.19x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   10.2K |  98us |  178us | ±0.89% |   5,125 |
| pdf-lib   |    1.9K | 529us | 1.83ms | ±2.75% |     945 |

- **libpdf** is 5.43x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.2K |  310us |  758us | ±1.24% |   1,614 |
| pdf-lib   |   549.2 | 1.82ms | 7.46ms | ±7.02% |     275 |

- **libpdf** is 5.88x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |   388.5 |   2.57ms |   3.73ms | ±1.12% |     195 |
| pdf-lib   |     9.8 | 102.33ms | 111.27ms | ±4.31% |      10 |

- **libpdf** is 39.75x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |    23.2 |  43.03ms |  54.06ms | ±6.15% |      12 |
| pdf-lib   |     9.9 | 101.44ms | 112.27ms | ±3.78% |      10 |

- **libpdf** is 2.36x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   270.4 | 3.70ms |  4.18ms | ±0.63% |     136 |
| pdf-lib   |   111.2 | 9.00ms | 10.99ms | ±1.55% |      56 |

- **libpdf** is 2.43x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |      p99 |    RME | Samples |
| :-------- | ------: | ------: | -------: | -----: | ------: |
| libpdf    |    30.8 | 32.51ms |  34.93ms | ±1.66% |      16 |
| pdf-lib   |    10.5 | 95.21ms | 109.23ms | ±7.96% |       6 |

- **libpdf** is 2.93x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.6 | 607.64ms | 607.64ms | ±0.00% |       1 |
| pdf-lib   |   0.587 |    1.70s |    1.70s | ±0.00% |       1 |

- **libpdf** is 2.80x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   217.4 |  4.60ms |  5.18ms | ±0.69% |     109 |
| pdf-lib   |    84.5 | 11.84ms | 13.54ms | ±1.53% |      43 |

- **libpdf** is 2.57x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    70.2 | 14.25ms | 19.30ms | ±2.27% |      36 |
| pdf-lib   |    19.0 | 52.61ms | 54.36ms | ±1.07% |      10 |

- **libpdf** is 3.69x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |     p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | ------: | -----: | ------: |
| copy 1 page                     |    1.1K |  934us |  1.81ms | ±1.93% |     536 |
| copy 10 pages from 100-page PDF |   230.5 | 4.34ms |  5.15ms | ±1.47% |     116 |
| copy all 100 pages              |   138.5 | 7.22ms | 13.70ms | ±3.19% |      70 |

- **copy 1 page** is 4.64x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.73x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate all pages (double the document) |    1.2K | 847us | 1.21ms | ±0.81% |     591 |
| duplicate page 0                          |    1.1K | 891us | 1.60ms | ±1.50% |     562 |

- **duplicate all pages (double the document)** is 1.05x faster than duplicate page 0

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   721.1 |  1.39ms |  1.87ms | ±0.93% |     361 |
| merge 10 small PDFs     |   139.7 |  7.16ms |  8.10ms | ±0.80% |      70 |
| merge 2 x 100-page PDFs |    76.9 | 13.00ms | 15.28ms | ±1.16% |      39 |

- **merge 2 small PDFs** is 5.16x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.37x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  492us | 1.11ms | ±1.37% |   1,016 |
| draw 100 rectangles                 |    1.9K |  538us | 1.10ms | ±1.54% |     930 |
| draw 100 circles                    |   785.5 | 1.27ms | 2.61ms | ±2.60% |     394 |
| create 10 pages with mixed content  |   765.9 | 1.31ms | 2.18ms | ±1.44% |     383 |
| draw 100 text lines (standard font) |   646.2 | 1.55ms | 2.59ms | ±1.43% |     324 |

- **draw 100 lines** is 1.09x faster than draw 100 rectangles
- **draw 100 lines** is 2.59x faster than draw 100 circles
- **draw 100 lines** is 2.65x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.14x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   343.9 |  2.91ms |  5.11ms | ±1.93% |     172 |
| get form fields   |   299.7 |  3.34ms |  7.25ms | ±4.90% |     150 |
| flatten form      |   124.5 |  8.03ms | 11.04ms | ±2.69% |      63 |
| fill text fields  |    94.4 | 10.59ms | 15.64ms | ±3.48% |      48 |

- **read field values** is 1.15x faster than get form fields
- **read field values** is 2.76x faster than flatten form
- **read field values** is 3.64x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   17.6K |   57us |  121us | ±0.57% |   8,781 |
| load medium PDF (19KB) |   10.7K |   93us |  181us | ±0.56% |   5,355 |
| load form PDF (116KB)  |   771.8 | 1.30ms | 2.30ms | ±1.23% |     386 |
| load heavy PDF (9.9MB) |   455.2 | 2.20ms | 2.57ms | ±0.48% |     228 |

- **load small PDF (888B)** is 1.64x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 22.75x faster than load form PDF (116KB)
- **load small PDF (888B)** is 38.58x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |     p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | ------: | -----: | ------: |
| save unmodified (19KB)             |    9.6K |  104us |   232us | ±0.86% |   4,809 |
| incremental save (19KB)            |    6.1K |  163us |   357us | ±0.98% |   3,069 |
| save with modifications (19KB)     |    1.3K |  750us |  1.43ms | ±1.58% |     667 |
| save heavy PDF (9.9MB)             |   439.4 | 2.28ms |  2.58ms | ±0.40% |     220 |
| incremental save heavy PDF (9.9MB) |   197.0 | 5.08ms | 13.84ms | ±7.37% |      99 |

- **save unmodified (19KB)** is 1.57x faster than incremental save (19KB)
- **save unmodified (19KB)** is 7.22x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 21.89x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 48.81x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |    1.0K |   966us |  1.94ms | ±2.48% |     518 |
| extractPages (1 page from 100-page PDF)  |   279.0 |  3.58ms |  6.88ms | ±3.08% |     140 |
| extractPages (1 page from 2000-page PDF) |    17.6 | 56.74ms | 65.32ms | ±4.17% |      10 |

- **extractPages (1 page from small PDF)** is 3.71x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 58.75x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    31.3 |  31.98ms |  37.07ms | ±4.29% |      16 |
| split 2000-page PDF (0.9MB) |     1.8 | 559.67ms | 559.67ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 17.50x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    17.8 | 56.22ms | 57.95ms | ±1.03% |       9 |
| extract first 100 pages from 2000-page PDF             |    16.3 | 61.34ms | 71.32ms | ±5.09% |       9 |
| extract every 10th page from 2000-page PDF (200 pages) |    15.7 | 63.51ms | 64.25ms | ±0.69% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.09x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.13x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
