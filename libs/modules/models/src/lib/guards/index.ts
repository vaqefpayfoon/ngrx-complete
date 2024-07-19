import { ModelsGuard } from './models.guard';
import { ModelExistsGuard } from './model-exists.guard';
import { BrandSeriesExistsGuard } from './brand-series-exists.guard';

export const guards: any[] = [
  ModelsGuard,
  ModelExistsGuard,
  BrandSeriesExistsGuard
];

export * from './models.guard';
export * from './model-exists.guard';
export * from './brand-series-exists.guard';
