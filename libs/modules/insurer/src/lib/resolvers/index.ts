import { InsurerResolver } from './insurer.resolver';
import { InsurerExistsResolver } from './insurer-exists.resolver';

export const resolvers = [InsurerResolver, InsurerExistsResolver];

export * from './insurer.resolver';
export * from './insurer-exists.resolver';
