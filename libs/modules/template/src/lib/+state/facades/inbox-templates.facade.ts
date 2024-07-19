import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ITemplatesState } from '../reducers';
import * as fromRoot from '@neural/ngrx-router';

// Selector
import { inboxTemplatesQuery } from '../selectors';

// Action
import { InboxTemplatesActions } from '../actions';

// Model
import { ITemplates } from '../../models';

@Injectable()
export class InboxTemplatesFacade {
  loading$ = this.store.select(inboxTemplatesQuery.getInboxTemplatesLoading);

  loaded$ = this.store.select(inboxTemplatesQuery.getInboxTemplatesLoaded);

  error$ = this.store.select(inboxTemplatesQuery.getInboxTemplatesError);

  templates$ = this.store.select(inboxTemplatesQuery.getInboxAllTemplates);

  template$ = this.store.select(inboxTemplatesQuery.getInboxSelectedTemplate);

  templatesConfig$ = this.store.select(
    inboxTemplatesQuery.getInboxTemplatesPage
  );

  templatesFilter$ = this.store.select(
    inboxTemplatesQuery.getInboxTemplateTargetInboxsFilter
  );

  total$ = this.store.select(inboxTemplatesQuery.getInboxTemplatesTotal);

  router$ = this.store.select(fromRoot.getRouterState);

  images$ = this.store.select(inboxTemplatesQuery.getInboxTemplateImages);

  constructor(private store: Store<ITemplatesState>) {}

  changeInboxTemplatesPage(
    config: ITemplates.IConfig,
    filters?: ITemplates.IFilter[]
  ) {
    this.store.dispatch(
      InboxTemplatesActions.SetInboxTemplatesPage({
        payload: { filters, config },
      })
    );
  }

  toggleStatus(template: ITemplates.IDocument) {
    if (template.active) {
      this.store.dispatch(
        InboxTemplatesActions.DeactivateInboxTemplate({ payload: template })
      );
    } else {
      this.store.dispatch(
        InboxTemplatesActions.ActivateInboxTemplate({ payload: template })
      );
    }
  }

  resetToggle(template: ITemplates.IDocument) {
    this.store.dispatch(
      InboxTemplatesActions.ResetInboxTemplateStatus({
        payload: {
          id: template.uuid,
          changes: {
            active: template.active,
          },
        },
      })
    );
  }

  onResetSelectedInboxTemplate() {
    this.store.dispatch(InboxTemplatesActions.ResetSelectedInboxTemplate());
  }

  onCreate(payload: ITemplates.ICreate) {
    this.store.dispatch(InboxTemplatesActions.CreateInboxTemplate({ payload }));
  }

  onCreateFromMaster(payload: ITemplates.ICreateFromMaster) {
    this.store.dispatch(
      InboxTemplatesActions.CreateInboxFromMasterTemplate({ payload })
    );
  }

  onUpdate(payload: ITemplates.IUpdate) {
    this.store.dispatch(InboxTemplatesActions.UpdateInboxTemplate({ payload }));
  }

  onDelete(payload: ITemplates.IDocument) {
    this.store.dispatch(
      InboxTemplatesActions.DeletetInboxTemplate({ payload })
    );
  }

  onRedirect() {
    this.store.dispatch(InboxTemplatesActions.RedirectToInboxTemplates());
  }

  uploadTemplateImage(payload: File): void {
    this.store.dispatch(
      InboxTemplatesActions.UploadInboxTemplateImage({ payload })
    );
  }

  getInboxTemplate(uuid: string) {
    this.store.dispatch(
      InboxTemplatesActions.GetInboxTemplate({ payload: uuid })
    );
  }
}
