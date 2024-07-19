import { ServiceLineListComponent } from './service-line-list/service-line-list.component';
import { ServicePackageListComponent } from './service-package-list/service-package-list.component';
import { ServiceLineItemComponent } from './service-line-item/service-line-item.component';
import { ServicePackageItemComponent } from './service-package-item/service-package-item.component';

export const COMPONENTS: any[] = [
    ServiceLineListComponent,
    ServiceLineItemComponent,
    ServicePackageListComponent,
    ServicePackageItemComponent
];

export * from './service-line-list/service-line-list.component';
export * from './service-package-list/service-package-list.component';
export * from './service-line-item/service-line-item.component';
export * from './service-package-item/service-package-item.component';