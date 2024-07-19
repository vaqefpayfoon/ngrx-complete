import { ValidationService } from './validation.service';
import { SharedService } from './shared.service';
import { FontLoaderService } from './font-loader.service';

export const services: any[] = [
  ValidationService,
  SharedService,
  FontLoaderService,
];

export * from './validation.service';
export * from './shared.service';
export * from './font-loader.service';
