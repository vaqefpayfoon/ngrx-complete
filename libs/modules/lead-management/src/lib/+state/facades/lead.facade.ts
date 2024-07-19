import { Injectable, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LeadQuery } from '../selectors';
import { ILead, ILeadNotes } from '../../models';
import { ILeadState } from '../reducers';
import { LeadsAction } from '../actions';
import { LeadService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class LeadFacade {
  leadManagements$ = this.store.select(
    LeadQuery.getAllLeadManagements
  );

  leadManagement$ = this.store.select(LeadQuery.getSelectedLeadManagement);
  
  getLeadConfig$ = this.store.select(
    LeadQuery.getLeadManagementConfig
  );
  getLeadsFilters$ = this.store.select(
    LeadQuery.getLeadManagementFilters
  );

  getLeadsSorts$ = this.store.select(
    LeadQuery.getLeadManagementSorts
  );
  allWishList$ = this.store.select(LeadQuery.getSelectedWishList);
  allPurchaseQuotes$ = this.store.select(LeadQuery.getSelectedPurchaseQuotes);
  allTestDrives$ = this.store.select(LeadQuery.getSelectedTestDrives);
  total$ = this.store.select(LeadQuery.getLeadManagementTotal);
  loading$ = this.store.select(LeadQuery.getLeadManagementLoading);

  loaded$ = this.store.select(LeadQuery.getLeadManagementLoaded);

  error$ = this.store.select(LeadQuery.getLeadManagementError);
  salesAdvisors$ = this.store.select(LeadQuery.getSalesAdvisor);
  globalBrands$ = this.store.select(LeadQuery.getGlobalBrands);
  private _leadService: LeadService;
  public get leadService(): LeadService {
    if (!this._leadService) {
      this._leadService = this.injector.get(LeadService);
    }
    return this._leadService;
  }

  constructor(private store: Store<ILeadState>, private injector: Injector) {}

  getLeadManagements() {
    this.store.dispatch(LeadsAction.loadLeadManagements());
  }
  resetLeadManagementPage() {
    const params: ILead.IConfig = {
      page: 1,
      limit: ILead.Config.LIMIT,
    };
    this.store.dispatch(
      LeadsAction.SetLeadManagementsPage({ payload: params })
    );
  }
  changeLeadManagementPage(config: ILead.IConfig) {
    this.store.dispatch(
      LeadsAction.ChangeLeadManagementsPage({ payload: config })
    );
  }
  changeLeadManagementFilter(filter: ILead.IFilter) {
    this.store.dispatch(
      LeadsAction.SetLeadManagementsFilters({ payload: filter })
    );
  }
  setFilterFaild() {
    this.store.dispatch(
      LeadsAction.loadLeadManagementsFailed({payload: {status: 404,
        message: 'All leads are assigned to a sales advisor'}})
    );
  }
  create(event: ILead.ICreate) {
    this.store.dispatch(LeadsAction.CreateLeadManagement({ payload: event }));
  }
  createNote(event: ILeadNotes.ISaveNote) {
    this.store.dispatch(LeadsAction.CreateLeadNote({ payload: event }));
  }
  deleteNote(uuid: string, noteUuid: string) {
    const payload =  {
      uuid, noteUuid
    };
    this.store.dispatch(LeadsAction.DeleteLeadNote({ payload }));
  }
  update(payload: {
    changes: ILead.IUpdate;
    lead: ILead.IDocument;
  }) {
    this.store.dispatch(LeadsAction.UpdateLeadManagement({ payload }));
  }
  updateNote(changes: ILeadNotes.ISaveNote, noteUuid: string) {
    const payload = {
      changes,
      noteUuid
    };
    this.store.dispatch(LeadsAction.UpdateLeadNote({ payload }));
  }
  getLead(uuid: string) {
    this.store.dispatch(LeadsAction.GetLeadManagement({ payload: uuid }));
  }
  getWishList(uuid: string) {
    this.store.dispatch(LeadsAction.GetWishList({ payload: uuid }));
  }
  getPurchaseQuoteList(uuid: string) {
    this.store.dispatch(LeadsAction.GetPurchaseQuote({ payload: uuid }));
  }
  getTestDrive(uuid: string) {
    this.store.dispatch(LeadsAction.GetTestDrive({ payload: uuid }));
  }
  onRedirect() {
    this.store.dispatch(LeadsAction.RedirectToLeadManagement());
  }
  onReLoadList() {
    this.store.dispatch(LeadsAction.loadLeadManagements());
  }
  onLoadSalesAdvisor(sa: ILead.SA) {
    this.store.dispatch(LeadsAction.GetSalesAdvisor({payload: sa}));
  }
  onResetSelectedLeadManagement() {
    this.store.dispatch(LeadsAction.ResetSelectedLeadManagement());
  }
  onResetSalesAdvisor() {
    this.store.dispatch(LeadsAction.ResetSalesAdvisor());
  }
  getBrands() {
    this.store.dispatch(LeadsAction.GetGlobalBrands());
  }
  sendManualInvitation(uuid: string) {
    this.store.dispatch(LeadsAction.SendManualInvitation({ payload: uuid }));
  }
}
