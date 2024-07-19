import { InsurerGuard } from './insurer.guard';
import { InsurerExistsGuard } from './insurer-exists.guard';

export const guards = [InsurerGuard, InsurerExistsGuard];

export * from './insurer.guard';
export * from './insurer-exists.guard';
