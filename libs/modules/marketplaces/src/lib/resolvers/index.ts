//product references
import { ProductReferencesResolver } from './product-references/product-references.resolver';
import { ProductReferenceExistsResolver } from './product-references/product-reference-exists.resolver';

//Product coverages
import { ProductCoveragesResolver } from './product-coverages/product-coverages.resolver';
import { ProductCoverageExistsResolver } from './product-coverages/product-coverage-exists.resolver';

export const resolvers: any[] = [
  ProductReferencesResolver,
  ProductReferenceExistsResolver,
  ProductCoveragesResolver,
  ProductCoverageExistsResolver,
];

export * from './product-references/product-references.resolver';
export * from './product-references/product-reference-exists.resolver';
export * from './product-coverages/product-coverages.resolver';
export * from './product-coverages/product-coverage-exists.resolver';
