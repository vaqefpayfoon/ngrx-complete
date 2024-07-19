import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  SkipSelf,
  Input
} from '@angular/core';

// Angular Form
import { FormGroup, FormControl } from '@angular/forms';

// Parent form
import { CampaignFormComponent } from '../campaign-form/campaign-form.component';

// Models
import { ICampaigns } from '../../models';

// Material component
import { MatSelectChange } from '@angular/material/select';

// Models interface
import { IModels } from '@neural/modules/models';

/**
 * @description form class for create/update app screen campaign
 * @author {{Mohammad Jalili}}
 * @export
 * @class CampaignAppScreenComponent
 */
@Component({
  selector: 'neural-campaign-app-screen',
  templateUrl: './campaign-app-screen.component.html',
  styleUrls: [
    './campaign-app-screen.component.scss',
    '../campaign-form/campaign-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CampaignAppScreenComponent {
  /**
   * @description disabled fiorm
   * @type {boolean}
   * @memberof CampaignNewsletterComponent
   */
  @Input() formDisabled: boolean;

  /**
   * Creates an instance of CampaignNotificationComponent.
   * @author {{Mohammad Jalili}}
   * @param {CampaignFormComponent} campaignForm
   * @memberof CampaignNotificationComponent
   */
  constructor(
    @SkipSelf() @Optional() private campaignForm: CampaignFormComponent
  ) {}

  /**
   * @description get ubit list for app screen campaign
   * @readonly
   * @type {IModels.IUnitList}
   * @memberof CampaignAppScreenComponent
   */
  get unit(): IModels.IUnitList {
    return <IModels.IUnitList>this.campaignForm.unit;
  }

  /**
   * @description
   * @readonly
   * @type {(IModels.ISeries[] | string[])}
   * @memberof CampaignAppScreenComponent
   */
  get seriesList(): IModels.ISeries[] | string[] {
    const brand = <FormGroup>(
      (<FormGroup>(<FormGroup>this.data.get('payload'))).get('brand')
    );

    if (brand.controls.name.valid) {
      const index = this.unit.brandsAndSeries.findIndex(
        x => x.name === brand.controls.name.value
      );

      if (index !== -1) {
        brand.get('logo').patchValue(this.unit.brandsAndSeries[index].logo);

        return this.unit.brandsAndSeries[index].series;
      }
      return this.unit.brandsAndSeries[index].series;

    }

    return [];
  }

  /**
   * @description get enable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignNotificationComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.campaignForm.formEnabled;
  }

  /**
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignAppScreenComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.campaignForm.formInvalid;
  }

  /**
   * @description screen enums
   * @readonly
   * @memberof CampaignAppScreenComponent
   */
  get screens() {
    return ICampaigns.Screens;
  }

  /**
   * @description data form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignNotificationComponent
   */
  get data(): FormGroup {
    return <FormGroup>this.campaignForm.data;
  }

  /**
   * @description check model is exists
   * @readonly
   * @type {boolean}
   * @memberof CampaignNotificationComponent
   */
  get exists(): boolean {
    return <boolean>this.campaignForm.exists;
  }

  /**
   * @description screen from control
   * @readonly
   * @type {FormControl}
   * @memberof CampaignAppScreenComponent
   */
  get screen(): FormControl {
    return <FormControl>this.data.get('screen');
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
   * @description enable camapin form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignNotificationComponent
   */
  enableForm(): void {
    return this.campaignForm.form.enable();
  }

  /**
   * @description disable campaign form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignNotificationComponent
   */
  disableForm(): void {
    return this.campaignForm.onCancel();
  }

  /**
   * @description on screen type change
   * @author {{Mohammad Jalili}}
   * @param {MatSelectChange} event
   * @memberof CampaignAppScreenComponent
   */
  onScreenChangeType(event: MatSelectChange): void {
    const { value } = event;

    this.data.removeControl('payload');

    if (ICampaigns.Screens[value] === ICampaigns.Screens.TEST_DRIVE) {
      this.data.addControl(
        'payload',
        this.campaignForm.createAppScreenPayloadTestDrive()
      );
    }
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @param {MatSelectChange} event
   * @memberof CampaignAppScreenComponent
   */
  onChangeSeries(event: MatSelectChange): void {
    const { value } = event;

    const {
      value: { name }
    } = <FormGroup>(<FormGroup>this.data.get('payload').get('brand'));

    this.campaignForm.loadModels.emit({ brand: name, series: value });
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @param {MatSelectChange} event
   * @memberof CampaignAppScreenComponent
   */
  onChangeModel(event: MatSelectChange): void {
    const { value } = event;

    const {
      value: { name }
    } = <FormGroup>(<FormGroup>this.data.get('payload').get('brand'));

    const seriesInput = <FormGroup>(
      (<FormGroup>this.data.get('payload').get('series'))
    );

    const corporate = this.campaignForm.corporateUuid;

    this.campaignForm.loadVariant.emit({
      corporateUuid: corporate.value,
      brand: name,
      series: seriesInput.value,
      model: value
    });
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignAppScreenComponent
   */
  onCreate() {
    this.campaignForm.onCreate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignAppScreenComponent
   */
  onUpdate() {
    this.campaignForm.onUpdate(this.campaignForm.form);
  }
}
