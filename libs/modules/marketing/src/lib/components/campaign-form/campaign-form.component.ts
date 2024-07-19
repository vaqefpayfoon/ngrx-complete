import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Models
import { ICampaigns, ICampaignTargets } from '../../models';
import { IModels } from '@neural/modules/models';
import { Auth } from '@neural/auth';

// Location
import { Location } from '@angular/common';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';

// permission tags
import { MatSelectChange } from '@angular/material/select';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { traverseAndRemove } from '@neural/shared/data';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

// custom validation
import { ValidationService } from '@neural/ui';

/**
 * @description form class for create/update campaign
 * @author {{Mohammad Jalili}}
 * @export
 * @class CampaignFormComponent
 * @implements {OnChanges}
 */
@Component({
  selector: 'neural-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignFormComponent implements OnChanges {
  /**
   * @description uploaded images
   * @type {string}
   * @memberof CampaignFormComponent
   */
  @Input() images: string[];

  /**
   * @description bind unit form app screen campaign
   * @type {IModels.IUnitList}
   * @memberof CampaignFormComponent
   */
  @Input() unit: IModels.IUnitList;

  /**
   * @description bind campaign targets
   * @type {ICampaignTargets.IDocument[]}
   * @memberof CampaignFormComponent
   */
  @Input() campaignTargets: ICampaignTargets.IDocument[];

  /**
   * @description bind corporateUuid to create campaign per corporate.
   *
   * it changes on selected corporate on switcher
   * @type {Auth.ICorporates}
   * @memberof CampaignFormComponent
   */
  @Input() selectedCorporate: Auth.ICorporates;

  /**
   * @description bind campaign object to campaign form
   * @type {ICampaigns.IDocument}
   * @memberof CampaignFormComponent
   */
  @Input() campaign: ICampaigns.IDocument;

  /**
   * @description permissions object
   * to prevent use form create and update
   * @type {*}
   * @memberof CampaignFormComponent
   */
  @Input() permissions: any;

  /**
   * @description emit create campaign
   * @type {EventEmitter<ICampaigns.ICreate>}
   * @memberof CampaignFormComponent
   */
  @Output() create: EventEmitter<ICampaigns.ICreate> = new EventEmitter();

  /**
   * @description emit update campaign
   * @type {EventEmitter<ICampaigns.IDocument>}
   * @memberof CampaignFormComponent
   */
  @Output() update: EventEmitter<ICampaigns.IDocument> = new EventEmitter();

  /**
   * @description emit loaded campaign to change header name and breadcrumb
   * @type {EventEmitter<ICampaigns.IDocument>}
   * @memberof CampaignFormComponent
   */
  @Output() loaded: EventEmitter<ICampaigns.IDocument> = new EventEmitter();

  /**
   * @description load brand and models
   * @memberof CampaignFormComponent
   */
  @Output() loadBrandAndSeries = new EventEmitter();

  /**
   * @description load model with brand and series
   * @type {EventEmitter<{
   *     brand: string;
   *     series: string;
   *   }>}
   * @memberof CampaignFormComponent
   */
  @Output() loadModels: EventEmitter<{
    brand: string;
    series: string;
  }> = new EventEmitter<{ brand: string; series: string }>();

  /**
   * @description set campaign target filters
   * @type {EventEmitter<{
   *     filter: ICampaignTargets.IFilter[];
   *   }>}
   * @memberof CampaignFormComponent
   */
  @Output() loadCampaignTargets: EventEmitter<{
    filters: ICampaignTargets.IFilter[];
  }> = new EventEmitter<{ filters: ICampaignTargets.IFilter[] }>();

  /** load variants
   * @description
   * @type {EventEmitter<{
   *     corporateUuid: string;
   *     brand: string;
   *     series: string;
   *     model: string;
   *   }>}
   * @memberof CampaignFormComponent
   */
  @Output() loadVariant: EventEmitter<{
    corporateUuid: string;
    brand: string;
    series: string;
    model: string;
  }> = new EventEmitter<{
    corporateUuid: string;
    brand: string;
    series: string;
    model: string;
  }>();

  /**
   * @description upload imgae emitter
   * @memberof CampaignFormComponent
   */
  @Output() uploadImage = new EventEmitter<File>();

  @Output() corporateChange = new EventEmitter<boolean>();

  /**
   * @description check campaign is exists or not
   * @private
   * @type {boolean}
   * @memberof CampaignFormComponent
   */
  private _exists: boolean;
  /**
   * @description get exists value
   * @type {boolean}
   * @memberof CampaignFormComponent
   */
  public get exists(): boolean {
    return this._exists;
  }
  /**
   * @description set exists value
   * @memberof CampaignFormComponent
   */
  public set exists(value: boolean) {
    this._exists = value;
  }

  /**
   * @description form group for campign
   * @type {FormGroup}
   * @memberof CampaignFormComponent
   */
  form: FormGroup = this.fb.group({
    corporateUuid: ['', Validators.compose([Validators.required])],
    name: ['', Validators.compose([Validators.required])],
    type: ['', Validators.compose([Validators.required])],
    description: [''],
    date: this._createDate(),
    data: this.fb.group({}),
    image: ['', Validators.compose([Validators.required])],
    content: this._createContent(),
    targetUuid: [''],
    isFeatured: [false, Validators.compose([Validators.required])],
    isPrivate: [false, Validators.compose([Validators.required])],
    notification: this._createNotification(),
  });

  /**
   * Creates an instance of CampaignFormComponent.
   * @author {{Mohammad Jalili}}
   * @param {FormBuilder} fb
   * @param {Location} location
   * @param {ValidationService} validationService
   * @memberof CampaignFormComponent
   */
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private validationService: ValidationService
  ) {}

  /**
   * @description invoked immediately after the default changed
   * @author {{Mohammad Jalili}}
   * @param {SimpleChanges} changes
   * @memberof CampaignFormComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    // update form with existing campaign
    if (
      changes.campaign &&
      changes.campaign.currentValue &&
      this.campaign &&
      this.campaign.uuid
    ) {
      this._initialCampaign();
    }

    // patch corporateUuid
    if (
      changes.selectedCorporate &&
      changes.selectedCorporate.currentValue &&
      this.selectedCorporate
    ) {
      const { uuid } = this.selectedCorporate;

      this.corporateUuid.patchValue(uuid);
    }

    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }

    // unit Model
    if (
      changes.unit &&
      !changes.unit.firstChange &&
      this.unit &&
      this.unit.variants
    ) {
      const model = <FormControl>(
        (<FormGroup>this.data.get('payload')).get('model')
      );

      const index = this.unit.variants.findIndex(
        (x) => x.unit.model === model.value || x.unit.display === model.value
      );

      if (index !== -1) {
        const modelUuid = <FormControl>(
          (<FormGroup>this.data.get('payload')).get('uuid')
        );

        modelUuid.patchValue(this.unit.variants[index].uuid);

      } else {
        model.reset();
      }
    }
  }

  private _initialCampaign() {
    this.form.reset();

    this.loaded.emit(this.campaign);

    this.exists = true;

    this._createData(this.campaign.type);

    this.form.patchValue(this.campaign);


    if (this.campaign.isPrivate === undefined) {
      this.isPrivate.patchValue(false);
    }

    if (this.campaign.isFeatured === undefined) {
      this.isFeatured.patchValue(false);
    }

    const { data, type, corporateUuid } = this.campaign;

    if (ICampaigns.Types[type] === ICampaigns.Types.APP_SCREEN) {
      this.form.removeControl('data');

      const { screen, payload } = data;

      this.loadModels.emit({
        brand: payload.brand.name,
        series: payload.series,
      });

      this.loadVariant.emit({
        corporateUuid,
        brand: payload.brand.name,
        series: payload.series,
        model: payload.model,
      });


      this.form.addControl(
        'data',
        this.fb.group({
          screen: [screen, Validators.compose([Validators.required])],
        })
      );

      if (ICampaigns.Screens[screen] === ICampaigns.Screens.TEST_DRIVE) {
        this.data.addControl(
          'payload',
          this.fb.group({
            brand: this.fb.group({
              name: [
                payload.brand.name,
                Validators.compose([Validators.required]),
              ],
              logo: [
                payload.brand.logo,
                Validators.compose([Validators.required]),
              ],
            }),
            model: [payload.model, Validators.compose([Validators.required])],
            series: [payload.series, Validators.compose([Validators.required])],
            uuid: [payload.uuid, Validators.compose([Validators.required])],
          })
        );
    }
  }

    if (ICampaigns.Types[type] === ICampaigns.Types.RSVP) {
      this.form.removeControl('data');

      const { location, selectedDates } = data;

      this.form.addControl(
        'data',
        this.fb.group({
          selectedDates: this.fb.array([]),
          location: this.fb.group({
            address: [
              location.address,
              Validators.compose([Validators.required]),
            ],
            latitude: [
              location.latitude,
              Validators.compose([Validators.required]),
            ],
            longitude: [
              location.longitude,
              Validators.compose([Validators.required]),
            ],
          }),
        })
      );

      const selectedDatesArray = <FormArray>this.data.get('selectedDates');

      for (const selectedDate in selectedDates) {
        if (selectedDate) {
          selectedDatesArray.push(
            this.fb.group({
              start: [
                selectedDates[selectedDate].start,
                Validators.compose([Validators.required]),
              ],
              end: [
                selectedDates[selectedDate].end,
                Validators.compose([Validators.required]),
              ],
              availableSeats: [
                selectedDates[selectedDate].availableSeats,
                Validators.compose([Validators.required]),
              ],
              maxPax: [
                selectedDates[selectedDate].maxPax,
                Validators.compose([Validators.required]),
              ],
            })
          );
        }
      }
    }

    this.form.disable();
  }

  /**
   * @description create rsvp form group
   * @author {{Mohammad Jalili}}
   * @private
   * @returns {FormGroup}
   * @memberof CampaignFormComponent
   */
  private _createRsvp(): FormGroup {
    return this.fb.group({
      selectedDates: this.fb.array([this.createRsvpSelectedDate()]),
      location: this.fb.group({
        address: ['', Validators.compose([Validators.required])],
        latitude: ['', Validators.compose([Validators.required])],
        longitude: ['', Validators.compose([Validators.required])],
      }),
    });
  }

  /**
   * @description create rsvp Selected Date form group
   * @author {{Mohammad Jalili}}
   * @private
   * @returns {FormGroup}
   * @memberof CampaignFormComponent
   */
  public createRsvpSelectedDate(): FormGroup {
    return this.fb.group({
      start: ['', Validators.compose([Validators.required])],
      end: ['', Validators.compose([Validators.required])],
      availableSeats: ['', Validators.compose([Validators.required])],
      maxPax: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * @description create newsletter form group
   * @author {{Mohammad Jalili}}
   * @private
   * @returns {FormGroup}
   * @memberof CampaignFormComponent
   */
  private _createNewsletter(): FormGroup {
    return this.fb.group({
      link: [''],
    });
  }

  public createAppScreen(): FormGroup {
    return this.fb.group({
      screen: ['', Validators.compose([Validators.required])],
      payload: this.fb.group({}),
    });
  }

  public createAppScreenPayloadTestDrive(): FormGroup {
    return this.fb.group({
      brand: this.fb.group({
        name: ['', Validators.compose([Validators.required])],
        logo: ['', Validators.compose([Validators.required])],
      }),
      model: ['', Validators.compose([Validators.required])],
      series: ['', Validators.compose([Validators.required])],
      uuid: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * @description content form group
   * @author {{Mohammad Jalili}}
   * @private
   * @returns {FormGroup}
   * @memberof CampaignFormComponent
   */
  private _createContent(): FormGroup {
    return this.fb.group({
      type: ['', Validators.compose([Validators.required])],
      body: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * @description create notification form group
   * @author {{Mohammad Jalili}}
   * @private
   * @returns {FormGroup}
   * @memberof CampaignFormComponent
   */
  private _createNotification(): FormGroup {
    return this.fb.group({
      title: [''],
      body: [''],
    });
  }

  /**
   * @description create date form group
   * @author {{Mohammad Jalili}}
   * @private
   * @returns {FormGroup}
   * @memberof CampaignFormComponent
   */
  private _createDate(): FormGroup {
    return this.fb.group({
      start: ['', Validators.compose([Validators.required])],
      end: [
        {
          value: '',
          disabled: true,
        },
        Validators.compose([Validators.required]),
      ],
    });
  }

  /**
   * @description mat select event
   * @author {{Mohammad Jalili}}
   * @param {MatSelectChange} event
   * @memberof CampaignFormComponent
   */
  onChangeType(event: MatSelectChange): void {
    const { value } = event;
    this._createData(value);
  }

  /**
   * @description create data form group
   * @author {{Mohammad Jalili}}
   * @private
   * @param {string} value
   * @memberof CampaignFormComponent
   */
  private _createData(value: string) {
    this.form.removeControl('data');

    switch (value) {
      case ICampaigns.Types.NEWSLETTER:
      case ICampaigns.Types.BANK_PROMOTION:
        this.form.setControl('data', this._createNewsletter());
        break;

      case ICampaigns.Types.APP_SCREEN:
        {
          this.form.setControl('data', this.createAppScreen());
          this.loadBrandAndSeries.emit();
        }
        break;

      case ICampaigns.Types.RSVP:
        this.form.setControl('data', this._createRsvp());
        break;
    }
  }

  /**
   * @description isFeatured form control
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get isFeatured(): FormControl {
    return <FormControl>this.form.get('isFeatured');
  }

  get isPrivate(): FormControl {
    return <FormControl>this.form.get('isPrivate');
  }

  /**
   * @description status of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignFormComponent
   */
  get formDisabled(): boolean {
    return <boolean>this.form.disabled;
  }

  /**
   * @description status of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignFormComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.form.enabled;
  }

  /**
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignFormComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.form.invalid;
  }

  /**
   * @description corporateUuid FormControl it changes when switcher will change
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get corporateUuid(): FormControl {
    return <FormControl>this.form.get('corporateUuid');
  }

  /**
   * @description type FormControl for each campaign
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get type(): FormControl {
    return <FormControl>this.form.get('type');
  }

  /**
   * @description image form ctrl
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get image(): FormControl {
    return <FormControl>this.form.get('image');
  }

  /**
   * @description file form ctrl
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get file(): FormControl {
    return <FormControl>this.form.get('file');
  }

  /**
   * @description date FormGroup for each campaign
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignFormComponent
   */
  get date(): FormGroup {
    return <FormGroup>this.form.get('date');
  }
  /**
   * @description start date
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get start(): FormControl {
    return <FormControl>this.date.get('start');
  }

  /**
   * @description end date
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get end(): FormControl {
    return <FormControl>this.date.get('end');
  }

  /**
   * @description get notification form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignFormComponent
   */
  get notification(): FormGroup {
    return <FormGroup>this.form.get('notification');
  }

  /**
   * @description get data form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignFormComponent
   */
  get data(): FormGroup {
    return <FormGroup>this.form.get('data');
  }

  /**
   * @description get content form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignFormComponent
   */
  get content(): FormGroup {
    return <FormGroup>this.form.get('content');
  }

  /**
   * @description get target form group
   * @readonly
   * @type {FormControl}
   * @memberof CampaignFormComponent
   */
  get targetUuid(): FormControl {
    return <FormControl>this.form.get('targetUuid');
  }

  /**
   * @description enum campaign types
   * @readonly
   * @memberof CampaignFormComponent
   */
  get types() {
    return ICampaigns.Types;
  }

  /**
   * @description enum campaign Content Type
   * @readonly
   * @memberof CampaignFormComponent
   */
  get contentTypes() {
    return ICampaigns.ContentType;
  }

  /**
   * @description enum campaign Content pdf Type
   * @readonly
   * @memberof CampaignFormComponent
   */
  get contentPdfType() {
    return ICampaigns.ContentPDFType;
  }

  /**
   * @description create permission
   * @readonly
   * @memberof CampaignFormComponent
   */
  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.CREATE_CAMPAIGN]
    ) {
      return true;
    }
    return false;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignFormComponent
   */
  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.UPDATE_CAMPAIGN]
    ) {
      return true;
    }
    return false;
  }

  /**
   * @description change date to isoString
   * @author {{Mohammad Jalili}}
   * @param {FormControl} form
   * @param {MatDatepickerInputEvent<Date>} event
   * @memberof CampaignFormComponent
   */
  public changeDate(form: FormControl, event: MatDatepickerInputEvent<Date>) {
    form.patchValue(event.value.toISOString());
    form.updateValueAndValidity();

    (<FormControl>this.date.get('end')).enable();

    this._compareStartEndDate();
  }

  /**
   * @description change date to isoString
   * @author {{Mohammad Jalili}}
   * @param {FormControl} form
   * @param {MatDatepickerInputEvent<Date>} event
   * @memberof CampaignFormComponent
   */
  public changeEndDate(
    form: FormControl,
    event: MatDatepickerInputEvent<Date>
  ) {
    if (!form) {
      form.patchValue(event.value.toISOString());
      form.updateValueAndValidity();

      this._compareStartEndDate();
    }
  }

  private _compareStartEndDate() {
    const start = <FormControl>this.date.get('start');
    const end = <FormControl>this.date.get('end');

    const startDate = new Date(start.value).setHours(0, 0, 0, 0);
    const endDate = new Date(end.value).setHours(0, 0, 0, 0);

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
   * @description add image object
   * @author {{Mohammad Jalili}}
   * @param {*} event
   * @memberof CampaignFormComponent
   */
  showImage(event): void {
    if (!!event.target.files.length) {
      const file = event.target.files[0];

      this.form.get('image').patchValue(file);

      this.form.markAllAsTouched();
      this.form.markAsDirty();
    }
  }

  /**
   * @description load tagets
   * @author {{Mohammad Jalili}}
   * @param {ICampaignTargets.IFilter[]} filters
   * @memberof CampaignFormComponent
   */
  onSetCampaignTargetConfig(filters: ICampaignTargets.IFilter[]) {
    this.loadCampaignTargets.emit({ filters });
  }

  /**
   * @description create campaign
   * @author {{Mohammad Jalili}}
   * @param {FormGroup} form
   * @memberof CampaignFormComponent
   */
  onCreate(form: FormGroup) {
    const { value, valid } = form;

    this.validationService.validateAllFormFields(form);
    form.markAllAsTouched();

    traverseAndRemove(value);

    const start = (this.start.value as Date).toISOString();
    const end = (this.end.value as Date).toISOString();

    let createDoc = {
      ...value,
      image: this.image.value,
      date: {
        ...value.date,
        start,
        end,
      },
    };

    if (this.file && this.file.valid) {
      createDoc = {
        ...createDoc,
        file: this.file.value,
      };
    }

    this.create.emit(createDoc);
  }

  /**
   * @description upfate campaign
   * @author {{Mohammad Jalili}}
   * @param {FormGroup} form
   * @memberof CampaignFormComponent
   */
  onUpdate(form: FormGroup) {
    const { value, valid } = form;
    const start = (this.start.value as Date).toISOString();
    const end = (this.end.value as Date).toISOString();

    // traverseAndRemove(value);
    const uuid=this.campaign.uuid

    let updateDoc = {
      uuid,
      ...value,
      image: this.image.value,
      date: {
        ...value.date,
        start,
        end,
      },
    };


    if (this.file && this.file.valid) {
      updateDoc = {
        ...updateDoc,
        file: this.file.value,
      };
    }

    this.update.emit(updateDoc);
  }

  onCancel(): void {
    if (!this.exists) {
      return this.location.back();
    }

    if (this.exists) {
      return this._initialCampaign();
    }
  }
  
  todayDate:Date = new Date();
}
