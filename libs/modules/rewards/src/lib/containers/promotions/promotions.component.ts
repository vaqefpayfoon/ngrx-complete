import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IPromotions } from '../../models';

// facade
import { PromotionsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// dialog
import { PromotionConfirmationDialogComponent } from '../../components';

@Component({
  selector: 'neural-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionsComponent implements OnInit {
  bc: IBC[];

  promotions$: Observable<IPromotions.IDocument[]>;
  total$: Observable<number>;
  promotionsConfig$: Observable<IPromotions.IConfig>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private promotionsFacade: PromotionsFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialData();
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
        name: 'voucher ',
        path: null,
      },
    ];

    this.promotions$ = this.promotionsFacade.promotions$;
    this.total$ = this.promotionsFacade.total$;
    this.promotionsConfig$ = this.promotionsFacade.promotionsConfig$;

    this.loading$ = this.promotionsFacade.loading$;
    this.error$ = this.promotionsFacade.error$;

    this.promotionsFacade.onResetFilter();

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Promo.ACTIVATE_PROMO,
      permissionTags.Promo.DEACTIVATE_PROMO,
      permissionTags.Promo.GET_PROMO,
      permissionTags.Promo.LIST_PROMO,
      permissionTags.Promo.CREATE_PROMO,
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IPromotions.IConfig = {
        limit: IPromotions.Config.LIMIT,
        page: 1,
      };
      this.promotionsFacade.setPromotionsPage(params);
    }
  }

  openDialog(event: IPromotions.IDocument) {
    const dialogRef = this.dialog.open(PromotionConfirmationDialogComponent, {
      data: {value: event, isRedeem: false},
      disableClose: true,
    });
    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.promotionsFacade.toggleStatus(event);
      } else {
        return this.promotionsFacade.resetToggle(event);
      }
    });
  }

  openRedeemDialog(event: IPromotions.IDocument): void {
    const dialogRef = this.dialog.open(PromotionConfirmationDialogComponent, {
      data: {value: event, isRedeem: true},
      disableClose: true,
    });
    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        const changePromo: IPromotions.IDocument = {
          uuid: event.uuid,
          autoRedeem: !event.autoRedeem,
          code: event.code
        }
        return this.promotionsFacade.toggleRedeemStatus(changePromo);
      } else {
        return this.promotionsFacade.resetRedeemToggle(event);
      }
    });
  }

  changePage(event: PageEvent) {
    const params: IPromotions.IConfig = {
      limit: IPromotions.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.promotionsFacade.changePromotionsPage(params);
  }
}
