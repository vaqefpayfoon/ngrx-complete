import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { IInsuranceEnquiries } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-insurance-enquiry-card',
  templateUrl: './insurance-enquiry-card.component.html',
  styleUrls: [
    './insurance-enquiry-card.component.scss',
    '../enquiry-card/enquiry-card.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceEnquiryCardComponent {
  @Input() disabled: boolean;

  @Input() permissions: any;

  @Input() enquiry: IInsuranceEnquiries.IDocument;

  @Output() remark = new EventEmitter<IInsuranceEnquiries.IDocument>();

  showRemark(enquiry: IInsuranceEnquiries.IDocument) {
    this.remark.emit(enquiry);
  }

  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.InsuranceEnquiry.GET_INSURANCE_ENQUIRY]
    ) {
      return true;
    }
    return false;
  }
}
