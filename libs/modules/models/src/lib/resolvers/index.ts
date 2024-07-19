import { ModelsResolver } from './models.resolver';
import { ModelExistsResolver } from './model-exists.resolver';
import { BrandSeriesExistsResolver } from './brand-series-exists.resolver';

export const resolvers: any[] = [
  ModelsResolver,
  ModelExistsResolver,
  BrandSeriesExistsResolver,
];

export * from './models.resolver';
export * from './model-exists.resolver';
export * from './brand-series-exists.resolver';
