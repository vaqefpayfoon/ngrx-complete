import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// Models
import { IBankLoan, IPurchases } from '../../../models';
import { ICorporates } from '@neural/modules/customer/corporate';

// Bank JSON
import banksJson from '@nerv/banks';

// Material
import { MatSelectChange } from '@angular/material/select';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

//functions
import { range, loanCalculator } from '../../../functions';

//Rxjs
import { Observable } from 'rxjs';
import { filter, map, debounceTime } from 'rxjs/operators';
import { ValidationService } from '@neural/ui';

@Component({
  selector: 'neural-bank-loan-application-calculator',
  templateUrl: './bank-loan-application-calculator.component.html',
  styleUrls: [
    './bank-loan-application-calculator.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankLoanApplicationCalculatorComponent
  implements OnChanges, OnInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() bankApplications: IBankLoan.ISelfBankLoans[];

  @Input() loans: IBankLoan.IDocument[];

  @Output() calculateChanges = new EventEmitter<IBankLoan.ISelfBankLoans>();

  form: FormGroup;

  formChange$: Observable<any>;

  loanCalculator: number;

  loanAmount: number;

  constructor(private fb: FormBuilder) {
    this.form = this.initialCalculatorForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.purchase && changes.purchase.currentValue) {
      this.downPayment.setValidators([
        ValidationService.halfPrice(this.purchase?.model?.price),
        Validators.compose([Validators.required]),
      ]);

      this.downPayment.updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.formChange$ = this.form.statusChanges.pipe(
      debounceTime(500),
      filter((status) => status !== 'INVALID'),
      map(() => {
        const downpayment = parseFloat(this.downPayment.value);
        const totalPrice = this.purchase.model.price;
        const monthlyInterest = parseFloat(this.interestRate.value) / 100;
        const yearlyPeriod = parseInt(this.period.value, 10);

        this.loanAmount =
          totalPrice > downpayment ? totalPrice - downpayment : downpayment;

        this.loanCalculator =
          totalPrice > downpayment
            ? loanCalculator({
                monthlyInterest,
                yearlyPeriod,
                totalPrice,
                downpayment,
              })
            : 0;
      })
    );
  }

  private initialCalculatorForm(): FormGroup {
    return this.fb.group({
      bank: ['', Validators.compose([Validators.required])],
      downPayment: ['', Validators.compose([Validators.required])],
      interestRate: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(10),
        ]),
      ],
      period: ['', Validators.compose([Validators.required])],
    });
  }

  onSelect(event: MatSelectChange) {
    const { value } = event;

    const rate = this.banks.find((x) => x.uuid === value).interestRate;

    this.interestRate.patchValue(rate);
  }

  onCalculate(form: FormGroup) {
    const { value, valid } = form;

    if (valid) {
      const createLoans: IBankLoan.ISelfBankLoans = {
        bankUuid: value.bank,
        loan: {
          amount: value?.loanAmount,
          downPayment: value?.downPayment,
          interestRate: value?.interestRate,
          monthlyInstallment: this.loanCalculator,
          period: value?.period,
        },
      };
      this.calculateChanges.emit(createLoans);
      this.form.reset();
      this.loanCalculator = null;
      this.loanAmount = null;
    }
  }

  selectedBank(uuid: string): boolean {
    return this.bankApplications.some((x) => x.bankUuid === uuid);
  }

  get banks(): ICorporates.IBankScheme[] {
    return banksJson.bankLists;
  }

  get bank(): FormControl {
    return this.form.get('bank') as FormControl;
  }

  get interestRate(): FormControl {
    return this.form.get('interestRate') as FormControl;
  }

  get downPayment(): FormControl {
    return this.form.get('downPayment') as FormControl;
  }

  get period(): FormControl {
    return this.form.get('period') as FormControl;
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get years(): number[] {
    return range(1, 9, 1);
  }
}
