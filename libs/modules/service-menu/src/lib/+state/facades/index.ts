import { ServiceLineFacade } from './service-line.facade';
import { ServicePackageFacade } from './service-package.facade';


export const facades: any[] = [
    ServiceLineFacade,
    ServicePackageFacade
];

export * from './service-line.facade';
export * from './service-package.facade';