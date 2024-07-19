import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { ICountry } from '../../models';

// facade
import { CountriesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Permission Tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// confirmation component
import { CountryConfirmationDialogComponent } from '../../components/country-confirmation-dialog/country-confirmation-dialog.component';

@Component({
  selector: 'neural-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountriesComponent implements OnInit {
  countries$: Observable<ICountry.IDocument[]>;

  loading$: Observable<any>;
  error$: Observable<any>;

  filter: any;
  search = false;

  bc: IBC[];
  sort: ISort[];

  permissions$: Observable<{}>;

  constructor(
    private countriesFacade: CountriesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'Configuration',
        path: null
      },
      {
        name: 'countries',
        path: '/app/administration/countries'
      }
    ];

    this.sort = [
      {
        Name: 1
      }
    ];

    this.countries$ = this.countriesFacade.countries$;

    this.loading$ = this.countriesFacade.loading$;
    this.error$ = this.countriesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Country.LIST_ALL_COUNTRIES,
      permissionTags.Country.LIST_ALL_CURRENCIES,
      permissionTags.Country.LIST_COUNTRIES,
      permissionTags.Country.ACTIVATE_COUNTRY,
      permissionTags.Country.DEACTIVATE_COUNTRY,
      permissionTags.Country.CREATE_COUNTRY,
      permissionTags.Country.GET_COUNTRY_BY_NAME
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.countriesFacade.onLoad();
    }
  }

  onSubmit(value: any) {
    if (value) {
      this.search = true;
      this.filter = value.email;
    } else {
      this.search = false;
      this.filter = '';
      this.countriesFacade.onSearch(false);
    }
  }

  openDialog(event: ICountry.IDocument): void {
    const dialogRef = this.dialog.open(CountryConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.countriesFacade.toggleStatus(event);
      } else {
        return this.countriesFacade.resetToggle(event);
      }
    });
  }
}
