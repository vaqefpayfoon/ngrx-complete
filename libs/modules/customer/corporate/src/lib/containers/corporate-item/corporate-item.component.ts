import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IBranches, ICorporates } from '../../models';

// Facades
import { BranchFacade, CorporatesFacade } from '../../+state/facades';
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-corporate-item',
  templateUrl: './corporate-item.component.html',
  styleUrls: ['./corporate-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateItemComponent implements OnInit {
  title = 'create a corporate';

  bc: IBC[];

  corporate$: Observable<ICorporates.IDocument>;

  branches$: Observable<IBranches.IDocument[]>;

  permissions$: Observable<{}>;

  error$: Observable<any>;

  loading$: Observable<any>;

  operations$: Observable<any>;

  account$: Observable<Auth.AccountClass>;

  appImages$: Observable<{
    [file: string]: string;
  }>;

  constructor(
    private corporatesFacade: CorporatesFacade,
    private branchFacade: BranchFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'corporates',
        path: '/app/customer/corporates',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.corporate$ = this.corporatesFacade.corporate$;

    this.branches$ = this.branchFacade.branches$;

    this.account$ = this.authFacade.account$;

    this.operations$ = this.corporatesFacade.operations$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Corporate.CREATE_CORPORATE,
      permissionTags.Corporate.UPDATE_CORPORATE,
      permissionTags.Branch.LIST_BRANCH,
    ]);

    this.appImages$ = this.corporatesFacade.appImages$;

    this.loadOperationsAccounts();
  }

  onCreate(corporate: ICorporates.ICreate) {
    this.corporatesFacade.create(corporate);
  }

  onUpdate(corporate: ICorporates.IDocument) {
    this.corporatesFacade.update(corporate);
  }

  onload(corporate: ICorporates.IDocument) {
    if (corporate) {
      this.bc[this.bc.length - 1].name = corporate.name;
      this.title = corporate.name;
    }
  }

  onUpload(corporate: ICorporates.IDocument) {
    if (corporate) {
      this.corporatesFacade.updateImage(corporate);
    }
  }

  loadOperationsAccounts() {
    this.corporate$.subscribe((data: any) => {
      if (data) {
        const payload = {
          uuid: data.uuid,
        };
        this.corporatesFacade.loadAlloperations(payload);
      }
    });
  }
}
