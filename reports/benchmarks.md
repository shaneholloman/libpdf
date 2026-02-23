# Benchmark Report

> Generated on 2026-02-23 at 21:54:54 UTC
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
| libpdf    |   419.6 |  2.38ms |  3.07ms | ±0.91% |     210 |
| pdf-lib   |    24.3 | 41.10ms | 50.93ms | ±6.14% |      13 |

- **libpdf** is 17.25x faster than pdf-lib

### Create blank PDF

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   17.9K |  56us |  125us | ±1.35% |   8,963 |
| pdf-lib   |    2.5K | 405us | 1.31ms | ±2.25% |   1,237 |

- **libpdf** is 7.26x faster than pdf-lib

### Add 10 pages

| Benchmark | ops/sec |  Mean |    p99 |    RME | Samples |
| :-------- | ------: | ----: | -----: | -----: | ------: |
| libpdf    |   10.5K |  95us |  140us | ±0.90% |   5,258 |
| pdf-lib   |    2.0K | 490us | 1.67ms | ±2.46% |   1,020 |

- **libpdf** is 5.16x faster than pdf-lib

### Draw 50 rectangles

| Benchmark | ops/sec |   Mean |    p99 |    RME | Samples |
| :-------- | ------: | -----: | -----: | -----: | ------: |
| libpdf    |    3.3K |  304us |  712us | ±1.18% |   1,646 |
| pdf-lib   |   615.6 | 1.62ms | 5.66ms | ±6.31% |     308 |

- **libpdf** is 5.34x faster than pdf-lib

### Load and save PDF

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   408.7 |  2.45ms |  3.16ms | ±1.31% |     205 |
| pdf-lib   |    11.7 | 85.53ms | 90.13ms | ±3.17% |      10 |

- **libpdf** is 34.95x faster than pdf-lib

### Load, modify, and save PDF

| Benchmark | ops/sec |    Mean |      p99 |    RME | Samples |
| :-------- | ------: | ------: | -------: | -----: | ------: |
| libpdf    |    24.2 | 41.40ms |  49.20ms | ±4.22% |      13 |
| pdf-lib   |    11.0 | 90.64ms | 102.86ms | ±6.06% |      10 |

- **libpdf** is 2.19x faster than pdf-lib

### Extract single page from 100-page PDF

| Benchmark | ops/sec |   Mean |     p99 |    RME | Samples |
| :-------- | ------: | -----: | ------: | -----: | ------: |
| libpdf    |   274.1 | 3.65ms |  4.19ms | ±1.47% |     138 |
| pdf-lib   |   108.3 | 9.24ms | 12.53ms | ±2.82% |      55 |

- **libpdf** is 2.53x faster than pdf-lib

### Split 100-page PDF into single-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    30.6 | 32.69ms | 34.23ms | ±1.40% |      16 |
| pdf-lib   |    11.8 | 84.93ms | 87.33ms | ±2.29% |       6 |

- **libpdf** is 2.60x faster than pdf-lib

### Split 2000-page PDF into single-page PDFs (0.9MB)

| Benchmark | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------- | ------: | -------: | -------: | -----: | ------: |
| libpdf    |     1.6 | 607.94ms | 607.94ms | ±0.00% |       1 |
| pdf-lib   |   0.608 |    1.65s |    1.65s | ±0.00% |       1 |

- **libpdf** is 2.71x faster than pdf-lib

### Copy 10 pages between documents

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |   220.2 |  4.54ms |  5.16ms | ±0.90% |     111 |
| pdf-lib   |    83.9 | 11.92ms | 13.98ms | ±1.59% |      42 |

- **libpdf** is 2.62x faster than pdf-lib

### Merge 2 x 100-page PDFs

| Benchmark | ops/sec |    Mean |     p99 |    RME | Samples |
| :-------- | ------: | ------: | ------: | -----: | ------: |
| libpdf    |    71.6 | 13.96ms | 15.41ms | ±1.15% |      36 |
| pdf-lib   |    18.4 | 54.29ms | 68.04ms | ±6.53% |      10 |

