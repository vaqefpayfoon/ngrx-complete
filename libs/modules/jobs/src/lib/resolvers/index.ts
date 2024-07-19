//Mobile
import { CompletedResolver } from './mobile/completed.resolver';
import { CompletedExistsResolver } from './mobile/completed-exists.resolver';
import { BranchTeamsResolver } from './mobile/branch-teams.resolver';
import { ReservationsResolver } from './mobile/reservations.resolver';
import { ReservationExistsResolver } from './mobile/reservation-exists.resolver';
import { InProgressResolver } from './mobile/in-progress.resolver';
import { InProgressListResolver } from './mobile/in-progress-list.resolver';

//Service center
import { ServiceCenterScheduledResolver } from './service-center/service-center-scheduled.resolver';
import { ServiceCenterScheduledExistsResolver } from './service-center/service-center-scheduled-exists.resolver';
import { ServiceCenterDeclinedResolver } from './service-center/service-center-declined.resolver';
import { ServiceCenterDeclinedExistsResolver } from './service-center/service-center-declined-exists.resolver';

//Warranty
import { WarrantyResolver } from './reminders/warranty.resolver';
import { WarrantyExistsResolver } from './reminders/warranty-exists.resolver';

//manual reservation
import {ManualReservationsResolver} from './manual-reservation/manual-reservations.resolver'
import {ManualReservationExistsResolver} from './manual-reservation/manual-reservation-exists.resolver'
import { VehicleMakesResolver } from './manual-reservation/vehicle-makes.resolver';

export const resolvers: any[] = [
  CompletedResolver,
  CompletedExistsResolver,
  BranchTeamsResolver,
  ReservationsResolver,
  ReservationExistsResolver,
  InProgressResolver,
  ServiceCenterScheduledResolver,
  ServiceCenterScheduledExistsResolver,
  ServiceCenterDeclinedResolver,
  ServiceCenterDeclinedExistsResolver,
  WarrantyResolver,
  WarrantyExistsResolver,
  ManualReservationsResolver,
  ManualReservationExistsResolver,
  InProgressListResolver,
  VehicleMakesResolver
];

export * from './mobile/completed.resolver';
export * from './mobile/completed-exists.resolver';
export * from './mobile/branch-teams.resolver';
export * from './mobile/reservations.resolver';
export * from './mobile/reservation-exists.resolver';
export * from './mobile/in-progress.resolver';
export * from './service-center/service-center-scheduled.resolver';
export * from './service-center/service-center-scheduled-exists.resolver';
export * from './service-center/service-center-declined.resolver';
export * from './service-center/service-center-declined-exists.resolver';
export * from './reminders/warranty.resolver';
export * from './reminders/warranty-exists.resolver';
export * from './manual-reservation/manual-reservations.resolver';
export * from './manual-reservation/manual-reservation-exists.resolver';
export * from './mobile/in-progress-list.resolver';
export * from './manual-reservation/vehicle-makes.resolver';