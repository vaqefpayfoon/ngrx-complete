import { FleetsResolver } from './fleets.resolver';
import { FleetExistsResolver } from './fleet-exists.resolver';

export const resolvers: any[] = [FleetsResolver, FleetExistsResolver];

export * from './fleets.resolver';
export * from './fleet-exists.resolver';
