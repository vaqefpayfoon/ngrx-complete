import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  SkipSelf
} from '@angular/core';

// Angular Form
import { FormGroup } from '@angular/forms';

// Parent form
import { CampaignFormComponent } from '../campaign-form/campaign-form.component';

@Component({
  selector: 'neural-campaign-notification',
  templateUrl: './campaign-notification.component.html',
  styleUrls: [
    './campaign-notification.component.scss',
    '../campaign-form/campaign-form.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignNotificationComponent {
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
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignNotificationComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.campaignForm.formInvalid;
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
   * @description get disable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignNotificationComponent
   */
  get formDisabled(): boolean {
    return <boolean>this.campaignForm.formDisabled;
  }

  /**
   * @description notification form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignNotificationComponent
   */
  get notification(): FormGroup {
    return <FormGroup>this.campaignForm.notification;
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
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignNotificationComponent
   */
  onCreate() {
    this.campaignForm.onCreate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignNotificationComponent
   */
  onUpdate() {
    this.campaignForm.onUpdate(this.campaignForm.form);
  }
}
