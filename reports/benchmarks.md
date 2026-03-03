# Benchmark Report

> Generated on 2026-03-03 at 22:17:05 UTC
>
> System: linux | AMD EPYC 7763 64-Core Processor (4 cores) | 16GB RAM | Bun 1.3.10

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
| libpdf    |   405.2 |  2.47ms |  3.77ms | ±1.96% |     203 |
| pdf-lib   |    26.5 | 37.71ms | 44.75ms | ±4.55% |      14 |

- **libpdf** is 15.28x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   16.9K |  59us |  133us | ±1.55% |   8,452 |
| pdf-lib   |    2.4K | 410us | 1.44ms | ±2.52% |   1,220 |

- **libpdf** is 6.93x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |    9.8K | 102us |  181us | ±1.02% |   4,909 |
| pdf-lib   |    2.0K | 511us | 1.78ms | ±2.62% |     978 |

- **libpdf** is 5.02x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.2K |  317us |  767us | ±1.28% |   1,576 |
| pdf-lib   |   621.1 | 1.61ms | 5.49ms | ±5.75% |     311 |

- **libpdf** is 5.07x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   408.1 |  2.45ms |  3.60ms | ±1.83% |     205 |
| pdf-lib   |    11.4 | 87.69ms | 97.08ms | ±4.29% |      10 |

- **libpdf** is 35.78x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |    Mean |      p99 |     RME | Samples |
| :-------- | ------: | ------: | -------: | ------: | ------: |
| libpdf    |    19.3 | 51.69ms |  70.46ms | ±14.30% |      10 |
| pdf-lib   |    11.3 | 88.67ms | 102.15ms |  ±5.26% |      10 |

- **libpdf** is 1.72x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   234.9 | 4.26ms |  7.38ms | ±3.74% |     118 |
| pdf-lib   |   106.5 | 9.39ms | 11.76ms | ±2.57% |      54 |

- **libpdf** is 2.21x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |      p99 |    RME | Samples |
| :-------- | ------: | ------: | -------: | -----: | ------: |
| libpdf    |    27.5 | 36.37ms |  51.28ms | ±7.56% |      14 |
| pdf-lib   |    11.1 | 90.34ms | 101.45ms | ±8.00% |       6 |

- **libpdf** is 2.48x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.6 | 643.22ms | 643.22ms | ±0.00% |       1 |
| pdf-lib   |   0.610 |    1.64s |    1.64s | ±0.00% |       1 |

- **libpdf** is 2.55x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   200.7 |  4.98ms |  6.80ms | ±2.27% |     101 |
| pdf-lib   |    85.2 | 11.74ms | 12.86ms | ±1.29% |      43 |

- **libpdf** is 2.36x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    64.3 | 15.56ms | 32.02ms | ±6.95% |      33 |
| pdf-lib   |    18.9 | 52.91ms | 56.54ms | ±2.52% |      10 |

- **libpdf** is 3.40x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |     p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | ------: | -----: | ------: |
| copy 1 page                     |   942.5 | 1.06ms |  2.14ms | ±2.62% |     472 |
| copy 10 pages from 100-page PDF |   203.9 | 4.90ms |  6.63ms | ±2.28% |     102 |
| copy all 100 pages              |   124.5 | 8.03ms | 17.55ms | ±4.22% |      63 |

- **copy 1 page** is 4.62x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.57x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate page 0                          |    1.1K | 919us | 1.85ms | ±1.79% |     544 |
| duplicate all pages (double the document) |    1.1K | 931us | 2.03ms | ±1.72% |     537 |

- **duplicate page 0** is 1.01x faster than duplicate all pages (double the document)

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   643.3 |  1.55ms |  3.07ms | ±2.66% |     323 |
| merge 10 small PDFs     |   131.5 |  7.60ms |  8.96ms | ±1.91% |      66 |
| merge 2 x 100-page PDFs |    68.2 | 14.66ms | 16.68ms | ±1.81% |      35 |

- **merge 2 small PDFs** is 4.89x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.43x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  504us | 1.20ms | ±1.61% |     993 |
| draw 100 rectangles                 |    1.7K |  573us | 1.47ms | ±3.14% |     874 |
| draw 100 circles                    |   777.2 | 1.29ms | 2.82ms | ±2.65% |     390 |
| create 10 pages with mixed content  |   761.6 | 1.31ms | 2.19ms | ±1.53% |     381 |
| draw 100 text lines (standard font) |   636.6 | 1.57ms | 2.39ms | ±1.39% |     319 |

- **draw 100 lines** is 1.14x faster than draw 100 rectangles
- **draw 100 lines** is 2.55x faster than draw 100 circles
- **draw 100 lines** is 2.61x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.12x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   337.6 |  2.96ms |  5.37ms | ±2.04% |     169 |
| get form fields   |   294.3 |  3.40ms |  7.68ms | ±4.77% |     148 |
| flatten form      |   124.0 |  8.07ms | 11.26ms | ±2.43% |      62 |
| fill text fields  |    92.0 | 10.87ms | 15.62ms | ±3.87% |      47 |

- **read field values** is 1.15x faster than get form fields
- **read field values** is 2.72x faster than flatten form
- **read field values** is 3.67x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   16.6K |   60us |  146us | ±0.70% |   8,287 |
| load medium PDF (19KB) |   11.1K |   90us |  115us | ±0.42% |   5,527 |
| load form PDF (116KB)  |   763.3 | 1.31ms | 2.36ms | ±1.41% |     382 |
| load heavy PDF (9.9MB) |   444.9 | 2.25ms | 2.88ms | ±0.89% |     223 |

- **load small PDF (888B)** is 1.50x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 21.71x faster than load form PDF (116KB)
- **load small PDF (888B)** is 37.25x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | -----: | -----: | ------: |
| save unmodified (19KB)             |    9.2K |  109us |  255us | ±0.89% |   4,597 |
| incremental save (19KB)            |    6.3K |  159us |  327us | ±0.80% |   3,141 |
| save with modifications (19KB)     |    1.4K |  741us | 1.41ms | ±1.27% |     676 |
| save heavy PDF (9.9MB)             |   423.6 | 2.36ms | 2.78ms | ±1.08% |     212 |
| incremental save heavy PDF (9.9MB) |   119.5 | 8.37ms | 9.67ms | ±3.21% |      60 |

- **save unmodified (19KB)** is 1.46x faster than incremental save (19KB)
- **save unmodified (19KB)** is 6.81x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 21.70x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 76.92x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |   995.0 |  1.01ms |  2.07ms | ±2.30% |     498 |
| extractPages (1 page from 100-page PDF)  |   269.8 |  3.71ms |  4.38ms | ±1.21% |     135 |
| extractPages (1 page from 2000-page PDF) |    16.1 | 62.04ms | 81.20ms | ±7.88% |      10 |

- **extractPages (1 page from small PDF)** is 3.69x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 61.73x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    31.8 |  31.50ms |  37.41ms | ±4.61% |      16 |
| split 2000-page PDF (0.9MB) |     1.8 | 565.05ms | 565.05ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 17.94x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    16.5 | 60.53ms | 62.13ms | ±1.31% |       9 |
| extract first 100 pages from 2000-page PDF             |    15.5 | 64.62ms | 66.15ms | ±1.43% |       8 |
| extract every 10th page from 2000-page PDF (200 pages) |    14.1 | 70.95ms | 88.62ms | ±8.69% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.07x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.17x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
