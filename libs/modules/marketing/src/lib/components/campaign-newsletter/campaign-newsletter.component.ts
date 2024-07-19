import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  SkipSelf,
  Input,
} from '@angular/core';

// Angular Form
import { FormControl, FormGroup } from '@angular/forms';

// Parent form
import { CampaignFormComponent } from '../campaign-form/campaign-form.component';

/**
 * @description form class for create/update newsletter campaign
 * @author {{Mohammad Jalili}}
 * @export
 * @class CampaignNewsletterComponent
 */
@Component({
  selector: 'neural-campaign-newsletter',
  templateUrl: './campaign-newsletter.component.html',
  styleUrls: [
    './campaign-newsletter.component.scss',
    '../campaign-form/campaign-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignNewsletterComponent {
  /**
   * @description disabled fiorm
   * @type {boolean}
   * @memberof CampaignNewsletterComponent
   */
  @Input() formDisabled: boolean;

  /**
   * Creates an instance of CampaignNewsletterComponent.
   * @author {{Mohammad Jalili}}
   * @param {CampaignFormComponent} campaignForm
   * @memberof CampaignNewsletterComponent
   */
  constructor(
    @SkipSelf()
    @Optional()
    private readonly campaignForm: CampaignFormComponent
  ) {}

  /**
   * @description validation of form
   * @readonly
   * @type {boolean}
   * @memberof CampaignNewsletterComponent
   */
  get formInvalid(): boolean {
    return <boolean>this.campaignForm.formInvalid;
  }

  /**
   * @description get enable status of campaign form
   * @readonly
   * @type {boolean}
   * @memberof CampaignNewsletterComponent
   */
  get formEnabled(): boolean {
    return <boolean>this.campaignForm.formEnabled;
  }

  /**
   * @description data form group
   * @readonly
   * @type {FormGroup}
   * @memberof CampaignNewsletterComponent
   */
  get data(): FormGroup {
    return <FormGroup>this.campaignForm.data;
  }

  /**
   * @description check model is exists
   * @readonly
   * @type {boolean}
   * @memberof CampaignNewsletterComponent
   */
  get exists(): boolean {
    return <boolean>this.campaignForm.exists;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignNewsletterComponent
   */
  get createPermission() {
    return this.campaignForm.createPermission;
  }

  /**
   * @description update permission
   * @readonly
   * @memberof CampaignNewsletterComponent
   */
  get updatePermission() {
    return this.campaignForm.updatePermission;
  }

  /**
   * @description enable camapin form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignNewsletterComponent
   */
  enableForm(): void {
    return this.campaignForm.form.enable();
  }

  /**
   * @description disable campaign form
   * @author {{Mohammad Jalili}}
   * @returns {void}
   * @memberof CampaignNewsletterComponent
   */
  disableForm(): void {
    return this.campaignForm.onCancel();
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignNewsletterComponent
   */
  onCreate() {
    this.campaignForm.onCreate(this.campaignForm.form);
  }

  /**
   * @description
   * @author {{Mohammad Jalili}}
   * @memberof CampaignNewsletterComponent
   */
  onUpdate() {
    this.campaignForm.onUpdate(this.campaignForm.form);
  }

  get type(): string {
    return this.campaignForm.type.value ===
      this.campaignForm.types.BANK_PROMOTION
      ? 'Bank Promotion'
      : 'Newsletter';
  }
}
