import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

// Model
import { IEnquiries } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-enquiry-card',
  templateUrl: './enquiry-card.component.html',
  styleUrls: ['./enquiry-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryCardComponent {
  @Input() disabled: boolean;

  @Input() enquiry: IEnquiries.IDocument;

  @Input() permissions: any;

  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Enquiry.GET_ENQUIRY]
    ) {
      return true;
    }
    return false;
  }
}
