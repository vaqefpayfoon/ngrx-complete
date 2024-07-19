import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IBranches, ICorporates } from '../../models';

// Facades
import { BranchFacade, BrandsFacade, CorporatesFacade, OperationAccountsFacade } from '../../+state/facades';
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { IAccount } from '@neural/modules/administration';

@Component({
  selector: 'neural-branch-item',
  templateUrl: './branch-item.component.html',
  styleUrls: ['./branch-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BranchItemComponent implements OnInit, OnDestroy {
  title = 'create';

  bc: IBC[];

  selectedCorporate$: Observable<Auth.ICorporates>;

  branches$: Observable<IBranches.IDocument[]>;

  branche$: Observable<IBranches.IDocument>;

  corporate$: Observable<ICorporates.IDocument>;

  corporates$: Observable<ICorporates.IDocument[]>;

  error$: Observable<any>;
  
  total$: Observable<number>;

  loading$: Observable<any>;

  brands$: Observable<string[]>;
  
  permissions$: Observable<{}>;

  accounts$: Observable<IAccount.IDocument[]>;

  constructor(
    private branchFacade: BranchFacade,
    private authFacade: AuthFacade,
    private corporatesFacade: CorporatesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private cd: ChangeDetectorRef,
    private brandsFacade: BrandsFacade,
    private operationAccountsFacade: OperationAccountsFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.branchFacade.onReset();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'corporates',
        path: '/app/customer/corporates'
      },
      {
        name: 'branches',
        path: '/app/customer/corporates'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.corporates$ = this.corporatesFacade.corporates$;

    this.corporate$ = this.corporatesFacade.corporate$;

    this.branches$ = this.branchFacade.branches$;

    this.branche$ = this.branchFacade.selectedBranch$;

    this.error$ = this.branchFacade.error$;

    this.loading$ = this.branchFacade.loading$;
    
    this.total$ = this.branchFacade.total$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.brands$ = this.brandsFacade.globalBrands$;

    this.accounts$ = this.operationAccountsFacade.accounts$;
    
    this.fillOperation();

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Branch.CREATE_BRANCH,
      permissionTags.Branch.UPDATE_BRANCH,
      permissionTags.Branch.GET_BRANCH
    ]);
  }

  createBranch(branch: IBranches.ICreate) {
    this.branchFacade.onCreate(branch);
  }

  updateBranch(branch: IBranches.IDocument) {
    this.branchFacade.onUpdate(branch);
  }

  onTypeEvent(event: IBranches.IOperationPayload): void {
    this.operationAccountsFacade.getAccounts(event);
    this.accounts$ = this.operationAccountsFacade.accounts$;
  }

  fillOperation(): void {
    this.branche$.subscribe(branch => {
      if(branch) {
        const event: IBranches.IOperationPayload = {
          type: '',
          corporateUuid: branch.corporateUuid,
          branchUuid: branch.uuid
        }
        this.operationAccountsFacade.getAccounts(event);
      }
    })
  }

  onLoad({
    corporate,
    branch
  }: {
    corporate: {
      name: string;
      uuid: string;
    };
    branch?: {
      name: string;
      uuid: string;
    };
  }) {
    if (branch) {
      this.bc[this.bc.length - 1].name = branch.name;
      this.title = branch.name;
    }
    this.bc[this.bc.length - 2].name = corporate.name;
    this.bc[this.bc.length - 2].path = `/app/customer/corporates/${
      corporate.uuid
    }`;

    this.cd.detectChanges();
  }
}
