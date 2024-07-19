import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IPurchases, ITradeIn } from '../../models';

// facade
import { PurchasesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags, IRequest } from '@neural/shared/data';
import { ISalesAdvisor } from '@neural/modules/administration';
import { TradeInFacade } from '../../+state/facades/trade-in.facade';

@Component({
  selector: 'neural-purchase-item',
  templateUrl: './purchase-item.component.html',
  styleUrls: ['./purchase-item.component.scss'],
})
export class PurchaseItemComponent implements OnInit, OnDestroy {
  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  purchase$: Observable<IPurchases.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  selectedBranch$: Observable<Auth.IBranch>;

  salesAdvisors$: Observable<ISalesAdvisor.ISADocument[]>;

  bc: IBC[];

  constructor(
    private cd: ChangeDetectorRef,
    private purchasesFacade: PurchasesFacade,
    private tradeInFacade: TradeInFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'sales',
        path: null,
      },
      {
        name: 'purchases',
        path: '/app/hub/sales/purchases',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.purchase$ = this.purchasesFacade.purchase$;
    this.error$ = this.purchasesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Sale.UPDATE_SALE,
      permissionTags.Sale.UPDATE_SALE_FULFILLMENT,
      permissionTags.Sale.DELETE_SALE_DOCUMENT,
      permissionTags.BankLoan.CREATE_BANK_LOANS,
      permissionTags.Sale.UPLOAD_SALE_DOCUMENT,
      permissionTags.BankLoan.UPDATE_BANK_LOAN,
      permissionTags.BankLoan.DELETE_BANK_LOAN,
      permissionTags.TradeIn.CREATE_TRADE_IN,
      permissionTags.TradeIn.UPDATE_TRADE_IN,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.salesAdvisors$ = this.purchasesFacade.salesAdvisors$;

    this.purchasesFacade.onLoadSalesAdvisor();

    this.purchasesFacade.getBrandsAndSeries();
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.purchasesFacade.onResetSelectedPurchase();
  }

  onUpdate(payload: {
    changes: IPurchases.IUpdate;
    sale: IPurchases.IDocument;
  }) {
    this.purchasesFacade.onUpdate(payload);
  }

  onCreateTradeIn(payload: IRequest<ITradeIn.ICreate>) {
    this.tradeInFacade.OnCreate(payload);
  }

  onUpdateTradeIn(payload: {
    changes: ITradeIn.IUpdate;
    document: ITradeIn.ITradeInDocumnet;
  }) {
    this.tradeInFacade.onUpdate(payload);
  }

  onLoad(sale: IPurchases.IDocument) {
    if (sale) {
      this.bc[this.bc.length - 1].name =
        sale?.referenceNumber ??
        `${sale?.model?.unit?.brand} ${sale?.model?.unit?.display} ${sale?.model?.unit?.variant}`;

      this.title =
        sale?.referenceNumber ??
        `${sale?.model?.unit?.brand} ${sale?.model?.unit?.display} ${sale?.model?.unit?.variant}`;

      this.cd.detectChanges();
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.purchasesFacade.onRedirect();
    }
  }

  onClearAllBadges(uuid: string) {
    this.purchasesFacade.onClearAllBadges(uuid);
  }

  onReferesh(uuid: string) {
    this.purchasesFacade.getPurchase(uuid)
  }
}
