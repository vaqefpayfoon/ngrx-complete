import { Component, OnInit } from '@angular/core';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { IBC, permissionTags } from '@neural/shared/data';
import { Observable } from 'rxjs';
import { ServiceLineFacade } from '../../+state';
import { IServiceLine } from '../../models';

@Component({
  selector: 'neural-service-line-item',
  templateUrl: './service-line-item.component.html',
  styleUrls: ['./service-line-item.component.scss']
})
export class ServiceLineItemComponent implements OnInit {
  private _title = 'create';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  serviceLine$: Observable<IServiceLine.IDocument>;
  error$: Observable<any>;
  permissions$: Observable<{}>;
  selectedCorporate$: Observable<Auth.ICorporates>;
  selectedBranch$: Observable<Auth.IBranch>;
  brands$: Observable<IServiceLine.IBrand[]>;
  fortellis$: Observable<IServiceLine.IFortellis>;
  serviceTypes$: Observable<any>;
  corporateInfo$: Observable<ICorporates.IDocument>;
  branchInfo$: Observable<IBranches.IDocument>;

  bc: IBC[];

  constructor(
    private serviceLineFacade: ServiceLineFacade,
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
        name: 'Service',
        path: null,
      },
      {
        name: 'create',
        path: null,
      },
    ];
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.branchInfo$ = this.serviceLineFacade.branch$;
    this.brands$ = this.serviceLineFacade.globalBrands$;
    this.serviceTypes$ = this.serviceLineFacade.serviceTypelist$;
    this.corporateInfo$ = this.serviceLineFacade.corporate$;
    this.serviceLine$ = this.serviceLineFacade.serviceLine$;
    this.fortellis$ = this.serviceLineFacade.fortellis$;
    this.error$ = this.serviceLineFacade.error$;
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ServiceLine.CREATE_SERVICE_LINE,
      permissionTags.ServiceLine.UPDATE_SERVICE_LINE,
      permissionTags.ServiceLine.LIST_SERVICE_LINES,
      permissionTags.ServiceLine.GET_SERVICE_LINE,
    ]);
  }

  onCreatePromotion(create: IServiceLine.IDocument) {
    this.serviceLineFacade.create(create);
  }

  onUpdatePromotion(changes: IServiceLine.IDocument) {
    this.serviceLineFacade.update(changes);
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.serviceLineFacade.onRedirect();
    }
  }

  onLoad(serviceLine: IServiceLine.IDocument) {
    if (serviceLine) {
      this.bc[this.bc.length - 1].name = serviceLine?.operationCode;
      this._title = serviceLine?.operationCode;
    }
  }

  onForetellisChange(param: IServiceLine.IParams): void {
    this.serviceLineFacade.getFortellis(param);
  }
}
