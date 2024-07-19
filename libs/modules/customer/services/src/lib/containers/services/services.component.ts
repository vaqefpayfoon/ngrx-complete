import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC, ISort } from '@neural/shared/data';

// Models
import { IServices } from '../../models';

// facade
import { ServicesFacade } from '../../+state/facade';

// RxJs
import { Observable } from 'rxjs';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { ServiceConfirmationDialogComponent } from '../../components';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  services$: Observable<IServices.IDocument[]>;
  category$: Observable<string | null>;
  total$: Observable<number>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  @ViewChild('cat', { static: true }) public cat: ElementRef<HTMLInputElement>;

  constructor(
    private servicesFacade: ServicesFacade,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'services',
        path: null
      }
    ];

    this.services$ = this.servicesFacade.services$;
    this.total$ = this.servicesFacade.total$;

    this.loading$ = this.servicesFacade.loading$;
    this.error$ = this.servicesFacade.error$;
    this.category$ = this.servicesFacade.category$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Service.LIST_SERVICE,
      permissionTags.Service.GET_SERVICE,
      permissionTags.Service.CREATE_SERVICE,
      permissionTags.Service.ACTIVATE_SERVICE,
      permissionTags.Service.DEACTIVATE_SERVICE
    ]);
  }

  openDialog(event: IServices.IDocument) {
    const dialogRef = this.dialog.open(ServiceConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.servicesFacade.toggleStatus(event);
      } else {
        return this.servicesFacade.resetToggle(event);
      }
    });
  }

  onRefresh(event: boolean) {
    if (event) {
      this.servicesFacade.onLoad();
    }
  }
}
