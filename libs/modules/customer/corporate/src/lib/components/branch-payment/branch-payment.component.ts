import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// Angular forms
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Models
import { IBranches } from '../../models';
import { GatewaysName } from '../../models/branches.interface';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-branch-payment',
  templateUrl: './branch-payment.component.html',
  styleUrls: ['./branch-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchPaymentComponent implements OnChanges {
  @Input() permissions: any;

  @Input() parent: FormGroup;

  @Input() branch: IBranches.IDocument;

  @Input() exists: boolean;

  @Input() currencies: IBranches.IGetCountry;

  @Output() added = new EventEmitter<any>();

  @Output() selectedMethod = new EventEmitter<any>();

  @Output() removed = new EventEmitter<any>();

  @Output() created = new EventEmitter<any>();

  @Output() updated = new EventEmitter<any>();

  @Output() cancelled = new EventEmitter<any>();

  selectedGate: GatewaysName[] = [GatewaysName.EGHL];

  selectedGateAfterSales: GatewaysName[] = [GatewaysName.EGHL];

  private _activeSale = false;
  public get activeSale(): boolean {
    return this._activeSale;
  }
  public set activeSale(value: boolean) {
    this._activeSale = value;
  }

  private _activeAfterSale = false;
  public get activeAfterSale(): boolean {
    return this._activeAfterSale;
  }
  public set activeAfterSale(value: boolean) {
    this._activeAfterSale = value;
  }

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.branch && changes.branch.currentValue && this.branch) {
      if (Object.prototype.hasOwnProperty.call(this.branch, 'payments')) {
        if (
          Object.prototype.hasOwnProperty.call(this.branch.payments, 'sales')
        ) {
          this.activeSale = true;
        }
        if (
          Object.prototype.hasOwnProperty.call(
            this.branch.payments,
            'afterSales'
          )
        ) {
          this.activeAfterSale = true;
        }
      }
    }
  }

  myGetways(i: number) {
    const method = (<FormArray>this.sales.get('methods')).controls;

    return (method[i].get('gateways') as FormArray).controls;
  }

  myAfterSalesGetways(i: number) {
    const method = (<FormArray>this.afterSales.get('methods')).controls;

    return (method[i].get('gateways') as FormArray).controls;
  }

  addOnlineGateway(gateWayFromGroup: FormGroup) {
    const gateways = <FormArray>gateWayFromGroup.controls.gateways;
    gateways.push(this.createGateWay());
    this.selectedGate.push(GatewaysName.EGHL);
  }

  addOnlineGatewayAfterSales(gateWayFromGroup: FormGroup) {
    const gateways = <FormArray>gateWayFromGroup.controls.gateways;
    gateways.push(this.createGateWay());
    this.selectedGateAfterSales.push(GatewaysName.EGHL);
  }

  removeOnlineGateway(index: number, gateWayFromGroup: FormGroup) {
    const gateways = <FormArray>gateWayFromGroup.controls.gateways;
    gateways.removeAt(index);
    this.selectedGate.splice(index, 1);
  }

  removeOnlineGatewayAfterSales(index: number, gateWayFromGroup: FormGroup) {
    const gateways = <FormArray>gateWayFromGroup.controls.gateways;
    gateways.removeAt(index);
    this.selectedGateAfterSales.splice(index, 1);
  }

  createPayment(name: string) {
    this.added.emit(name);
    this.selectedMethod.emit({
      name,
      method: IBranches.MethodNames.ONLINE_BANKING,
    });
    if (name === IBranches.PaymentTypes.SALES) {
      this.activeSale = true;
    }
    if (name === IBranches.PaymentTypes.AFTER_SALES) {
      this.activeAfterSale = true;
    }
  }

  createGateWay() {
    return this.fb.group({
      name: ['', Validators.compose([Validators.required])],
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


  onSelectGateway(value: IBranches.GatewaysName, g: number) {
    this.selectedGate[g] = value;
  }

  onSelectGatewayAfterSales(value: IBranches.GatewaysName, g: number) {
    this.selectedGateAfterSales[g] = value;
  }

  createBranch(form: FormGroup) {
    const { valid } = form;

    if (valid) {
      this.created.emit(form);
    }
  }

  updateBranch(form: FormGroup) {
    const { valid } = form;

    if (valid) {
      this.updated.emit(form);
    }
  }

  onCancel() {
    this.cancelled.emit();
  }

  isAdyanForm(g: number): boolean {
    return this.selectedGate[g] == GatewaysName.ADYEN;
  }

  isStripeForm(g: number): boolean {
    return this.selectedGate[g] == GatewaysName.STRIPE;
  }

  isAdyanFormAfterSales(g: number): boolean {
    return this.selectedGateAfterSales[g] == GatewaysName.ADYEN;
  }

  isStripeFormAfterSales(g: number): boolean {
    return this.selectedGateAfterSales[g] == GatewaysName.STRIPE;
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

  get types() {
    return IBranches.PaymentTypes;
  }

  get onlineGateways() {
    return IBranches.GatewaysName;
  }

  get method() {
    return IBranches.MethodNames;
  }

  get payment() {
    return this.parent.get('payments') as FormGroup;
  }

  get sales() {
    return this.payment.get('sales') as FormGroup;
  }

  get afterSales() {
    return this.payment.get('afterSales') as FormGroup;
  }

  get afterSalesMethods() {
    return (this.afterSales.get('methods') as FormArray).controls;
  }

  get methods() {
    return (this.sales.get('methods') as FormArray).controls;
  }
}
