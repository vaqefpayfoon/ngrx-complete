import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { ICountry } from '../../models';

// Country tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-country-card',
  templateUrl: './country-card.component.html',
  styleUrls: ['./country-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryCardComponent {
  @Input() country: ICountry.IDocument;

  @Input() permissions: any;

  @Output()
  status: EventEmitter<ICountry.IDocument> = new EventEmitter<
    ICountry.IDocument
  >();

  constructor() {}

  get name(): string {
    return this.country.name;
  }

  get currencies(): ICountry.Currency[] {
    return this.country.codes.currencies;
  }

  get states(): ICountry.State[] {
    return this.country.states;
  }

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Country.DEACTIVATE_COUNTRY] &&
      this.permissions[permissionTags.Country.ACTIVATE_COUNTRY]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Country.DEACTIVATE_COUNTRY]
    ) {
      return this.permissions[permissionTags.Country.DEACTIVATE_COUNTRY] &&
        this.country.isActive
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Country.ACTIVATE_COUNTRY]
    ) {
      return this.permissions[permissionTags.Country.ACTIVATE_COUNTRY] &&
        !this.country.isActive
        ? true
        : false;
    }

    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.country);
    }
  }
}
