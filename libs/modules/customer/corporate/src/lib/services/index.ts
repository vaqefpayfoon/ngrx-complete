import { CorporatesService } from './corporates.service';
import { BranchesService } from './branches.service';
import { AppsService } from './apps.service';
import { AgreementsService } from './agreements.service';

export const services: any[] = [
  CorporatesService,
  BranchesService,
  AppsService,
  AgreementsService
];

export * from './corporates.service';
export * from './branches.service';
export * from './apps.service';
export * from './agreements.service';
