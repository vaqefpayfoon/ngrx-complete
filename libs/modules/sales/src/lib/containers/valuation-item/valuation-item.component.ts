import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IPurchases, ISales } from '../../models';

// facade
import { ValuationsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-valuation-item',
  templateUrl: './valuation-item.component.html',
  styleUrls: ['./valuation-item.component.scss'],
})
export class ValuationItemComponent implements OnInit, OnDestroy {
  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  valuation$: Observable<IPurchases.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  selectedBranch$: Observable<Auth.IBranch>;

  bc: IBC[];

  constructor(
    private cd: ChangeDetectorRef,
    private valuationsFacade: ValuationsFacade,
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
        name: 'valuations',
        path: null,
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.valuation$ = this.valuationsFacade.valuation$;
    this.error$ = this.valuationsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Sale.UPDATE_SALE,
      permissionTags.Sale.UPDATE_SALE_FULFILLMENT,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.valuationsFacade.onResetSelectedValuation();
  }

  onUpdate(sale: ISales.IDocument) {
    this.valuationsFacade.onUpdate(sale);
  }

  onLoad(sale: ISales.IDocument) {
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
}
