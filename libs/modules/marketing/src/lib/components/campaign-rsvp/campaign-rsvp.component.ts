import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  SkipSelf,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
  ChangeDetectorRef
} from '@angular/core';

// Angular Form
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';

// Parent form
import { CampaignFormComponent } from '../campaign-form/campaign-form.component';

// Models
import { ICampaigns } from '../../models';

// Map events
import { MapsAPILoader } from '@agm/core';

// Google map
import {} from 'google-maps';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

/**
 * @description form class for create/update rsvp campaign
 * @author {{Mohammad Jalili}}
 * @export
 * @class CampaignRsvpComponent
 */
@Component({
  selector: 'neural-campaign-rsvp',
  templateUrl: './campaign-rsvp.component.html',
  styleUrls: [
    './campaign-rsvp.component.scss',
    '../campaign-form/campaign-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignRsvpComponent implements OnInit {
  /**
   * @description disabled fiorm
   * @type {boolean}
   * @memberof CampaignNewsletterComponent
   */
  @Input() formDisabled: boolean;

  /**
   * @description geo code
   * @private
   * @type {*}
   * @memberof CampaignRsvpComponent
   */
  private geoCoder: any;

  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;

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

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.location.patchValue({
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            address:
              place && place.formatted_address
                ? place.formatted_address
                : this.searchElementRef.nativeElement.value
          });

          this.location.updateValueAndValidity();
        });
        this.cd.detectChanges();
      });
    });
  }

  /**
   * Creates an instance of CampaignRsvpComponent.
   * @author {{Mohammad Jalili}}
   * @param {CampaignFormComponent} campaignForm
   * @memberof CampaignRsvpComponent
   */
  constructor(
    @SkipSelf() @Optional() private campaignForm: CampaignFormComponent,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignRsvpComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.campaignForm.formInvalid;
  }

  /**
   * @description get enable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignRsvpComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.campaignForm.formEnabled;
  }

  /**
   * @description data form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignRsvpComponent
   */
  get data(): FormGroup {
    return <FormGroup>this.campaignForm.data;
  }

  /**
   * @description check model is exists
   * @readonly
   * @type {boolean}
   * @memberof CampaignRsvpComponent
   */
  get exists(): boolean {
    return <boolean>this.campaignForm.exists;
  }

  /**
   * @description enable camapin form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignRsvpComponent
   */
  enableForm(): void {
    return this.campaignForm.form.enable();
  }

  /**
   * @description disable campaign form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignRsvpComponent
   */
  disableForm(): void {
    return this.campaignForm.onCancel();
  }

  /**
   * @description location form group for rsvp
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignRsvpComponent
   */
  get location(): FormGroup {
    return <FormGroup>this.campaignForm.data.get('location');
  }

  /**
   * @description selected dates form array for rsvp
   * @readonly
   * @type {FormArray}
   * @memberof CampaignRsvpComponent
   */
  get selectedDates(): FormArray {
    return <FormArray>this.campaignForm.data.get('selectedDates');
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignRsvpComponent
   */
  get createPermission() {
    return this.campaignForm.createPermission;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignRsvpComponent
   */
  get updatePermission() {
    return this.campaignForm.updatePermission;
  }

  /**
   * @description selected Dates controls
   * @readonly
   * @type {AbstractControl[]}
   * @memberof CampaignRsvpComponent
   */
  get selectedDatesControls(): AbstractControl[] {
    return <AbstractControl[]>(
      (<FormArray>this.campaignForm.data.get('selectedDates')).controls
    );
  }

  private _emptyRsvp() {
    while (this.selectedDates.controls.length) {
      this.selectedDates.removeAt(0);
    }
  }

  public addSelectedDates(selectedDate?: ICampaigns.IRsvpSelectedDate | any) {
    if (selectedDate) {
      const createSelectedDate = this.fb.group({
        start: ['', Validators.compose([Validators.required])],
        end: ['', Validators.compose([Validators.required])],
        availableSeats: ['', Validators.compose([Validators.required])],
        maxPax: ['', Validators.compose([Validators.required])]
      });
      this.selectedDates.push(createSelectedDate);
    } else {
      return this.selectedDates.push(
        this.campaignForm.createRsvpSelectedDate()
      );
    }
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @param {number} event
   * @returns {void}
   * @memberof CampaignRsvpComponent
   */
  public removeSelectedDates(event: number): void {
    const control = <FormArray>this.campaignForm.data.get('selectedDates');
    return control.removeAt(event);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @param {FormControl} form
   * @param {MatDatepickerInputEvent<Date>} event
   * @memberof CampaignRsvpComponent
   */
  changeDate(
    parent: FormGroup,
    form: FormControl,
    event: MatDatepickerInputEvent<Date>
  ) {
    this.campaignForm.changeDate(form, event);

    this._compareStartEndDate(parent);
  }

  private _compareStartEndDate(parent: FormGroup) {
    const start = <FormControl>parent.get('start');
    const end = <FormControl>parent.get('end');

    const startDate = new Date(start.value);
    const endDate = new Date(end.value);

    if (startDate === endDate) {
      const date = new Date(start.value);
      date.setHours(23, 59, 59, 999);
      return end.patchValue(date.toISOString());
    }

    if (start.value > end.value) {
      return end.reset();
    }
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignRsvpComponent
   */
  onCreate() {
    this.campaignForm.onCreate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignRsvpComponent
   */
  onUpdate() {
    this.campaignForm.onUpdate(this.campaignForm.form);
  }
}
