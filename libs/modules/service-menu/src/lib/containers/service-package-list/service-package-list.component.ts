import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';
import { IBranches } from '@neural/modules/customer/corporate';
import { IBC, permissionTags } from '@neural/shared/data';
import { Observable } from 'rxjs';
import { ServicePackageFacade } from '../../+state/facades';
import { IServiceLine, IServicePackage } from '../../models';

@Component({
  selector: 'neural-services-package-list',
  templateUrl: './service-package-list.component.html',
  styleUrls: ['./service-package-list.component.scss'],
})
export class ServicePackageListComponent implements OnInit {
  bc: IBC[];
  servicePackages$: Observable<IServicePackage.IDocument[]>;
  total$: Observable<number>;
  servicePackageConfig$: Observable<IServiceLine.IConfig>;
  permissions$: Observable<{}>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pageEvent: PageEvent;
  selectedCorporate$: Observable<{}>;
  selectedBranch$: Observable<any>;
  branchInfo$: Observable<IBranches.IDocument>;

  constructor(
    private servicePackageFacade: ServicePackageFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'Service Menu',
        path: null,
      },
      {
        name: 'Package',
        path: null,
      },
    ];
    this.branchInfo$ = this.servicePackageFacade.branch$;
    this.servicePackages$ = this.servicePackageFacade.servicePackages$;
    this.total$ = this.servicePackageFacade.total$;
    this.servicePackageConfig$ = this.servicePackageFacade.getServicePackageConfig$;
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.loading$ = this.servicePackageFacade.loading$;
    this.error$ = this.servicePackageFacade.error$;
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ServiceLinePackage.CREATE_SERVICE_LINE_PACKAGE,
      permissionTags.ServiceLinePackage.UPDATE_SERVICE_LINE_PACKAGE,
      permissionTags.ServiceLinePackage.LIST_SELF_SERVICE_LINE_PACKAGES,
      permissionTags.ServiceLinePackage.GET_SERVICE_LINE_PACKAGE,
      permissionTags.ServiceLinePackage.LIST_SERVICE_LINE_PACKAGES,
    ]);
    this.servicePackageFacade.getServicePackageList();
  }
  onRefresh(event: boolean) {
    if (event) {
      this.servicePackageFacade.resetServicePackagePage();
    }
  }
  onActiveChange(event: IServiceLine.IChangeStatus) {
    this.servicePackageFacade.changeStatus(event);
  }
  onCustomerView(event: IServiceLine.IChangeStatus) {
    this.servicePackageFacade.changeStatus(event);
  }
  changePage(event: PageEvent) {
    const params: IServiceLine.IConfig = {
      limit: IServiceLine.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.servicePackageFacade.changeServicePackagePage(params);
  }
  onResetToggle(event: IServicePackage.IDocument): void {
    this.servicePackageFacade.resetToggle(event);
  }
}
