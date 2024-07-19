import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ITemplatesState } from '../reducers';
import * as fromRoot from '@neural/ngrx-router';

// Selector
import { masterTemplatesQuery } from '../selectors';

// Action
import { MasterTemplatesActions } from '../actions';

// Model
import { ITemplates } from '../../models';

@Injectable()
export class MasterTemplatesFacade {
  loading$ = this.store.select(masterTemplatesQuery.getMasterTemplatesLoading);

  loaded$ = this.store.select(masterTemplatesQuery.getMasterTemplatesLoaded);

  error$ = this.store.select(masterTemplatesQuery.getMasterTemplatesError);

  templates$ = this.store.select(masterTemplatesQuery.getAllMasterTemplates);

  templatesConfig$ = this.store.select(
    masterTemplatesQuery.getMasterTemplateConfig
  );

  template$ = this.store.select(masterTemplatesQuery.getMasterSelectedTemplate);

  templatesFilter$ = this.store.select(
    masterTemplatesQuery.getMasterTemplateFilter
  );

  total$ = this.store.select(masterTemplatesQuery.getMasterTemplatesTotal);

  router$ = this.store.select(fromRoot.getRouterState);

  constructor(private store: Store<ITemplatesState>) {}

  changeMasterTemplatesPage(
    config: ITemplates.IConfig,
    filters?: ITemplates.IFilter[]
  ) {
    this.store.dispatch(
      MasterTemplatesActions.SetMasterTemplatesPage({
        payload: { filters, config },
      })
    );
  }

  toggleStatus(template: ITemplates.IDocument) {
    if (template.active) {
      this.store.dispatch(
        MasterTemplatesActions.DeactivateMasterTemplate({
          payload: template,
        })
      );
    } else {
      this.store.dispatch(
        MasterTemplatesActions.ActivateMasterTemplate({ payload: template })
      );
    }
  }

  onCreateMaster(payload: ITemplates.ICreateMaster) {
    this.store.dispatch(
      MasterTemplatesActions.CreateMasterTemplate({ payload })
    );
  }

  resetToggle(template: ITemplates.IDocument) {
    this.store.dispatch(
      MasterTemplatesActions.ResetMasterTemplateStatus({
        payload: {
          id: template.uuid,
          changes: {
            active: template.active,
          },
        },
      })
    );
  }

  onResetSelectedMasterTemplate() {
    this.store.dispatch(MasterTemplatesActions.ResetSelectedMasterTemplate());
  }

  onUpdate(payload: ITemplates.IUpdate) {
    this.store.dispatch(
      MasterTemplatesActions.UpdateMasterTemplate({ payload })
    );
  }

  onDelete(payload: ITemplates.IDocument) {
    this.store.dispatch(
      MasterTemplatesActions.DeletetMasterTemplate({ payload })
    );
  }

  getMasterTemplate(uuid: string) {
    this.store.dispatch(
      MasterTemplatesActions.GetMasterTemplate({ payload: uuid })
    );
  }
}
