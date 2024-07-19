import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IAgreements } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-agreement-card',
  templateUrl: './agreement-card.component.html',
  styleUrls: ['./agreement-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgreementCardComponent {
  @Input() disabled: boolean;

  @Input() agreement: IAgreements.IDocument;

  @Input() permissions: any;

  get type() {
    return this.agreement.type;
  }

  get clauses() {
    return this.agreement.clauses;
  }

  get pdfUrl() {
    return this.agreement.pdfUrl;
  }

  get uuid() {
    return this.agreement.uuid;
  }

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Agreement.GET_AGREEMENT]
    ) {
      return true;
    }
    return false;
  }
}
