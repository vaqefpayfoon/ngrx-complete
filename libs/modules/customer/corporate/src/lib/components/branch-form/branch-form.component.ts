import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

// Models
import { IBranches, ICorporates } from '../../models';
import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Location
import { Location } from '@angular/common';

// Load Country
import { Observable } from 'rxjs';

// Facades
import { BranchFacade } from '../../+state/facades';

// permission tags
import { permissionTags } from '@neural/shared/data';

// function
import { traverseAndRemove } from '@neural/shared/data';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAccount } from '@neural/modules/administration';

@Component({
  selector: 'neural-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchFormComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() corporates: ICorporates.IDocument[];

  @Input() totalBranches: number;

  @Input() corporate: ICorporates.IDocument;

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() branch: IBranches.IDocument;

  @Input() error: any;

  @Input() permissions: any;

  @Input() brands: string[];

  @Input() accounts: IAccount.IDocument[];

  @Output() create = new EventEmitter<IBranches.ICreate>();

  @Output() update = new EventEmitter<IBranches.IDocument>();

  @Output() loaded = new EventEmitter<{
    corporate: {
      name: string;
      uuid: string;
    };
    branch?: {
      name: string;
      uuid: string;
    };
  }>();

  @Output() typeEvent = new EventEmitter<string>();

  @ViewChild('curreny') curreny: ElementRef<HTMLInputElement>;

  countries$: Observable<string[]>;
  states$: Observable<IBranches.IGetCountry>;

  form: FormGroup = this.fb.group({
    name: ['', Validators.compose([Validators.required])],
    order: [''],
    isHq: [false],
    email: [''],
    landingPhone: ['', Validators.compose([Validators.required])],
    image: ['', Validators.compose([Validators.required])],
    corporateUuid: ['', Validators.compose([Validators.required])],
    workshops: this.fb.array([]),
    mapCoveragePostalCodes: this.fb.group({
      mobileService: [''],
      testDrive: [''],
    }),
    location: this.locationGroup(),
    payments: this.fb.group({}),
    configuration: this.fb.group({
      notification: this.fb.group({}),
      subscriptions: this.fb.group({
        cdk: this.fb.group({
          dealerId: [''],
        }),
        fortellis: this.fb.group({
          subscriptionId: [''],
        }),
        adtorque: this.fb.group({
          workshopId: [''],
        }),
        leaseGenius: this.fb.group({
          dealerId: [''],
        }),
      }),
    }),
    schedules: this.fb.array([]),
  });

  private _exists = false;
  
  public get exists(): boolean {
    return this._exists;
  }

  public set exists(value: boolean) {
    this._exists = value;
  }

  constructor(
    private fb: FormBuilder,
    private branchFacade: BranchFacade,
    private location: Location,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.form.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.corporate && changes.corporate.currentValue) {
      this.corporateUuid.patchValue(this.corporate.uuid);

      const {
        configuration: {
          vehicles: { coverages },
        },
      } = this.corporate;

      if (!!coverages.length) {
        this.emptyWorkshop();
        for (const _ of coverages) {
          this.addWorkshop();
        }
      }
    }

    if (changes.branch && changes.branch.currentValue) {
      this._initialData();
    }

    if (!!this.branch) {
      const { location } = this.branch;

      if (location && location.country) {
        this.onSelectCountry(location.country);
      }
    }

    if (!!this.corporate && !!this.branch) {
      this._initialWorkshop();

      this.loaded.emit({
        corporate: {
          name: this.corporate.name,
          uuid: this.corporate.uuid,
        },
        branch: {
          name: this.branch.name,
          uuid: this.branch.uuid,
        },
      });
    }

    if (this.corporate && !this.branch) {
      this.loaded.emit({
        corporate: {
          name: this.corporate.name,
          uuid: this.corporate.uuid,
        },
      });
    }

    if (!this.exists) {
      this.order.patchValue(this.totalBranches + 1);
    }
  }

  private _initialWorkshop() {
    const { workshops } = this.branch;

    const {
      configuration: {
        vehicles: { coverages },
      },
    } = this.corporate;

    this.form.enable();
    this.emptyWorkshop();
    if (!!workshops) {
      for (const workshop of this.branch?.workshops ?? []) {
        this.addWorkshop(workshop);
      }

      // workshops and coverages difference
      if (coverages.length - workshops.length > 0) {
        const diff = Array.from(
          { length: coverages.length - workshops.length },
          Number.call,
          (i) => i + 1
        );

        for (const _ of diff) {
          this.addWorkshop();
        }
      }
      this.form.disable();
    } else {
      const diff = new Array(coverages.length);

      for (const _ of diff) {
        this.addWorkshop();
      }
    }
  }

  private _initialData() {
    this.form.enable();
    this.form.reset();

    this.form.patchValue(this.branch);

    if (!!this.branch.location && !!this.branch.location.country) {
      this.branchFacade.onLoadStates(this.branch.location.country);
    }

    this.emptyPayment();

    for (const key in this.branch.payments) {
      if (Object.prototype.hasOwnProperty.call(this.branch.payments, key)) {
        this.addPayment(key, this.branch.payments[key]);
      }
    }

    this.form.disable();
    this.exists = true;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  ngOnInit() {
    this.countries$ = this.branchFacade.countryNames$;
    this.states$ = this.branchFacade.selectedCountry$;
    this.locations.get('state').disable();
  }

  addSchedule(): FormArray {
    const schedule = this.fb.group({
      name: ['', Validators.required],
      type: '',
      maxAppointmentsPerWeek: [0, [Validators.max(50), Validators.min(0)]],
    });
    const formArray = new FormArray([]);
    formArray.push(schedule);
    return formArray;
  }

  // workshop
  emptyWorkshop() {
    while (this.workshop.controls.length) {
      this.workshop.removeAt(0);
    }
  }

  removeWorkshop(event: number) {
    const control = this.form.get('workshops') as FormArray;
    return control.removeAt(event);
  }

  createWorkshop(): FormGroup {
    return this.fb.group({
      brand: [''],
      name: this.fb.group({
        mobileService: [''],
        serviceCenter: [''],
      }),
      id: this.fb.group({
        mobileService: [''],
        serviceCenter: [''],
      }),
    });
  }

  addWorkshop(workshop?: IBranches.IWorkshop | any) {
    if (workshop) {
      const createWorkshop = this.fb.group({
        brand: [workshop.brand],
        name: this.fb.group({
          mobileService: [
            workshop?.name?.mobileService ? workshop.name.mobileService : '',
          ],
          serviceCenter: [
            workshop?.name?.serviceCenter ? workshop.name.serviceCenter : '',
          ],
        }),
        id: this.fb.group({
          mobileService: [
            workshop?.id?.mobileService ? workshop.id.mobileService : '',
          ],
          serviceCenter: [
            workshop?.id?.serviceCenter ? workshop.id.serviceCenter : '',
          ],
        }),
      });

      this.workshop.push(createWorkshop);
    } else {
      this.workshop.push(this.createWorkshop());
    }
  }

  emptyPayment() {
    for (const key in IBranches.PaymentTypes) {
      if (Object.prototype.hasOwnProperty.call(IBranches.PaymentTypes, key)) {
        this.payment.removeControl(key);
      }
    }
  }

  createPayment(name: string) {
    return this.payment.setControl(
      name,
      this.fb.group({
        methods: this.fb.array([], Validators.compose([Validators.required])),
        currency: [
          this.curreny.nativeElement.value ?? '',
          Validators.compose([Validators.required]),
        ],
      })
    );
  }

  createPaymentMethod({ name, method }: { name: string; method: string }) {
    const methods = <FormArray>(
      (<FormGroup>this.payment.get(name)).get('methods')
    );

    const getways = [];

    for (const getway in IBranches.GatewaysName) {
      if (isNaN(Number(getway))) {
        getways.push(this.createGateWay(getway));
      }
    }

    if (method === IBranches.MethodNames.ONLINE_BANKING) {
      return methods.push(
        this.fb.group({
          type: [method, Validators.compose([Validators.required])],
          default: [true, Validators.compose([Validators.required])],
          gateways: this.fb.array([...getways]),
        })
      );
    }

    return methods.push(
      this.fb.group({
        type: [method, Validators.compose([Validators.required])],
        default: [false, Validators.compose([Validators.required])],
      })
    );
  }

  createGateWay(name: string) {
    return this.fb.group({
      name: [name, Validators.compose([Validators.required])],
      access: this.fb.group({
        serviceId: [''],
        password: [''],
        merchantName: [''],
        paymentGatewayUrl: [''],
        merchantCallbackUrl: [''],
        merchantReturnUrl: [''],
        merchantAccountName: [''],
        apiKey: [''],
        livePrefixUrl: [''],
        secretKey: [''],
        publishableKey: [''],
        bookingEndpointSecret: [''],
        downpaymentEndpointSecret: [''],
        invoiceSecret: [''],
      }),
    });
  }

  addGateWay(gateway: IBranches.IGateway | null) {
    return this.fb.group({
      name: [gateway.name, Validators.compose([Validators.required])],
      access: this.fb.group({
        serviceId: [gateway.access.serviceId],
        password: [gateway.access.password],
        merchantName: [gateway.access.merchantName],
        paymentGatewayUrl: [gateway.access.paymentGatewayUrl],
        merchantCallbackUrl: [gateway.access.merchantCallbackUrl],
        merchantReturnUrl: [gateway.access.merchantReturnUrl],
        merchantAccountName: [gateway.access.apiKey],
        apiKey: [gateway.access.apiKey],
        livePrefixUrl: [gateway.access.livePrefixUrl],
        secretKey: [gateway.access.secretKey],
        publishableKey: [gateway.access.publishableKey],
        webhookSecretKey: [gateway.access.webhookSecretKey],
      }),
    });
  }

  addPayment(name: string, payment: IBranches.IPaymentDetail | null) {
    if (name && payment) {
      this.payment.setControl(
        name,
        this.fb.group({
          methods: this.fb.array([], Validators.compose([Validators.required])),
          currency: [
            payment.currency,
            Validators.compose([Validators.required]),
          ],
        })
      );

      const methods = <FormArray>(
        (<FormGroup>this.payment.get(name)).get('methods')
      );

      payment.methods.map((method) => {
        const getways = [];

        if (Object.prototype.hasOwnProperty.call(method, 'gateways')) {
          method?.gateways.map((gateway) =>
            getways.push(this.addGateWay(gateway))
          );

          if (!!getways.length) {
            if (method.type === IBranches.MethodNames.ONLINE_BANKING) {
              return methods.push(
                this.fb.group({
                  type: [
                    method.type,
                    Validators.compose([Validators.required]),
                  ],
                  default: [
                    method.default,
                    Validators.compose([Validators.required]),
                  ],
                  gateways: this.fb.array([...getways]),
                })
              );
            }

            return methods.push(
              this.fb.group({
                type: [method.type, Validators.compose([Validators.required])],
                default: [
                  method.default,
                  Validators.compose([Validators.required]),
                ],
              })
            );
          }
        }
      });
    }
  }

  onAction() {
    this.form.enable();
  }

  async loadData() {
    await this._initialData();
    await this._initialWorkshop();
  }

  cancel(event?: any) {
    if (this.exists) {
      this.loadData();
    } else {
      this.location.back();
    }
  }

  createBranch(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      if (this.detailCheck()) {
        this.create.emit({
          ...value,
          image: this.image.value,
        });
        this.form.disable();
      }
    }
  }

  updateBranch(form: FormGroup) {
    const { valid, value } = form;
    const updateDoc = {
      ...this.branch,
      ...value,
    };
    if (this.detailCheck()) {
      this.update.emit({ ...updateDoc, image: this.image.value });
      this.form.disable();
    }
  }

  // Image Preview
  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.image.updateValueAndValidity();
  }

  locationGroup(): FormGroup {
    return this.fb.group({
      country: ['', Validators.required],
      timezone: ['', Validators.required],
      state: ['', Validators.required],
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      googlePlaceId: ['', Validators.required],
    });
  }

  onSelectCountry(name: string) {
    this.branchFacade.onLoadStates(name);
  }

  get schedules(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  get orders() {
    return Array.from(Array(this.totalBranches).keys(), (n) => n + 1);
  }

  get corporateUuid() {
    return this.form.get('corporateUuid') as FormControl;
  }

  get image() {
    return this.form.get('image') as FormControl;
  }

  get name() {
    return this.form.get('name') as FormControl;
  }

  get order() {
    return this.form.get('order') as FormControl;
  }

  get landingPhone() {
    return this.form.get('landingPhone') as FormControl;
  }

  get locations() {
    return this.form.get('location') as FormControl;
  }

  get workshop() {
    return this.form.get('workshops') as FormArray;
  }

  get payment() {
    return this.form.get('payments') as FormGroup;
  }

  get configuration() {
    return this.form.get('configuration') as FormGroup;
  }

  get notification() {
    return this.configuration.get('notification') as FormGroup;
  }

  detailCheck(): boolean {
    const values = this.form.value;
    if (values?.schedules) {
      for (const ite of values.schedules) {
        if (!ite?.weeks?.teams || !ite?.weeks?.teams?.length) {
          this.toggleSnackbar('Oops! Teams data is invalid.');
          return false;
        }
        if (ite?.weeks?.teams && ite?.weeks?.teams?.length) {
          for (const schedule of ite.weeks.teams) {
            if (!schedule.name || !schedule.slotDuration) {
              this.toggleSnackbar('Oops! Weekly data is invalid.');
              return false;
            }
          }
        }
      }
    } else {
      this.form.patchValue({schedules: []})
    }
    return true;
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }

  generalValidation() {
    if (this.name.valid && this.landingPhone.valid) {
      return true;
    }
    return false;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.CREATE_BRANCH]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.UPDATE_BRANCH]
    ) {
      return true;
    }
    return false;
  }

  get onlineGateways() {
    return IBranches.GatewaysName;
  }

  onTypeEvent(event: string): void {
    this.typeEvent.emit(event);
  }

  get validateSchedule(): boolean {
    const values = this.form.value;
    if (values?.schedules) {
      for (const ite of values.schedules) {
        if (!ite.name || !ite.type) {
          return false;
        }
      }
    }
    return true;
  }
}
