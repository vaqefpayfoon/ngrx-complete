import { InProgressEffects } from './in-progress.effects';
import { ServiceCenterDeclinedEffects } from './service-center-declined.effects';
import { ServiceCenterScheduledEffects } from './service-center-scheduled.effects';
import { ReservationsEffects } from './reservations.effects';
import { BranchTeamEffects } from './branch-team.effects';
import { CompletedEffects } from './completed.effects';
import { WarrantiesEffects } from './warranties.effects';
import { ManualReservationEffects } from './manual-reservation.effects';
import { CorporatesEffects } from './corporates.effects';
import { ServiceLineEffect } from './service-line.effect';

export const EFFECTS: any[] = [
  InProgressEffects,
  ReservationsEffects,
  ServiceCenterDeclinedEffects,
  ServiceCenterScheduledEffects,
  BranchTeamEffects,
  CompletedEffects,
  WarrantiesEffects,
  ManualReservationEffects,
  CorporatesEffects,
  ServiceLineEffect,
];

export * from './in-progress.effects';
export * from './reservations.effects';
export * from './service-center-declined.effects';
export * from './service-center-scheduled.effects';
export * from './branch-team.effects';
export * from './completed.effects';
export * from './warranties.effects';
export * from './manual-reservation.effects';
export * from './corporates.effects';
export * from './service-line.effect';
