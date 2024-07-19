import { InProgressGuard } from './in-progress.guard';
import { ReservationsGuard } from './reservations.guard';
import { BranchTeamsGuard } from './branch-teams.guard';
import { CompletedGuard } from './completed.guard';
import { ServiceCenterDeclinedGuard } from './service-center-declined.guard';
import { ServiceCenterScheduledGuard } from './service-center-scheduled.guard';
import { WarrantyGuard } from './warranty.guard';
import { WarrantyExistsGuard } from './warranty-exists.guard';
import { ServiceCenterScheduledExistsGuard } from './service-center-scheduled-exists.guard';
import { ServiceCenterDeclinedExistsGuard } from './service-center-declined-exists.guard';
import { ReservationExistsGuard } from './reservation-exists.guard';
import { CompletedExistsGuard } from './completed-exists.guard';
import {  ManualReservationExistsGuard} from './manual-reservation-exists.guard';

export const guards: any[] = [
  InProgressGuard,
  ReservationsGuard,
  ReservationExistsGuard,
  BranchTeamsGuard,
  CompletedGuard,
  CompletedExistsGuard,
  WarrantyGuard,
  WarrantyExistsGuard,
  ServiceCenterDeclinedGuard,
  ServiceCenterScheduledGuard,
  ServiceCenterScheduledExistsGuard,
  ServiceCenterDeclinedExistsGuard,
  ManualReservationExistsGuard
];

export * from './in-progress.guard';
export * from './reservations.guard';
export * from './reservation-exists.guard';
export * from './branch-teams.guard';
export * from './completed.guard';
export * from './completed-exists.guard';
export * from './warranty.guard';
export * from './warranty-exists.guard';
export * from './service-center-declined.guard';
export * from './service-center-declined-exists.guard';
export * from './service-center-scheduled.guard';
export * from './service-center-scheduled-exists.guard';
export * from './manual-reservation-exists.guard';
