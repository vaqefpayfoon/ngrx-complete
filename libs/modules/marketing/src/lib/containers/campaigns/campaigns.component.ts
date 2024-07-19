import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { ICampaigns } from '../../models';

// facade
import { CampaignsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { CampaignConfirmationDialogComponent } from '../../components';

@Component({
  selector: 'neural-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignsComponent implements OnInit {
  title = 'scheduled';

  bc: IBC[];

  campaigns$: Observable<ICampaigns.IDocument[]>;

  campaignsConfig$: Observable<ICampaigns.IConfig>;

  total$: Observable<number>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private campaignsFacade: CampaignsFacade,
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
        name: 'marketing',
        path: null
      },
      {
        name: 'campaigns',
        path: null
      }
    ];

    this.campaigns$ = this.campaignsFacade.campaigns$;

    this.campaignsConfig$ = this.campaignsFacade.campaignsConfig$;

    this.total$ = this.campaignsFacade.total$;

    this.loading$ = this.campaignsFacade.loading$;

    this.error$ = this.campaignsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Campaign.LIST_CAMPAIGNS,
      permissionTags.Campaign.ACTIVATE_CAMPAIGN,
      permissionTags.Campaign.DEACTIVATE_CAMPAIGN,
      permissionTags.Campaign.GET_CAMPAIGN,
      permissionTags.Campaign.CREATE_CAMPAIGN,
      permissionTags.Campaign.UPDATE_CAMPAIGN,
      permissionTags.Campaign.SEND_CAMPAIGN_PUSH_NOTIFICATION,
      permissionTags.Campaign.ACTIVATE_IS_FEATURED_CAMPAIGN,
      permissionTags.Campaign.DEACTIVATE_IS_FEATURED_CAMPAIGN,
    ]);

    this.onRefresh();
  }

  onRefresh(event?: boolean) {
    // if (event) {
      const params: ICampaigns.IConfig = {
        limit: ICampaigns.Config.LIMIT,
        page: 1
      };
      this.campaignsFacade.changeCampaignsPage(params);
    // }
  }

  openDialog(event: ICampaigns.IDocument) {
    const dialogRef = this.dialog.open(CampaignConfirmationDialogComponent, {
      data: {event, isFeature: false},
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.campaignsFacade.toggleStatus(event);
      } else {
        return this.campaignsFacade.resetToggle(event);
      }
    });
  }

  openDialogFeatured(event: ICampaigns.IDocument) {
    const dialogRef = this.dialog.open(CampaignConfirmationDialogComponent, {
      data: {event, isFeature: true},
      disableClose: true
    });

    dialogRef.componentInstance.isFeaturedEvent.subscribe((res: boolean) => {
      if (res) {
        return this.campaignsFacade.toggleFeature(event);
      } else {
        return this.campaignsFacade.resetFeature(event);
      }
    });
  }

  sendPush(event: ICampaigns.IDocument) {
    this.campaignsFacade.onSendCampaignPushNotification(event);
  }

  changePage(event: PageEvent) {
    const params: ICampaigns.IConfig = {
      limit: ICampaigns.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.campaignsFacade.changeCampaignsPage(params);
  }
}
