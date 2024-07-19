import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ServiceLineCardComponent } from './service-line-card/service-line-card.component';
import { ServicePackageCardComponent } from './service-package-card/service-package-card.component';
import { ServiceLineFormComponent } from './service-line-form/service-line-form.component';
import { ServicePackageFormComponent } from './service-package-form/service-package-form.component';
import { SyncDmsConfirmationDialogComponent } from './sync-dms-confirmation-dialog/sync-dms-confirmation-dialog.component';

export const COMPONENTS: any[] = [
  ServiceLineCardComponent,
  ServicePackageCardComponent,
  ServiceLineFormComponent,
  ServicePackageFormComponent,
  ConfirmModalComponent,
  SyncDmsConfirmationDialogComponent,
];

export * from './service-line-card/service-line-card.component';
export * from './service-package-card/service-package-card.component';
export * from './service-line-form/service-line-form.component';
export * from './confirm-modal/confirm-modal.component';
export * from './sync-dms-confirmation-dialog/sync-dms-confirmation-dialog.component';
export * from './service-package-form/service-package-form.component';
