import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IBranches, ICorporates } from '../../models';

// Facades
import { BranchFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchesComponent implements OnInit {
  corporate$: Observable<Auth.ICorporates>;

  branches$: Observable<IBranches.IDocument[]>;

  total$: Observable<number>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  constructor(
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
        path: null
      },
      {
        name: 'corporates',
        path: '/app/customer/corporates'
      },
      {
        name: 'create',
        path: null
      }
    ];
    this.corporate$ = this.authFacade.selectedCorporate;
    this.branches$ = this.branchFacade.branches$;

    this.error$ = this.branchFacade.error$;

    this.loading$ = this.branchFacade.loading$;

    this.total$ = this.branchFacade.total$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Branch.LIST_BRANCH,
      permissionTags.Branch.CREATE_BRANCH,
      permissionTags.Branch.GET_BRANCH
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.corporate$.subscribe(corporate => {
        this.branchFacade.onLoad(corporate.uuid);
      });
    }
  }

  ordered(payload: IBranches.IDocument) {
    this.branchFacade.onUpdate(payload);
  }
}
