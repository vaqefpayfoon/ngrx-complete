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
import { ITestDrives } from '../../models';

// facade
import { TestDrivesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { tap } from 'rxjs/operators';
import { IBranches } from '@neural/modules/customer/corporate';

@Component({
  selector: 'neural-test-drive-item',
  templateUrl: './test-drive-item.component.html',
  styleUrls: ['./test-drive-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDriveItemComponent implements OnInit, OnDestroy {
  private _title = 'Test drive';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  testDrive$: Observable<ITestDrives.IDocument>;

  salesAdvisors$: Observable<Auth.IAccount[]>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  selectedBranch$: Observable<Auth.IBranch>;

  testDriveCalendar$: Observable<ITestDrives.ITestDriveCalendar[]>;

  bc: IBC[];

  timeZone$: Observable<string>;

  branch$: Observable<IBranches.IDocument>;

  constructor(
    private cd: ChangeDetectorRef,
    private testDrivesFacade: TestDrivesFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'test drive',
        path: '/app/hub/test-drives',
      },
      {
        name: 'create',
        path: null,
      },
    ];
    this.branch$ = this.testDrivesFacade.selectedBranch$;
    this.testDrive$ = this.testDrivesFacade.testDrive$;
    this.salesAdvisors$ = this.testDrivesFacade.salesAdvisors$;
    this.testDriveCalendar$ = this.testDrivesFacade.testDriveCalendar$;
    this.error$ = this.testDrivesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.TestDrive.UPDATE_TEST_DRIVE,
      permissionTags.TestDrive.GET_TEST_DRIVE,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.timeZone$ = this.authFacade.timeZone$;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.testDrivesFacade.onResetSelectedTestDrive();
  }

  onUpdate(testDrive: ITestDrives.IDocument) {
    this.testDrivesFacade.onUpdate(testDrive);
  }

  onLoad(testDrive: ITestDrives.IDocument) {
    if (testDrive) {
      const name = testDrive?.unit?.brand
        ? `${testDrive?.unit?.brand ?? ''} ${testDrive?.unit?.display ?? ''} ${
            testDrive?.unit?.variant ?? ''
          }`
        : testDrive?.account?.identity?.fullName;

      this.bc[this.bc.length - 1].name = name;

      this.title = name;

      this.cd.detectChanges();
    }
  }

  onChangeCalendar(filters: {filter: ITestDrives.IFilter, adtorque: boolean}): void {
    this.testDrivesFacade.onChangeTestDriveCalendar(filters);
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.testDrivesFacade.onRedirect();
    }
  }
}
