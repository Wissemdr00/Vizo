# Story 2.2: Excel & JSON File Upload

## Status: ✅ Complete

## Story
As a user, I want to upload Excel (.xlsx/.xls) and JSON files with automatic schema detection.

## Acceptance Criteria
- [x] Excel parsing with `xlsx` package (sheet selection support)
- [x] JSON parsing (array of objects or nested structures)
- [x] Type inference for both formats
- [x] Consistent schema format across all file types

### Files Created
- `src/lib/parsers/excel.ts` — `parseExcel()` with sheet enumeration and selection
- `src/lib/parsers/json.ts` — `parseJSON()` with nested object flattening

### Technical Notes
- Excel: Uses SheetJS (`xlsx`) to read workbooks, defaults to first sheet
- JSON: Handles `[{...}]` arrays directly; nested objects get dot-notation column names
- Both parsers output the same `{ columns: [{ name, type }], preview: rows[] }` format
