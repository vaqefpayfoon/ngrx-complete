import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { ITestDrives } from '../../models';

// facade
import { TestDrivesFacade } from '../../+state/facades';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-test-drives',
  templateUrl: './test-drives.component.html',
  styleUrls: ['./test-drives.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDrivesComponent implements OnInit {
  bc: IBC[];

  testDrives$: Observable<ITestDrives.IDocument[]>;
  total$: Observable<number>;
  testDrivesConfig$: Observable<ITestDrives.IConfig>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  timeZone$: Observable<string>;

  constructor(
    private testDrivesFacade: TestDrivesFacade,
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
        name: 'Test drives',
        path: null,
      },
    ];

    this.testDrives$ = this.testDrivesFacade.testDrives$;
    this.total$ = this.testDrivesFacade.total$;
    this.testDrivesConfig$ = this.testDrivesFacade.testDrivesConfig$;

    this.loading$ = this.testDrivesFacade.loading$;
    this.error$ = this.testDrivesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.TestDrive.LIST_TEST_DRIVE,
      permissionTags.TestDrive.CANCEL_TEST_DRIVE,
      permissionTags.TestDrive.COMPLETE_TEST_DRIVE,
      permissionTags.TestDrive.GET_TEST_DRIVE,
    ]);

    this.timeZone$ = this.authFacade.timeZone$;
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: ITestDrives.IConfig = {
        limit: ITestDrives.Config.LIMIT,
        page: 1,
      };
      this.testDrivesFacade.changeTestDrivesPage(params);
    }
  }

  changePage(event: PageEvent) {
    const params: ITestDrives.IConfig = {
      limit: ITestDrives.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.testDrivesFacade.changeTestDrivesPage(params);
  }

  cancelTestDrive(testdrive: ITestDrives.IDocument) {
    this.testDrivesFacade.onCancel(testdrive);
  }

  completeTestDrive(testdrive: ITestDrives.IDocument) {
    this.testDrivesFacade.onComplete(testdrive);
  }
}
