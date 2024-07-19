import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { ISales } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-valuation-card',
  templateUrl: './valuation-card.component.html',
  styleUrls: ['./valuation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValuationCardComponent {

  @Input() disabled: boolean;

  @Input() valuation: ISales.IDocument;

  @Input() permissions: any;

  constructor() {}

  get updatePermission() {
    if (this.permissions && this.permissions[permissionTags.Sale.GET_SALE]) {
      return true;
    }
    return false;
  }

}
