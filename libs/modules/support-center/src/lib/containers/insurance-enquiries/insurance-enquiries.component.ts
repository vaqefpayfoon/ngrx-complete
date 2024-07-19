import { Component, OnInit } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {
  IBC,
  IFilter,
  GlobalPaginationConfig,
  IGlobalConfig,
  IGlobalFilter,
} from '@neural/shared/data';

// Models
import { IInsuranceEnquiries } from '../../models';

// facade
import { InsuranceEnquiriesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

import { RemarkDialogComponent } from '../../components/remark-dialog/remark-dialog.component';

@Component({
  selector: 'neural-insurance-enquiries',
  templateUrl: './insurance-enquiries.component.html',
  styleUrls: [
    './insurance-enquiries.component.scss',
    '../enquiries/enquiries.component.scss',
  ],
})
export class InsuranceEnquiriesComponent implements OnInit {
  bc: IBC[];

  enquiries$: Observable<IInsuranceEnquiries.IDocument[]>;
  total$: Observable<number>;
  enquiriesConfig$: Observable<IGlobalConfig>;
  enquiriesFilter$: Observable<IGlobalFilter>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private insuranceEnquiriesFacade: InsuranceEnquiriesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

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
        path: null,
      },
    ];

    this.enquiries$ = this.insuranceEnquiriesFacade.insuranceEnquiries$;
    this.total$ = this.insuranceEnquiriesFacade.total$;
    this.enquiriesConfig$ = this.insuranceEnquiriesFacade.enquiriesConfig$;
    this.enquiriesFilter$ = this.insuranceEnquiriesFacade.getInsuranceEnquiriesFilters$;

    this.loading$ = this.insuranceEnquiriesFacade.loading$;
    this.error$ = this.insuranceEnquiriesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.InsuranceEnquiry.GET_INSURANCE_ENQUIRY,
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.insuranceEnquiriesFacade.resetInsuranceEnquiriesPage();
    }
  }

  onFilter(event: IFilter) {
    if (event) {
      this.insuranceEnquiriesFacade.changeInsuranceEnquiriesFilter(event);
    }
  }

  changePage(event: PageEvent) {
    const params: IGlobalConfig = {
      limit: GlobalPaginationConfig.LIMIT,
      page: event.pageIndex + 1,
    };

    this.insuranceEnquiriesFacade.changeInsuranceEnquiriesPage(params);
  }

  showRemark(enquiry: IInsuranceEnquiries.IDocument): void {
    this.dialog.open(RemarkDialogComponent, {
      data: enquiry,
      disableClose: true,
    });
  }
}
