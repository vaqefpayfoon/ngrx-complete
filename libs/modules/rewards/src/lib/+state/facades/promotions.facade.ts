import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IRewardsState } from '../reducers';

// Selector
import { promotionsQuery } from '../selectors';

// Action
import { PromotionsActions } from '../actions';

// Model
import { IPromotions } from '../../models';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class PromotionsFacade {
  loading$ = this.store.select(promotionsQuery.getPromotionsLoading);

  loaded$ = this.store.select(promotionsQuery.getPromotionsLoaded);

  error$ = this.store.select(promotionsQuery.getPromotionsError);

  promotions$ = this.store.select(promotionsQuery.getAllPromotions);

  promotion$ = this.store.select(promotionsQuery.getSelectedPromotion);

  promotionsConfig$ = this.store.select(promotionsQuery.getPromotionsPage);

  total$ = this.store.select(promotionsQuery.getPromotionsTotal);

  promotionsFilters$ = this.store.select(promotionsQuery.getPromotionsFilters);

  promotionsSorts$ = this.store.select(promotionsQuery.getPromotionsSorts);

  getRouter$ = this.store.select(fromRoot.getRouterState);

  codeValidity$ = this.store.select(promotionsQuery.getCodeValidity);

  accounts$ = this.store.select(promotionsQuery.getSearchedAccount);

  vehicles$ = this.store.select(promotionsQuery.getSearchedVehicle);

  brands$ = this.store.select(promotionsQuery.getBrands);

  constructor(private store: Store<IRewardsState>) {}

  toggleStatus(promotion: IPromotions.IDocument) {
    if (promotion.active) {
      this.store.dispatch(
        PromotionsActions.DeactivatePromotion({ payload: promotion })
      );
    } else {
      this.store.dispatch(
        PromotionsActions.ActivatePromotion({ payload: promotion })
      );
    }
  }

  resetToggle(promotion: IPromotions.IDocument) {
    this.store.dispatch(
      PromotionsActions.ResetPromotionStatus({
        payload: {
          id: promotion.uuid,
          changes: {
            active: promotion.active,
          },
        },
      })
    );
  }

  toggleRedeem(promotion: IPromotions.IDocument): void {
    if (promotion.active) {
      this.store.dispatch(
        PromotionsActions.DeactivatePromotion({ payload: promotion })
      );
    } else {
      this.store.dispatch(
        PromotionsActions.ActivatePromotion({ payload: promotion })
      );
    }
  }

  resetToggleRedeem(promotion: IPromotions.IDocument): void {
    this.store.dispatch(
      PromotionsActions.ResetPromotionStatus({
        payload: {
          id: promotion.uuid,
          changes: {
            active: promotion.active,
          },
        },
      })
    );
  }

  setPromotionsPage(config: IPromotions.IConfig) {
    this.store.dispatch(
      PromotionsActions.SetPromotionsPage({ payload: config })
    );
  }

  changePromotionsPage(config: IPromotions.IConfig) {
    this.store.dispatch(
      PromotionsActions.ChangePromotionsPage({ payload: config })
    );
  }

  onSelect(promotion: IPromotions.IDocument) {
    const { uuid } = promotion;
    this.store.dispatch(PromotionsActions.GetPromotion({ payload: uuid }));
  }

  onCreate(promotion: IPromotions.ICreate) {
    this.store.dispatch(
      PromotionsActions.CreatePromotion({ payload: promotion })
    );
  }

  onUpdate(promotion: IPromotions.IDocument) {
    this.store.dispatch(
      PromotionsActions.UpdatePromotion({ payload: promotion })
    );
  }

  onRedirect() {
    this.store.dispatch(PromotionsActions.RedirectToPromotions());
  }

  checkCodeValidity(code: IPromotions.ICodeValidation) {
    this.store.dispatch(PromotionsActions.CodeValidation({ payload: code }));
  }

  getAccountByEmail(email: string) {
    this.store.dispatch(
      PromotionsActions.GetAccountByEmail({ payload: email })
    );
  }

  getBrands() {
    this.store.dispatch(PromotionsActions.GetBrands());
  }

  onResetSelectedPromotion() {
    this.store.dispatch(PromotionsActions.ResetSelectedPromotion());
  }

  getPromotion(uuid: string) {
    this.store.dispatch(PromotionsActions.GetPromotion({ payload: uuid }));
  }

  toggleRedeemStatus(promotion: IPromotions.IDocument): void {
    if (promotion.autoRedeem) {
      this.store.dispatch(
        PromotionsActions.ActivateRedeemPromotion({ payload: promotion })
      );
    } else {
      this.store.dispatch(
        PromotionsActions.DeactivateRedeemPromotion({ payload: promotion })
      );
    }
  }

  resetRedeemToggle(promotion: IPromotions.IDocument): void {
    this.store.dispatch(
      PromotionsActions.ResetPromotionRedeem({
        payload: {
          id: promotion.uuid,
          changes: {
            autoRedeem: promotion.autoRedeem,
          },
        },
      })
    );
  }

  onFilter(payload: IPromotions.IFilter): void {
    this.store.dispatch(PromotionsActions.GetInboxAccounts({ payload }));
  }

  onVehicleFilter(payload: IPromotions.IFilter): void {
    this.store.dispatch(PromotionsActions.LoadVehicles({ payload }));
  }
  
  onResetFilter(): void {
    this.store.dispatch(PromotionsActions.ResetFilters());
  }
}
