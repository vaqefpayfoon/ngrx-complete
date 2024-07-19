import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { permissionTags } from '@neural/shared/data';
import { LeadFacade } from '../../+state/facades';
import { LeadDirective } from '../../directives';
import { ILead } from '../../models';

@Component({
  selector: 'neural-lead-card',
  templateUrl: './lead-card.component.html',
  styleUrls: ['./lead-card.component.scss'],
})
export class LeadCardComponent extends LeadDirective<ILead.IDocument> {
  constructor() {
    super();
  }
  @Output() statusChanged = new EventEmitter<{changes: ILead.IUpdate, lead: ILead.IDocument }>();
  get previewPermission(): boolean {
    if (this.permissions && this.permissions[permissionTags.Lead.GET_LEAD]) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (this.permissions && this.permissions[permissionTags.Lead.UPDATE_LEAD]) {
      return true;
    }
    return false;
  }

  get cancelPermission() {
    if (this.permissions && this.permissions[permissionTags.Lead.LIST_LEADS]) {
      return true;
    }
    return false;
  }
  onStatusChanged() {
    const update: ILead.IUpdate = {
      status: this.lead.status == ILead.Status.CLOSED ? ILead.Status.ACTIVATED : ILead.Status.CLOSED,
      salesAdvisorUuid: this.lead?.salesAdvisor?.uuid,
    };
    this.statusChanged.emit({ changes: update, lead: this.lead });
  }
  get LeadStatus() {
    return (this.lead.status === ILead.Status.PENDING || 
      this.lead.status === ILead.Status[ILead.Status.PENDING]) ? true : false
  }
  get getStatus() {
    return (this.lead.status === ILead.Status.ACTIVATED || 
      this.lead.status === ILead.Status[ILead.Status.ACTIVATED]) ? 'Close' : 'Reactivated'
  }
}
