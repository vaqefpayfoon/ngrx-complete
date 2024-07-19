import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { countryQuery } from '../selectors';

// Action
import { CountriesActions } from '../actions';

// Models
import { ICountry } from '../../models';

@Injectable()
export class CountriesFacade {
  loading$ = this.store.select(countryQuery.getCountriesLoading);

  loaded$ = this.store.select(countryQuery.getCountriesLoaded);

  error$ = this.store.select(countryQuery.getCountriesError);

  countriesEntities$ = this.store.select(countryQuery.getCountriesEntities);

  countries$ = this.store.select(countryQuery.getAllCountries);

  countryNames$ = this.store.select(countryQuery.getAllCountryNames);

  selectedCountry$ = this.store.select(countryQuery.getCountrySelected);

  country$ = this.store.select(countryQuery.getSelectedCountry);

  constructor(private store: Store<IAdminState>) {}

  loadCountry(country: string) {
    this.store.dispatch(CountriesActions.GetCountry({ payload: country }));
  }

  create(event: ICountry.ICreate) {
    this.store.dispatch(CountriesActions.CreateCountry({ payload: event }));
  }

  update(event: ICountry.IUpdate) {
    this.store.dispatch(CountriesActions.UpdateCountry({ payload: event }));
  }

  toggleStatus(country: ICountry.IDocument) {
    if (country.isActive) {
      this.store.dispatch(
        CountriesActions.DeactivateCountry({ payload: country })
      );
    } else {
      this.store.dispatch(
        CountriesActions.ActivateCountry({ payload: country })
      );
    }
  }

  resetToggle(country: ICountry.IDocument) {
    this.store.dispatch(
      CountriesActions.ResetCountryStatus({
        payload: {
          id: country.uuid,
          changes: {
            isActive: country.isActive,
          },
        },
      })
    );
  }

  onLoad() {
    [CountriesActions.LoadCountries(), CountriesActions.LoadCountryNames()].map(
      (action) => {
        this.store.dispatch(action);
      }
    );
  }

  onSearch(filter: any) {
    if (filter === false) {
      this.onLoad();
    }
  }

  getCountry(name: string) {
    this.store.dispatch(CountriesActions.GetCountry({ payload: name }));
  }
}
