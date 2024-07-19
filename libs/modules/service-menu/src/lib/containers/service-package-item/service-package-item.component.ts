import { Component, OnInit } from '@angular/core';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { IBC, permissionTags } from '@neural/shared/data';
import { Observable } from 'rxjs';
import { ServicePackageFacade } from '../../+state';
import { IServiceLine, IServicePackage } from '../../models';

@Component({
  selector: 'neural-services-package-item',
  templateUrl: './service-package-item.component.html',
  styleUrls: ['./service-package-item.component.scss']
})
export class ServicePackageItemComponent implements OnInit {

  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  servicePackage$: Observable<IServicePackage.IDocument>;
  error$: Observable<any>;
  permissions$: Observable<{}>;
  selectedCorporate$: Observable<Auth.ICorporates>;
  selectedBranch$: Observable<Auth.IBranch>;
  brands$: Observable<IServiceLine.IBrand[]>;
  serviceLines$: Observable<IServiceLine.IDocument[]>;
  corporateInfo$: Observable<ICorporates.IDocument>;
  branchInfo$: Observable<IBranches.IDocument>;

  bc: IBC[];

  constructor(
    private servicePackageFacade: ServicePackageFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
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
      {
        name: 'create',
        path: null,
      },
    ];
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.branchInfo$ = this.servicePackageFacade.branch$;
    this.brands$ = this.servicePackageFacade.globalBrands$;
    this.serviceLines$ = this.servicePackageFacade.serviceLines$;
    this.corporateInfo$ = this.servicePackageFacade.corporate$;
    this.servicePackage$ = this.servicePackageFacade.servicePackage$;
    this.error$ = this.servicePackageFacade.error$;
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ServiceLinePackage.CREATE_SERVICE_LINE_PACKAGE,
      permissionTags.ServiceLinePackage.UPDATE_SERVICE_LINE_PACKAGE,
      permissionTags.ServiceLinePackage.LIST_SELF_SERVICE_LINE_PACKAGES,
      permissionTags.ServiceLinePackage.LIST_SERVICE_LINE_PACKAGES,
      permissionTags.ServiceLinePackage.GET_SERVICE_LINE_PACKAGE,
    ]);
  }

  onCreatePromotion(create: IServicePackage.IDocument) {
    this.servicePackageFacade.create(create);
  }

  onUpdatePromotion(changes: IServicePackage.IDocument) {
    this.servicePackageFacade.update(changes);
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.servicePackageFacade.onRedirect();
    }
  }

  onLoad(servicePackage: IServicePackage.IDocument) {
    if (servicePackage) {
      this.bc[this.bc.length - 1].name = (servicePackage?.package?.title).toString();;
      this._title = servicePackage?.package?.title;
    }
  }

}
