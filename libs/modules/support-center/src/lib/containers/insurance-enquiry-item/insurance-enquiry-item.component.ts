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
import { IInsuranceEnquiries } from '../../models';

// facade
import { InsuranceEnquiriesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-insurance-enquiry-item',
  templateUrl: './insurance-enquiry-item.component.html',
  styleUrls: ['./insurance-enquiry-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceEnquiryItemComponent implements OnInit {
  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  insuranceEnquiry$: Observable<IInsuranceEnquiries.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  bc: IBC[];

  constructor(
    private cd: ChangeDetectorRef,
    private insuranceEnquiriesFacade: InsuranceEnquiriesFacade,
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
        name: 'insurance enquiries',
        path: '/app/support-center/enquiries/insurances',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.insuranceEnquiry$ = this.insuranceEnquiriesFacade.insuranceEnquiry$;
    this.error$ = this.insuranceEnquiriesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.InsuranceEnquiry.GET_INSURANCE_ENQUIRY,
      permissionTags.InsuranceEnquiry.UPDATE_INSURANCE_ENQUIRY,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.insuranceEnquiriesFacade.onResetSelectedEnquiry();
  }

  onUpdate(enquiry: IInsuranceEnquiries.IDocument) {
    this.insuranceEnquiriesFacade.onUpdate(enquiry);
  }

  onLoad(enquiry: IInsuranceEnquiries.IDocument) {
    if (enquiry) {
      this.bc[this.bc.length - 1].name =
        enquiry?.referenceNumber ?? enquiry?.numberPlate;

      this.title = enquiry?.referenceNumber ?? enquiry?.numberPlate;

      this.cd.detectChanges();
    }
  }
}
