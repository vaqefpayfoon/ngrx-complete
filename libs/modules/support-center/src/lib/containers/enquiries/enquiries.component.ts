import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC, IFilter, IFilters } from '@neural/shared/data';

// Models
import { IEnquiries } from '../../models';

// facade
import { EnquiriesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-enquiries',
  templateUrl: './enquiries.component.html',
  styleUrls: ['./enquiries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiriesComponent implements OnInit {
  bc: IBC[];
  filters: IFilters;

  enquiries$: Observable<IEnquiries.IDocument[]>;
  total$: Observable<number>;
  enquiriesConfig$: Observable<IEnquiries.IConfig>;
  enquiriesFilter$: Observable<IEnquiries.IFilter>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private enquiriesFacade: EnquiriesFacade,
    private permissionValidatorService: PermissionValidatorService
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
        name: 'general enquiries',
        path: null,
      },
    ];

    this.filters = IEnquiries.Filter;

    this.enquiries$ = this.enquiriesFacade.enquiries$;
    this.total$ = this.enquiriesFacade.total$;
    this.enquiriesConfig$ = this.enquiriesFacade.enquiriesConfig$;
    this.enquiriesFilter$ = this.enquiriesFacade.getEnquiriesFilters$;

    this.loading$ = this.enquiriesFacade.loading$;
    this.error$ = this.enquiriesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Enquiry.LIST_ENQUIRY,
      permissionTags.Enquiry.GET_ENQUIRY,
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.enquiriesFacade.resetEnquiriesPage();
    }
  }

  onFilter(event: IFilter) {
    if (event) {
      this.enquiriesFacade.changeEnquiriesFilter(event);
    }
  }

  changePage(event: PageEvent) {
    const params: IEnquiries.IConfig = {
      limit: IEnquiries.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.enquiriesFacade.changeEnquiriesPage(params);
  }
}
