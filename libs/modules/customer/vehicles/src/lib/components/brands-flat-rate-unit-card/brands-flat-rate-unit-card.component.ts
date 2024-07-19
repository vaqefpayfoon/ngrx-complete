import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

// Models
import { IBrandsFlatRateUnit } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-brands-flat-rate-unit-card',
  templateUrl: './brands-flat-rate-unit-card.component.html',
  styleUrls: ['./brands-flat-rate-unit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsFlatRateUnitCardComponent {
  panelOpenState = false;

  @Input() totalFRU: number;
  @Input() pendingFRU: number;

  @Input() brandsFRU: IBrandsFlatRateUnit.IDocument[];
  @Input() remainingBrands: string[];
  
  @Input() permissions: any;

  constructor() {}

  get previewPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.SET_BRAND_FRU]
    ) {
      return true;
    }
    return false;
  }
  
  get getPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Vehicle.GET_BRAND_FRU]
    ) {
      return true;
    }
    return false;
  }
}
