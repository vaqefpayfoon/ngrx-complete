import { ReservationsService } from './reservations.service';
import { BranchTeamService } from './branch-team.service';
import { WarrantyService } from './warranty.service';
import { ManualReservationsService } from './manual-reservations.service';
import {ServiceLineService  } from './service-line.service';

export const services: any[] = [
  ReservationsService,
  BranchTeamService,
  WarrantyService,
  ManualReservationsService,
  ServiceLineService,
];

export * from './reservations.service';
export * from './branch-team.service';
export * from './warranty.service';
export * from './manual-reservations.service';
export * from './service-line.service';
