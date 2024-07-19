import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Model
import { IServices } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {

  categoryType = IServices.Category;

  @Input() disabled: boolean;

  @Input() service: IServices.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<IServices.IDocument>();

  constructor() { }

  get uuid() {
    return this.service.uuid;
  }

  get icon() {
    return this.service.icon;
  }
  
  get title() {
    return this.service.title;
  }
  
  get subTitle() {
    return this.service.subtitle;
  }
  
  get flatRateUnit() {
    return this.service.flatRateUnit;
  }
  
  get category() {
    return this.service.category;
  }
  
  get isMainService() {
    return this.service.isMainService;
  }
  
  get active() {
    return this.service.isActive;
  }

  toggleStatus(event?: any) {
    if(this.statusPermission){
      this.status.emit(this.service);
    }
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Service.DEACTIVATE_SERVICE] &&
      this.permissions[permissionTags.Service.ACTIVATE_SERVICE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Service.DEACTIVATE_SERVICE]
    ) {
      return this.permissions[
        permissionTags.Service.DEACTIVATE_SERVICE
      ] && this.service.isActive
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Service.ACTIVATE_SERVICE]
    ) {
      return this.permissions[
        permissionTags.Service.ACTIVATE_SERVICE
      ] && !this.service.isActive
        ? true
        : false;
    }

    return false;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Service.GET_SERVICE]
    ) {
      return true;
    }
    return false;
  }

}
