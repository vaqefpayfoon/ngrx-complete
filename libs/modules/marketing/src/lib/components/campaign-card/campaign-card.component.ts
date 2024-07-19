import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

// Model
import { ICampaigns } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignCardComponent {
  @Input() campaign: ICampaigns.IDocument;

  @Input() permissions: any;

  @Output() status = new EventEmitter<ICampaigns.IDocument>();
  @Output() isFeatured = new EventEmitter<ICampaigns.IDocument>();

  @Output() send = new EventEmitter<ICampaigns.IDocument>();

  constructor() {}

  get statusPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.DEACTIVATE_CAMPAIGN] &&
      this.permissions[permissionTags.Campaign.ACTIVATE_CAMPAIGN]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.DEACTIVATE_CAMPAIGN]
    ) {
      return this.permissions[permissionTags.Campaign.DEACTIVATE_CAMPAIGN] &&
        this.campaign.active
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.ACTIVATE_CAMPAIGN]
    ) {
      return this.permissions[permissionTags.Campaign.ACTIVATE_CAMPAIGN] &&
        !this.campaign.active
        ? true
        : false;
    }

    return false;
  }

  get featurePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.DEACTIVATE_IS_FEATURED_CAMPAIGN] &&
      this.permissions[permissionTags.Campaign.ACTIVATE_IS_FEATURED_CAMPAIGN]
    ) {
      return true;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.DEACTIVATE_IS_FEATURED_CAMPAIGN]
    ) {
      return this.permissions[permissionTags.Campaign.DEACTIVATE_IS_FEATURED_CAMPAIGN] &&
        this.campaign.isFeatured
        ? true
        : false;
    }

    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.ACTIVATE_IS_FEATURED_CAMPAIGN]
    ) {
      return this.permissions[permissionTags.Campaign.ACTIVATE_IS_FEATURED_CAMPAIGN] &&
        !this.campaign.isFeatured
        ? true
        : false;
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
      this.permissions[permissionTags.Campaign.UPDATE_CAMPAIGN] &&
      this.permissions[permissionTags.Campaign.GET_CAMPAIGN]
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
  get sendPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Campaign.SEND_CAMPAIGN_PUSH_NOTIFICATION]
    ) {
      return true;
    }
    return false;
  }

  toggleStatus(event?: any) {
    if (this.statusPermission) {
      this.status.emit(this.campaign);
    }
  }

  toggleIsFeatured(event?: any) {
    if (this.featurePermission) {
      this.isFeatured.emit(this.campaign);
    }
  }

  toggleSend(campaign: ICampaigns.IDocument) {
    if (campaign) {
      this.send.emit(campaign);
    }
  }

  get campaignTypes() {
    return ICampaigns.Types;
  }
}
