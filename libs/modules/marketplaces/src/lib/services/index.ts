import { ProductReferencesService } from './product-references.service';
import { ProductCoveragesService } from './product-coverages.service';

export const services: any[] = [
  ProductReferencesService,
  ProductCoveragesService
];

export * from './product-references.service';
export * from './product-coverages.service';
