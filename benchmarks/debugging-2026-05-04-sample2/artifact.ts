// pagination.ts - reported bug: last page sometimes has 0 items, sometimes shows duplicates
// DO NOT FIX

interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function paginate<T>(
  allItems: T[],
  page: number,
  pageSize: number
): PageResult<T> {
  const total = allItems.length;
  const start = page * pageSize;
  const end = start + pageSize;
  const items = allItems.slice(start, end);

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: end < total,
  };
}

// Bug repro:
// const items = Array.from({length: 23}, (_, i) => i);  // 0..22
// paginate(items, 0, 10) → items 0..9, hasMore=true ✓
// paginate(items, 1, 10) → items 10..19, hasMore=true ✓
// paginate(items, 2, 10) → items 20..22 (3 items), hasMore=false ✓
// paginate(items, 3, 10) → items=[] (empty page), hasMore=false ✗ should not be reached
//
// Caller bug pattern:
//   let page = 0;
//   while (true) {
//     const result = paginate(items, page, 10);
//     console.log(result.items);
//     if (!result.hasMore) break;
//     page++;
//   }
//
// User reports: "sometimes my UI shows 0 items on last page" or "off by one in count"
// They pass page as 1-indexed sometimes:
//   paginate(items, 1, 10) — but mean "page 1" (first page), not "page index 1"
// Code uses 0-indexed but UI passes 1-indexed → off-by-one
//
// Find the bug. Note: paginate function itself works correctly given 0-indexed input.
// The bug is interface ambiguity / convention mismatch.
