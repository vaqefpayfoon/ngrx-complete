import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';
import { IBC, permissionTags } from '@neural/shared/data';
import { Observable } from 'rxjs';
import { LeadFacade } from '../../+state';
import { ILead, ILeadTestDrive, IWishList, leadPurchaseQuotes } from '../../models';

@Component({
  selector: 'neural-lead-item',
  templateUrl: './lead-item.component.html',
  styleUrls: ['./lead-item.component.scss']
})
export class LeadItemComponent implements OnInit, OnDestroy {

  private _title = 'Lead Details';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  lead$: Observable<ILead.IDocument>;
  wishList$: Observable<IWishList.IData>;
  purchaseQuote$: Observable<leadPurchaseQuotes.IData>;
  testDrives$: Observable<ILeadTestDrive.IData>;
  brands$: Observable<string[]>;
  corporates$: Observable<Auth.ICorporates[]>;
  error$: Observable<any>;
  permissions$: Observable<Record<string, unknown>>;
  selectedCorporate$: Observable<Auth.ICorporates>;
  selectedBranch$: Observable<Auth.IBranch>;
  isSuperAdmin$: Observable<boolean>;
  bc: IBC[];
  leadUuid = '';
  account$: Observable<any>;
  constructor(
    private leadFacade: LeadFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'lead',
        path: '/app/hub/lead/leadList',
      }
    ];
    this.lead$ = this.leadFacade.leadManagement$;
    this.lead$.subscribe(res => {
      if(res?.uuid) {
        this.leadUuid = res.uuid;
      }
    });
    this.wishList$ = this.leadFacade.allWishList$;
    this.purchaseQuote$ = this.leadFacade.allPurchaseQuotes$;
    this.testDrives$ = this.leadFacade.allTestDrives$;
    this.brands$ = this.leadFacade.globalBrands$;
    this.error$ = this.leadFacade.error$;
    this.corporates$ = this.authFacade.corporates$;
    this.account$ = this.authFacade.account$;
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Lead.GET_LEAD,
      permissionTags.Lead.GET_LEAD_WISH_LISTS,
      permissionTags.Lead.GET_LEAD_PURCHASE_QUOTES,
      permissionTags.Lead.GET_LEAD_TEST_DRIVES,
      permissionTags.Lead.CREATE_LEAD,
      permissionTags.Lead.UPDATE_LEAD,
      permissionTags.Lead.CREATE_NOTE,
      permissionTags.Lead.EDIT_NOTE,
      permissionTags.Lead.DELETE_NOTE,
      permissionTags.Lead.SALES_ADVISOR_ALLOW
    ]);
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.isSuperAdmin$ = this.authFacade.isSuperAdmin$;
  }

  ngOnDestroy() {
    this.leadFacade.onResetSelectedLeadManagement();
  }

  onUpdate(payload: {
    changes: ILead.IUpdate;
    lead: ILead.IDocument;
  }) {
    this.leadFacade.update(payload);
  }

  onLoadLead(lead: ILead.IDocument) {
    if (lead) {
      this.bc[this.bc.length - 1].name = lead.fullName;
      this.title = lead.fullName;
    }
  }
  onBranchChange(event: boolean) {
    if (event) {
      this.leadFacade.onRedirect();
    }
  }

  onRefresh(event: boolean) {
    if (event && this.leadUuid) {
      this.leadFacade.getLead(this.leadUuid)
    }
  }
}
