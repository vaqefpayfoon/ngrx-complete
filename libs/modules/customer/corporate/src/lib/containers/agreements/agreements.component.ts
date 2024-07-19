import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IAgreements, ICorporates } from '../../models';

// Facades
import { AgreementsFacade, CorporatesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'neural-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgreementsComponent implements OnInit, AfterViewInit {
  corporate$: Observable<ICorporates.IDocument>;

  agreementsConfig$: Observable<IAgreements.IConfig>;

  agreements$: Observable<IAgreements.IDocument[]>;

  token$: Observable<string>;

  total$: Observable<number>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  @ViewChild('corporateName', { static: true })
  public corporateName: ElementRef<HTMLInputElement>;

  constructor(
    private agreementsFacade: AgreementsFacade,
    private corporatesFacade: CorporatesFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngAfterViewInit() {
    this.bc[this.bc.length - 2].name = this.corporateName.nativeElement.value;
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
        name: 'corporate name',
        path: null
      },
      {
        name: 'agreements',
        path: null
      }
    ];

    this.corporate$ = this.corporatesFacade.corporate$;

    this.agreementsConfig$ = this.agreementsFacade.corporateAgreementsConfig$;

    this.agreements$ = this.agreementsFacade.agreements$;

    this.total$ = this.agreementsFacade.total$;

    this.error$ = this.agreementsFacade.error$;

    this.loading$ = this.agreementsFacade.loading$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Agreement.LIST_AGREEMENT,
      permissionTags.Agreement.CREATE_AGREEMENT,
      permissionTags.Agreement.GET_AGREEMENT
    ]);
  }

  onRefresh(event: boolean, corporateUuid: string) {
    if (event) {
      const params: IAgreements.IConfig = {
        corporateUuid
      };
      this.agreementsFacade.setCorporateAgreementsPage(params);
    }
  }
}
