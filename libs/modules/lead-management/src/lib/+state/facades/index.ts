import { LeadFacade } from './lead.facade';
import { CorporatesFacade } from './corporates.facade';


export const facades: any[] = [
  LeadFacade,
  CorporatesFacade
];

export * from './lead.facade';
export * from './corporates.facade';
