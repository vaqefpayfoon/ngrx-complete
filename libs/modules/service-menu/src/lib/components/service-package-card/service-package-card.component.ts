import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { permissionTags } from '@neural/shared/data';
import { IServiceLine, IServicePackage } from '../../models';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'neural-service-package-card',
  templateUrl: './service-package-card.component.html',
  styleUrls: ['./service-package-card.component.scss']
})
export class ServicePackageCardComponent {

  @Input() disabled: boolean;
  @Input() servicePackage: IServicePackage.IDocument;
  @Input() permissions: any;
  @Output() activeStatusChange = new EventEmitter<IServiceLine.IChangeStatus>();
  @Output() customerViewStatusChange = new EventEmitter<IServiceLine.IChangeStatus>();
  @Output() resetToggle = new EventEmitter<IServicePackage.IDocument>();

  constructor(private dialog: MatDialog) {}

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceLinePackage.UPDATE_SERVICE_LINE_PACKAGE]
    ) {
      return true;
    }

    return false;
  }
  toggleStatusActive(event?: any) {
    if (this.statusPermission) {
      let data: string = 'This package will be activated';
      if (!event.checked) {
        data = 'This package will be deactivated. You can turn it on again anytime'
      }
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '370px',
        data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          const value: IServiceLine.IChangeStatus = {
            uuid: this.servicePackage.uuid,
            active: event.checked,
            isInCustomerApp: event.checked ? this.servicePackage.isInCustomerApp : false
          }
          this.activeStatusChange.emit(value);
        } else {
          this.resetToggle.emit(this.servicePackage);
        }
      });
    }
  }
  toggleStatusIsInCustomerApp(event?: any) {
    if (this.statusPermission) {
      let data: string = 'This service package will be visible in the customer app';
      if (!event.checked) {
        data = 'This service package will be hidden in the customer app. You can turn it on again anytime.'
      }
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '370px',
        data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          const value: IServiceLine.IChangeStatus = {
            uuid: this.servicePackage.uuid,
            active: this.servicePackage.active,
            isInCustomerApp: event.checked
          }
          this.customerViewStatusChange.emit(value);
        } else {
          this.resetToggle.emit(this.servicePackage);
        }
      });
    }
  }

}
