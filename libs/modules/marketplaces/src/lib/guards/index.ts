import { ProductReferencesGuard } from './product-references.guard';
import { ProductReferenceExistsGuard } from './product-reference-exists.guard';
import { ProductCoveragesGuard } from './product-coverages.guard';
import { ProductCoveragesExistsGuard } from './product-coverages-exists.guard';

export const guards: any[] = [
  ProductReferencesGuard,
  ProductCoveragesGuard,
  ProductReferenceExistsGuard,
  ProductCoveragesExistsGuard
];

export * from './product-references.guard';
export * from './product-reference-exists.guard';
export * from './product-coverages.guard';
export * from './product-coverages-exists.guard';
