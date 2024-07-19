import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

// BreadCrumb Interface
import { IBC, IBody } from '@neural/shared/data';

// Models
import { IInsurer } from '../../models';

// facade
import { InsurerFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { BehaviorSubject, Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'neural-insurer-item',
  templateUrl: './insurer-item.component.html',
  styleUrls: ['./insurer-item.component.scss'],
})
export class InsurerItemComponent implements OnInit, AfterViewInit {
  title = 'create an insurer';

  insurer$!: Observable<IInsurer.IDocument | null | undefined>;

  permissions$!: Observable<{ [name: string]: any }>;

  bc!: IBC[];

  corporateUuid$ = new BehaviorSubject('');

  @ViewChild('corporate') corporate!: ElementRef<HTMLInputElement>;

  constructor(
    private insurerFacade: InsurerFacade,
    private authFacade: AuthFacade,
    private purchasesFacade: InsurerFacade,
    private permissionValidatorService: PermissionValidatorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  ngAfterViewInit() {
    if (this.corporate && this.corporate.nativeElement) {
      this.bc[this.bc.length - 2].path = `${this.bc[this.bc.length - 2].path}/${
        this.corporate.nativeElement.getAttribute('data-uuid') || ''
      }`;

      this.bc[this.bc.length - 3].name =
        this.corporate.nativeElement.getAttribute('data-name') || '';

      this.bc[this.bc.length - 3].path = `${this.bc[this.bc.length - 3].path}/${
        this.corporate.nativeElement.getAttribute('data-uuid') || ''
      }`;
    }

    this.bc = [...this.bc];
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
        name: 'insurers',
        path: '/app/customer/corporates/insurers',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.insurer$ = this.purchasesFacade.insurer$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Insurer.CREATE_INSURER,
      permissionTags.Insurer.UPDATE_INSURER,
    ]);
  }

  onCreate(payload: IInsurer.ICreate): void {
    this.insurerFacade.create({ payload });
  }

  onUpdate(payload: IBody<IInsurer.IDocument, IInsurer.IUpdate>): void {
    this.insurerFacade.update(payload);
  }

  onLoad(payload: IInsurer.IDocument): void {
    const { name, corporateUuid } = payload;
    this.bc[this.bc.length - 1].name = name;

    this.bc[this.bc.length - 2].path = `${
      this.bc[this.bc.length - 2].path
    }/${corporateUuid}`;

    this.title = name;
    this.bc = [...this.bc];
    this.cdr.detectChanges();
  }

  get corporate$(): Observable<Auth.ICorporates | undefined> {
    return this.insurerFacade.corporateUuid$.pipe(
      switchMap((uuid) =>
        this.authFacade.corporates$.pipe(
          map((corporates) =>
            corporates.find((corporate) => corporate.uuid === uuid)
          )
        )
      )
    );
  }
}
