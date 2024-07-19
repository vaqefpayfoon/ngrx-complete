import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

// BreadCrumb Interface
import { IBC, IError } from '@neural/shared/data';

// Models
import { IPromotions } from '../../models';

// facade
import { PromotionsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { IVehicle } from '@neural/modules/customer/vehicles';

@Component({
  selector: 'neural-promotion-item',
  templateUrl: './promotion-item.component.html',
  styleUrls: ['./promotion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionItemComponent implements OnInit, OnDestroy {
  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  promotion$: Observable<IPromotions.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  codeValidity$: Observable<IError>;

  searchedAccount$: Observable<Auth.IAccount>;

  searchedVehicle$: Observable<IPromotions.IVehicle>;

  brands$: Observable<IPromotions.IBrand[]>;

  accounts$: Observable<Auth.IAccount[]>;
  vehicles$: Observable<IVehicle.IDocument[]>;

  bc: IBC[];

  constructor(
    private cd: ChangeDetectorRef,
    private promotionsFacade: PromotionsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  ngOnDestroy(): void {
    this.promotionsFacade.onResetSelectedPromotion();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'rewards',
        path: null,
      },
      {
        name: 'voucher',
        path: '/app/rewards/voucher',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.promotion$ = this.promotionsFacade.promotion$;
    this.error$ = this.promotionsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Promo.CREATE_PROMO,
      permissionTags.Promo.UPDATE_PROMO,
      permissionTags.Promo.GET_PROMO,
      permissionTags.Promo.UPDATE_PROMO,
      permissionTags.Promo.VALIDATE_PROMO_CODE,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.codeValidity$ = this.promotionsFacade.codeValidity$;

    this.accounts$ = this.promotionsFacade.accounts$;

    this.vehicles$ = this.promotionsFacade.vehicles$;

    this.brands$ = this.promotionsFacade.brands$;
  }

  onCreatePromotion(promo: IPromotions.ICreate): void {
    const params: IPromotions.IConfig = {
      limit: IPromotions.Config.LIMIT,
      page: 1,
    };
    this.promotionsFacade.onCreate(promo);

    this.promotionsFacade.setPromotionsPage(params);
  }

  onUpdatePromotion(promo: IPromotions.IDocument): void {
    this.promotionsFacade.onUpdate(promo);
    
  }

  onCorporateChange(event: boolean): void {
    if (event) {
      this.promotionsFacade.onRedirect();
    }
  }

  onLoad(promo: IPromotions.IDocument): void {
    if (promo) {
      this.bc[this.bc.length - 1].name = promo?.code;

      this.title = promo?.code;

      this.cd.detectChanges();
    }
  }

  checkCodeValidity(code: IPromotions.ICodeValidation): void {
    this.promotionsFacade.checkCodeValidity(code);
  }

  getAccountByEmail(email: string): void {
    this.promotionsFacade.getAccountByEmail(email);
  }


  getAllBrands(): void {
    this.promotionsFacade.getBrands();
  }

  onSearch(filters: IPromotions.IFilter): void {
    if (filters) {
      this.promotionsFacade.onFilter(filters);
    }
  }

  onSearchVehicle(filters: IPromotions.IFilter): void {
    if (filters) {
      this.promotionsFacade.onVehicleFilter(filters);
    }
  }
}
