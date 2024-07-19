import { InProgressFacade } from './in-progress.facade';
import { ReservationsFacade } from './reservations.facade';
import { ServiceCenterDeclinedFacade } from './service-center-declined.facade';
import { ServiceCenterScheduledFacade } from './service-center-scheduled.facade';
import { BranchTeamFacade } from './branch-team.facade';
import { CompletedFacade } from './completed.facade';
import { WarrantiesFacade } from './warranties.facade';
import { ManualReservationFacade } from './manual-reservation.facade';
import { ServiceLineFacade } from './service-line.facade';

export const facades: any[] = [
  InProgressFacade,
  ReservationsFacade,
  ServiceCenterDeclinedFacade,
  ServiceCenterScheduledFacade,
  BranchTeamFacade,
  CompletedFacade,
  WarrantiesFacade,
  ManualReservationFacade,
  ServiceLineFacade,
];

export * from './in-progress.facade';
export * from './reservations.facade';
export * from './service-center-declined.facade';
export * from './service-center-scheduled.facade';
export * from './branch-team.facade';
export * from './completed.facade';
export * from './warranties.facade';
export * from './manual-reservation.facade';
export * from './service-line.facade';
