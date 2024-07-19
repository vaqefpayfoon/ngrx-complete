import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { permissionTags } from '@neural/shared/data';
import { IServiceLine } from '../../models';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'neural-service-line-card',
  templateUrl: './service-line-card.component.html',
  styleUrls: ['./service-line-card.component.scss']
})
export class ServiceLineCardComponent {

  @Input() disabled: boolean;
  @Input() serviceLine: IServiceLine.IDocument;
  @Input() permissions: any;
  @Output() activeStatusChange = new EventEmitter<IServiceLine.IChangeStatus>();
  @Output() customerViewStatusChange = new EventEmitter<IServiceLine.IChangeStatus>();
  @Output() resetToggle = new EventEmitter<IServiceLine.IDocument>();

  constructor(private dialog: MatDialog) {}

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceLine.UPDATE_SERVICE_LINE]
    ) {
      return true;
    }

    return false;
  }
  toggleStatusActive(event?: any) {
    if (this.statusPermission) {
      let data: string = 'This service will be activated';
      if (!event.checked) {
        data = 'This service will be deactivated. You can turn it on again anytime'
      }
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '370px',
        data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          const value: IServiceLine.IChangeStatus = {
            uuid: this.serviceLine.uuid,
            active: event.checked,
            isInCustomerApp: event.checked ? this.serviceLine.isInCustomerApp : false
          }
          this.activeStatusChange.emit(value);
        } else {
          this.resetToggle.emit(this.serviceLine);
        }
      });
    }
  }
  toggleStatusIsInCustomerApp(event?: any) {
    if (this.statusPermission) {
      let data: string = 'This service will be visible in the customer app';
      if (!event.checked) {
        data = 'This service will be hidden in the customer app. You can turn it on again anytime.'
      }
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '370px',
        data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          const value: IServiceLine.IChangeStatus = {
            uuid: this.serviceLine.uuid,
            active: this.serviceLine.active,
            isInCustomerApp: event.checked
          }
          this.customerViewStatusChange.emit(value);
        } else {
          this.resetToggle.emit(this.serviceLine);
        }
      });
    }
  }
}
