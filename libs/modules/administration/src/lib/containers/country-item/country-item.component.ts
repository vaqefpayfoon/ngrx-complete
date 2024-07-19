import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { ICountry } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { CountriesFacade, CurrenciesFacade } from '../../+state/facades';

// Account tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-country-item',
  templateUrl: './country-item.component.html',
  styleUrls: ['./country-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryItemComponent implements OnInit {
  title = 'Create';

  countryNames$: Observable<string[]>;

  currencies$: Observable<string[]>;

  country$: Observable<ICountry.IDocument>;

  selectedCountry$: Observable<ICountry.IGetCountry>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  constructor(
    private countriesFacade: CountriesFacade,
    private currenciesFacade: CurrenciesFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'countries',
        path: '/app/administration/countries',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.countryNames$ = this.countriesFacade.countryNames$;

    this.currencies$ = this.currenciesFacade.currencies$;

    this.country$ = this.countriesFacade.country$;

    this.selectedCountry$ = this.countriesFacade.selectedCountry$;

    this.loading$ = this.countriesFacade.loading$;

    this.error$ = this.countriesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Country.CREATE_COUNTRY,
      permissionTags.Country.UPDATE_COUNTRY,
    ]);
  }

  selected(event: string) {
    this.countriesFacade.loadCountry(event);
  }

  onCreate(country: ICountry.ICreate) {
    this.countriesFacade.create(country);
  }

  onUpdate(country: ICountry.IUpdate) {
    this.countriesFacade.update(country);
  }

  onGetCountry(country: string) {
    this.countriesFacade.getCountry(country);
  }

  onLoad(country: ICountry.IDocument) {
    if (country) {
      this.bc[this.bc.length - 1].name = country.name;

      this.title = country.name;
      this.onGetCountry(country.name);
    }
  }
}
