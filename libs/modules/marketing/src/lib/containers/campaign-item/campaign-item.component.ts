import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { ICampaigns, ICampaignTargets } from '../../models';

// Models Interface
import { IModels } from '@neural/modules/models';

// facade
import { CampaignsFacade, CampaignTargetsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-campaign-item',
  templateUrl: './campaign-item.component.html',
  styleUrls: ['./campaign-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignItemComponent implements OnInit, OnDestroy {
  title = 'create a new campaign';

  data$: Observable<any>;

  campaign$: Observable<ICampaigns.IDocument>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  codes$: Observable<Auth.IPhoneCode[]>;

  unit$: Observable<IModels.IUnitList>;

  campaignTargets$: Observable<ICampaignTargets.IDocument[]>;

  images$: Observable<string[]>;

  bc: IBC[];

  constructor(
    private campaignsFacade: CampaignsFacade,
    private campaignTargetsFacade: CampaignTargetsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'marketing',
        path: null,
      },
      {
        name: 'campaigns',
        path: '/app/marketing/campaigns',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.campaign$ = this.campaignsFacade.campaign$;

    this.error$ = this.campaignsFacade.error$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Campaign.CREATE_CAMPAIGN,
      permissionTags.Campaign.UPDATE_CAMPAIGN,
    ]);

    this.unit$ = this.campaignsFacade.unit$;

    this.campaignTargets$ = this.campaignTargetsFacade.campaignTargets$;

    this.images$ = this.campaignsFacade.images$;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.campaignsFacade.onResetSelectedCampaign();
  }

  onCreate(campaign: ICampaigns.ICreate) {
    if (!!campaign) {
       this.campaignsFacade.onCreate(campaign)
      // const params: ICampaigns.IConfig = {
      //   limit: ICampaigns.Config.LIMIT,
      //   page: 1,
      // };
      // this.campaignsFacade.changeCampaignsPage(params);
    }
  }

  onUpdate(campaign: ICampaigns.IDocument) {
    if (!!campaign) {
      this.campaignsFacade.onUpdate(campaign);
    }
  }

  onLoad(campaign: ICampaigns.IDocument) {
    if (campaign) {
      this.bc[this.bc.length - 1].name = campaign.name;
      this.title = campaign.name;
    }
  }

  onLoadBrandAndSeries(event?: any) {
    this.campaignsFacade.getBrandsAndSeries();
  }

  onLoadModels(payload: { brand: string; series: string }) {
    this.campaignsFacade.getSeriesModels(payload);
  }

  onSetCampaignTargetsPage(filters: ICampaignTargets.IFilter[]) {
    const config: ICampaignTargets.IConfig = {
      limit: ICampaignTargets.Config.LIMIT,
      page: 1,
    };
    this.campaignTargetsFacade.setCampaignTargetsPage(config, filters);
  }

  uploadContentImage(image: File): void {
    this.campaignsFacade.uploadCampaignImage(image);
  }

  onLoadVariants(payload: {
    corporateUuid: string;
    brand: string;
    series: string;
    model: string;
  }) {
    this.campaignsFacade.getVariants(payload);
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.campaignsFacade.onRedirect();
    }
  }
}