- **libpdf** is 3.89x faster than pdf-lib

## Copying

### Copy pages between documents

| Benchmark                       | ops/sec |   Mean |    p99 |    RME | Samples |
| :------------------------------ | ------: | -----: | -----: | -----: | ------: |
| copy 1 page                     |    1.0K |  974us | 1.91ms | ±2.06% |     514 |
| copy 10 pages from 100-page PDF |   220.7 | 4.53ms | 8.32ms | ±2.90% |     111 |
| copy all 100 pages              |   139.6 | 7.16ms | 8.11ms | ±0.96% |      70 |

- **copy 1 page** is 4.65x faster than copy 10 pages from 100-page PDF
- **copy 1 page** is 7.36x faster than copy all 100 pages

### Duplicate pages within same document

| Benchmark                                 | ops/sec |  Mean |    p99 |    RME | Samples |
| :---------------------------------------- | ------: | ----: | -----: | -----: | ------: |
| duplicate all pages (double the document) |    1.2K | 854us | 1.61ms | ±1.02% |     586 |
| duplicate page 0                          |    1.2K | 869us | 1.64ms | ±1.24% |     576 |

- **duplicate all pages (double the document)** is 1.02x faster than duplicate page 0

### Merge PDFs

| Benchmark               | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------------- | ------: | ------: | ------: | -----: | ------: |
| merge 2 small PDFs      |   706.1 |  1.42ms |  2.61ms | ±1.22% |     354 |
| merge 10 small PDFs     |   136.9 |  7.31ms |  7.91ms | ±0.78% |      69 |
| merge 2 x 100-page PDFs |    75.4 | 13.27ms | 16.85ms | ±1.69% |      38 |

- **merge 2 small PDFs** is 5.16x faster than merge 10 small PDFs
- **merge 2 small PDFs** is 9.37x faster than merge 2 x 100-page PDFs

## Drawing

| Benchmark                           | ops/sec |   Mean |    p99 |    RME | Samples |
| :---------------------------------- | ------: | -----: | -----: | -----: | ------: |
| draw 100 lines                      |    2.0K |  491us | 1.13ms | ±1.42% |   1,019 |
| draw 100 rectangles                 |    1.8K |  564us | 1.28ms | ±2.08% |     887 |
| draw 100 circles                    |   789.8 | 1.27ms | 2.86ms | ±2.78% |     395 |
| create 10 pages with mixed content  |   765.7 | 1.31ms | 2.12ms | ±1.41% |     383 |
| draw 100 text lines (standard font) |   648.8 | 1.54ms | 2.21ms | ±1.12% |     325 |

- **draw 100 lines** is 1.15x faster than draw 100 rectangles
- **draw 100 lines** is 2.58x faster than draw 100 circles
- **draw 100 lines** is 2.66x faster than create 10 pages with mixed content
- **draw 100 lines** is 3.14x faster than draw 100 text lines (standard font)

## Forms

| Benchmark         | ops/sec |    Mean |     p99 |    RME | Samples |
| :---------------- | ------: | ------: | ------: | -----: | ------: |
| read field values |   339.9 |  2.94ms |  4.82ms | ±1.77% |     171 |
| get form fields   |   297.5 |  3.36ms |  6.87ms | ±4.69% |     149 |
| flatten form      |   120.8 |  8.28ms | 11.23ms | ±2.62% |      61 |
| fill text fields  |    92.0 | 10.87ms | 14.55ms | ±3.28% |      46 |

- **read field values** is 1.14x faster than get form fields
- **read field values** is 2.81x faster than flatten form
- **read field values** is 3.70x faster than fill text fields

## Loading

