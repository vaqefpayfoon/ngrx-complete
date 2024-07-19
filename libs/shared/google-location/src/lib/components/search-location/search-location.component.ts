import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { MapsAPILoader } from '@agm/core';

import { IBranches } from '@neural/modules/customer/corporate';

export type Location = Pick<
  IBranches.ILocation,
  'address' | 'latitude' | 'longitude'
>;

@Component({
  selector: 'neural-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchLocationComponent implements AfterViewInit {
  private geoCoder: any;

  @ViewChild('searchInput') public searchInput!: ElementRef;

  @Output() searched = new EventEmitter<Location>();

  constructor(
    private cd: ChangeDetectorRef,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    //  load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchInput.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          const address =
            place && place.formatted_address
              ? place.formatted_address
              : this.searchInput.nativeElement.value;

          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          if (address && latitude && longitude) {
            this.searched.emit({
              address,
              latitude,
              longitude,
            });
          }
        });
        this.cd.detectChanges();
      });
    });
  }
}
