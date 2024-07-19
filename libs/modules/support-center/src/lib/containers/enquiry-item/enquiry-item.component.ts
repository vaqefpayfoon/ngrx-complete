import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IEnquiries } from '../../models';

// facade
import { EnquiriesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-enquiry-item',
  templateUrl: './enquiry-item.component.html',
  styleUrls: ['./enquiry-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryItemComponent implements OnInit, OnDestroy{
  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  enquiry$: Observable<IEnquiries.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  bc: IBC[];

  constructor(
    private cd: ChangeDetectorRef,
    private enquiriesFacade: EnquiriesFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'Administration',
        path: null,
      },
      {
        name: 'support center',
        path: null,
      },
      {
        name: 'enquiries',
        path: null,
      },
      {
        name: 'general enquiries',
        path: '/app/support-center/enquiries/general',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.enquiry$ = this.enquiriesFacade.enquiry$;
    this.error$ = this.enquiriesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Enquiry.GET_ENQUIRY,
      permissionTags.Enquiry.UPDATE_ENQUIRY,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.enquiriesFacade.onResetSelectedEnquiry();
  }

  onUpdate(enquiry: IEnquiries.IDocument) {
    this.enquiriesFacade.onUpdate(enquiry);
  }

  onLoad(enquiry: IEnquiries.IDocument) {
    if (enquiry) {
      this.bc[this.bc.length - 1].name = enquiry?.name ?? enquiry?.subject;

      this.title = enquiry?.name ?? enquiry?.subject;

      this.cd.detectChanges();
    }
  }
}
