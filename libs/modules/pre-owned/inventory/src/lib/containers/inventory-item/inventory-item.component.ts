import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

//Rxjs
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

//Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// BreadCrumb Interface
import { IBC, IError } from '@neural/shared/data';

// permission tags
import { permissionTags } from '@neural/shared/data';

//Models
import { IInventory } from '../../models';

//Services
import { InventoryService } from '../../services';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'neural-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss'],
})
export class InventoryItemComponent implements OnInit {
  private _title = 'Inventory Vehicles';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  error$: IError;

  permissions$: Observable<{} | null>;

  selectedCorporate$: Observable<Auth.ICorporates | null>;

  bc: IBC[] | null;

  inventoryUploadedFile$: Observable<IInventory.ICreate | null>;

  constructor(
    private cd: ChangeDetectorRef,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'Inventory importer',
        path: null,
      },
    ];

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Analytic.UPLOAD_PRE_OWNED_INVENTORY,
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  onLoad(corporate: string) {
    if (corporate) {
      this.bc[this.bc.length - 1].name = `Inventory importer | ${corporate}`;
      
      this.title = `${this.bc[this.bc.length - 1].name}`;
      this.cd.detectChanges();
    }
  }

  onUpload(value: IInventory.ICreate) {
    this.inventoryUploadedFile$ = this.inventoryService.uploadFile(value).pipe(
      catchError((res: any) => {
        this.toggleSnackbar(res.error.response.message);
        return of(null);
      })
    );
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
