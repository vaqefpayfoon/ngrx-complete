import { FilterPipe } from './filter/filter.pipe';
import { UnfilterPipe } from './unfilter/unfilter.pipe';
import { FormatStringPipe } from './format-string/format-string.pipe';
import { SortPipe } from './sort/sort.pipe';

export const PIPES: any[] = [
  FilterPipe,
  UnfilterPipe,
  FormatStringPipe,
  SortPipe,
];

export * from './filter/filter.pipe';
export * from './unfilter/unfilter.pipe';
export * from './format-string/format-string.pipe';
export * from './sort/sort.pipe';
