import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  NgZone,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';

// Angular forms
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

// Material Event
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

// Map Events
import { MapsAPILoader } from '@agm/core';

// Google map
import {} from 'google-maps';

// Models
import { IBranches } from '../../models';
import { TitleCasePipe } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';

// TimeZone
import * as timeZone from '@nerv/timezone';

@Component({
  selector: 'neural-branch-location',
  templateUrl: './branch-location.component.html',
  styleUrls: ['./branch-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TitleCasePipe],
})
export class BranchLocationComponent
  implements OnChanges, OnInit, AfterViewInit {
  @Input() permissions: any;

  @Input() parent: FormGroup;

  @Input() formDisabled: boolean;

  @Input() branch: IBranches.IDocument;

  @Input() allCountries: string[];
  @Input() allStates: IBranches.IGetCountry;

  @Input() exists: boolean;

  @Output() countryChange = new EventEmitter<string>();

  // Select Country
  filteredCountries: Observable<string[]>;

  @ViewChild('countryInput') countryInput: ElementRef<HTMLInputElement>;

  latitude: number;
  longitude: number;
  place_id!: string;
  zoom: number;
  address: string;

  private geoCoder: any;

  @ViewChild('search', { static: true }) public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allCountries && changes.allCountries.currentValue) {
      this.filteredCountries = this.location.get('country').valueChanges.pipe(
        startWith(''),
        map((country: string | null) => {
          return country
            ? this._filterCountry(country)
            : this.allCountries.slice();
        })
      );
    }

    if (changes.allStates && changes.allStates.currentValue && !this.branch) {
      this.location.get('state').enable();
    }

    if (changes.branch && changes.branch.currentValue && this.branch) {
      this.searchElementRef.nativeElement.value = this.branch.location.address;
      this.searchElementRef.nativeElement.disabled = this.parent.disabled;

      this.latitude = this.branch.location.latitude;
      this.longitude = this.branch.location.longitude;
      this.address = this.branch.location.address;
      this.place_id = this.branch?.location?.googlePlaceId;

      this.location.patchValue({
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
        googlePlaceId: this.place_id,
      });
    }
  }

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.address =
            place && place.formatted_address
              ? place.formatted_address
              : this.searchElementRef.nativeElement.value;
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.longitude = place.geometry.location.lng();
          this.place_id = place?.place_id;

          this.location.patchValue({
            address: this.address,
            latitude: this.latitude,
            longitude: this.longitude,
            googlePlaceId: this.place_id,
          });
        });
        this.cd.detectChanges();
      });
    });
  }

  ngAfterViewInit() {
    if (!this.exists) {
      this.searchElementRef.nativeElement.disabled = true;
      this.cd.detectChanges();
    }
  }

  private _filterCountry(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allCountries.filter(
      (country) => country.toLowerCase().indexOf(filterValue) === 0
    );
  }

  selectCountry(event: MatAutocompleteSelectedEvent) {
    const name = event.option.value;
    const state = this.location.get('state');
    const address = this.location.get('address');

    state.reset();
    state.markAsTouched();
    address.markAsTouched();
    this.searchElementRef.nativeElement.value = '';
    this.searchElementRef.nativeElement.disabled = true;

    this.cd.detectChanges();

    if (!!name) {
      this.countryChange.emit(name);
    }
  }

  get location() {
    return this.parent.get('location') as FormGroup;
  }

  get addressInput() {
    return this.location.get('address') as FormControl;
  }

  locationValidation() {
    return this.location.valid;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.CREATE_BRANCH]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.UPDATE_BRANCH]
    ) {
      return true;
    }
    return false;
  }

  get timeZoneList() {
    return timeZone.timeZoneList;
  }
}
