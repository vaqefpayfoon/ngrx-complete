import { FleetsGuard } from './fleets.guard';
import { FleetExistsGuard } from './fleet-exists.guard';

export const guards: any[] = [FleetsGuard, FleetExistsGuard];

export * from './fleets.guard';
export * from './fleet-exists.guard';