| Benchmark              | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------- | ------: | -----: | -----: | -----: | ------: |
| load small PDF (888B)  |   16.7K |   60us |  143us | ±0.65% |   8,331 |
| load medium PDF (19KB) |   10.6K |   94us |  181us | ±0.45% |   5,297 |
| load form PDF (116KB)  |   724.9 | 1.38ms | 2.40ms | ±1.21% |     363 |
| load heavy PDF (9.9MB) |   418.2 | 2.39ms | 2.82ms | ±0.84% |     210 |

- **load small PDF (888B)** is 1.57x faster than load medium PDF (19KB)
- **load small PDF (888B)** is 22.98x faster than load form PDF (116KB)
- **load small PDF (888B)** is 39.85x faster than load heavy PDF (9.9MB)

## Saving

| Benchmark                          | ops/sec |   Mean |    p99 |    RME | Samples |
| :--------------------------------- | ------: | -----: | -----: | -----: | ------: |
| save unmodified (19KB)             |    8.4K |  120us |  261us | ±2.54% |   4,176 |
| incremental save (19KB)            |    5.4K |  185us |  363us | ±2.40% |   2,703 |
| save with modifications (19KB)     |    1.2K |  810us | 2.07ms | ±2.02% |     618 |
| save heavy PDF (9.9MB)             |   397.6 | 2.51ms | 3.75ms | ±1.52% |     199 |
| incremental save heavy PDF (9.9MB) |   127.4 | 7.85ms | 9.29ms | ±2.95% |      64 |

- **save unmodified (19KB)** is 1.55x faster than incremental save (19KB)
- **save unmodified (19KB)** is 6.76x faster than save with modifications (19KB)
- **save unmodified (19KB)** is 21.00x faster than save heavy PDF (9.9MB)
- **save unmodified (19KB)** is 65.53x faster than incremental save heavy PDF (9.9MB)

## Splitting

### Extract single page

| Benchmark                                | ops/sec |    Mean |     p99 |    RME | Samples |
| :--------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extractPages (1 page from small PDF)     |   979.3 |  1.02ms |  2.43ms | ±3.98% |     490 |
| extractPages (1 page from 100-page PDF)  |   282.7 |  3.54ms |  4.80ms | ±1.44% |     142 |
| extractPages (1 page from 2000-page PDF) |    17.8 | 56.29ms | 57.44ms | ±0.70% |      10 |

- **extractPages (1 page from small PDF)** is 3.46x faster than extractPages (1 page from 100-page PDF)
- **extractPages (1 page from small PDF)** is 55.13x faster than extractPages (1 page from 2000-page PDF)

### Split into single-page PDFs

| Benchmark                   | ops/sec |     Mean |      p99 |    RME | Samples |
| :-------------------------- | ------: | -------: | -------: | -----: | ------: |
| split 100-page PDF (0.1MB)  |    31.9 |  31.39ms |  35.31ms | ±3.74% |      16 |
| split 2000-page PDF (0.9MB) |     1.8 | 571.29ms | 571.29ms | ±0.00% |       1 |

- **split 100-page PDF (0.1MB)** is 18.20x faster than split 2000-page PDF (0.9MB)

### Batch page extraction

| Benchmark                                              | ops/sec |    Mean |     p99 |    RME | Samples |
| :----------------------------------------------------- | ------: | ------: | ------: | -----: | ------: |
| extract first 10 pages from 2000-page PDF              |    17.4 | 57.38ms | 58.54ms | ±0.81% |       9 |
| extract first 100 pages from 2000-page PDF             |    16.4 | 61.05ms | 62.97ms | ±1.53% |       9 |
| extract every 10th page from 2000-page PDF (200 pages) |    15.4 | 64.74ms | 65.59ms | ±0.66% |       8 |

- **extract first 10 pages from 2000-page PDF** is 1.06x faster than extract first 100 pages from 2000-page PDF
- **extract first 10 pages from 2000-page PDF** is 1.13x faster than extract every 10th page from 2000-page PDF (200 pages)

---

_Results are machine-dependent. Use for relative comparison only._
