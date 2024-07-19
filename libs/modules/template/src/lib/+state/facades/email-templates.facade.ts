import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ITemplatesState } from '../reducers';
import * as fromRoot from '@neural/ngrx-router';

// Selector
import { emailTemplatesQuery } from '../selectors';

// Action
import { EmailTemplatesActions } from '../actions';

// Model
import { ITemplates } from '../../models';

@Injectable()
export class EmailTemplatesFacade {
  loading$ = this.store.select(emailTemplatesQuery.getEmailTemplatesLoading);

  loaded$ = this.store.select(emailTemplatesQuery.getEmailTemplatesLoaded);

  error$ = this.store.select(emailTemplatesQuery.getEmailTemplatesError);

  templates$ = this.store.select(emailTemplatesQuery.getEmailAllTemplates);

  template$ = this.store.select(emailTemplatesQuery.getEmailSelectedTemplate);

  templatesConfig$ = this.store.select(
    emailTemplatesQuery.getEmailTemplatesPage
  );

  templatesFilter$ = this.store.select(
    emailTemplatesQuery.getEmailTemplateTargetEmailsFilter
  );

  total$ = this.store.select(emailTemplatesQuery.getEmailTemplatesTotal);

  router$ = this.store.select(fromRoot.getRouterState);

  images$ = this.store.select(emailTemplatesQuery.getEmailTemplateImages);

  constructor(private store: Store<ITemplatesState>) {}

  changeEmailTemplatesPage(
    config: ITemplates.IConfig,
    filters?: ITemplates.IFilter[]
  ) {
    this.store.dispatch(
      EmailTemplatesActions.SetEmailTemplatesPage({
        payload: { filters, config },
      })
    );
  }

  toggleStatus(template: ITemplates.IDocument) {
    if (template.active) {
      this.store.dispatch(
        EmailTemplatesActions.DeactivateEmailTemplate({ payload: template })
      );
    } else {
      this.store.dispatch(
        EmailTemplatesActions.ActivateEmailTemplate({ payload: template })
      );
    }
  }

  resetToggle(template: ITemplates.IDocument) {
    this.store.dispatch(
      EmailTemplatesActions.ResetEmailTemplateStatus({
        payload: {
          id: template.uuid,
          changes: {
            active: template.active,
          },
        },
      })
    );
  }

  onResetSelectedEmailTemplate() {
    this.store.dispatch(EmailTemplatesActions.ResetSelectedEmailTemplate());
  }

  onCreate(payload: ITemplates.ICreate) {
    this.store.dispatch(EmailTemplatesActions.CreateEmailTemplate({ payload }));
  }

  onCreateFromMaster(payload: ITemplates.ICreateFromMaster) {
    this.store.dispatch(
      EmailTemplatesActions.CreateEmailFromMasterTemplate({ payload })
    );
  }

  onUpdate(payload: ITemplates.IUpdate) {
    this.store.dispatch(EmailTemplatesActions.UpdateEmailTemplate({ payload }));
  }

  onDelete(payload: ITemplates.IDocument) {
    this.store.dispatch(
      EmailTemplatesActions.DeletetEmailTemplate({ payload })
    );
  }

  onRedirect() {
    this.store.dispatch(EmailTemplatesActions.RedirectToEmailTemplates());
  }

  uploadTemplateImage(payload: File): void {
    this.store.dispatch(
      EmailTemplatesActions.UploadEmailTemplateImage({ payload })
    );
  }

  getEmailTemplate(uuid: string) {
    this.store.dispatch(
      EmailTemplatesActions.GetEmailTemplate({ payload: uuid })
    );
  }
}
