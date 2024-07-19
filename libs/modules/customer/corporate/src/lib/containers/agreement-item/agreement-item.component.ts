import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IAgreements, ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Facades
import { AgreementsFacade, CorporatesFacade } from '../../+state/facades';

// RxJs
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'neural-agreement-item',
  templateUrl: './agreement-item.component.html',
  styleUrls: ['./agreement-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementItemComponent implements OnInit {
  permissions$: Observable<{}>;

  corporate$: Observable<ICorporates.IDocument>;

  agreement$: Observable<IAgreements.IDocument>;

  agreementUploadedFile$: Observable<IAgreements.IDocument>;

  error$: Observable<any>;

  bc: IBC[];

  title = 'new agreement';

  constructor(
    private permissionValidatorService: PermissionValidatorService,
    private corporatesFacade: CorporatesFacade,
    private agreementsFacade: AgreementsFacade,
    private snackBar: MatSnackBar
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
        name: 'corporate name',
        path: null,
      },
      {
        name: 'agreements',
        path: null,
      },
      {
        name: 'new',
        path: null,
      },
    ];

    this.corporate$ = this.corporatesFacade.corporate$;

    this.agreement$ = this.agreementsFacade.agreement$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Agreement.CREATE_AGREEMENT,
      permissionTags.Agreement.UPDATE_AGREEMENT,
      permissionTags.Agreement.GET_AGREEMENT,
    ]);
  }

  onCreare(payload: IAgreements.ICreate) {
    this.agreementsFacade.create(payload);
  }

  onUpdate(payload: IAgreements.IDocument) {
    this.agreementsFacade.update(payload);
  }

  onLoad({
    agreement,
    corporate,
  }: {
    agreement?: IAgreements.IDocument;
    corporate: ICorporates.IDocument;
  }) {
    if (corporate && agreement) {
      this.bc[this.bc.length - 1].name = agreement.type;
      this.bc[
        this.bc.length - 2
      ].path = `/app/customer/corporates/${agreement.corporateUuid}/agreement`;
      this.bc[this.bc.length - 3].name = corporate.name;
      this.bc[
        this.bc.length - 3
      ].path = `/app/customer/corporates/${agreement.corporateUuid}`;
      this.title = agreement.type;
    }

    if (corporate && !agreement) {
      this.bc[
        this.bc.length - 2
      ].path = `/app/customer/corporates/${corporate.uuid}/agreement`;
      this.bc[this.bc.length - 3].name = corporate.name;
      this.bc[
        this.bc.length - 3
      ].path = `/app/customer/corporates/${corporate.uuid}`;
    }
  }

  onUploadFile({
    index,
    payload,
  }: {
    index: number;
    payload: IAgreements.IUploadFile;
  }): void {
    this.agreementUploadedFile$ = this.agreementsFacade
      .uploadAgreementFile(payload)
      .pipe(
        map((payload) => {
          return { index, pdfUrl: payload };
        }),
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
