import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { ITemplates } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-template-card',
  templateUrl: './template-card.component.html',
  styleUrls: ['./template-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateCardComponent {
  @Input() template: ITemplates.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<ITemplates.IDocument>();
  
  @Output() remove = new EventEmitter<ITemplates.IDocument>();

  @Output() send = new EventEmitter<ITemplates.IDocument>();

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.DEACTIVATE_TEMPLATE] &&
      this.permissions[permissionTags.Template.ACTIVATE_TEMPLATE]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Template.DEACTIVATE_TEMPLATE]
    ) {
      return this.permissions[permissionTags.Template.DEACTIVATE_TEMPLATE] &&
        this.template.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Template.ACTIVATE_TEMPLATE]
    ) {
      return this.permissions[permissionTags.Template.ACTIVATE_TEMPLATE] &&
        !this.template.active
        ? true
        : false;
    }

    return false;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.CREATE_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.DELETE_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }

  /**
   * @description create permission
   * @readonly
   * @memberof TemplateCardComponent
   */
  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Template.GET_TEMPLATE]
    ) {
      return true;
    }
    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.template);
    }
  }

  onDelete(event?: any) {
    if (this.statusPermission) {
      this.remove.emit(this.template);
    }
  }

  constructor() {}
}
