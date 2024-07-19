import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

// Models
import { IReservations, IBranchTeams } from '../../models';

// Auth
import { Auth } from '@neural/auth';

// traverseAndRemove
import { traverseAndRemove } from '@neural/shared/data';

@Component({
  selector: 'neural-completed-assign-operation-team-form',
  templateUrl: './completed-assign-operation-team-form.component.html',
  styleUrls: ['./completed-assign-operation-team-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedAssignOperationTeamFormComponent implements OnChanges {
  @Input() reservation: IReservations.IDocument;

  @Input() selectedBranch: Auth.IBranch;

  @Input() team: IBranchTeams.IDocument;

  @Input() error: any;

  @Input() loading: boolean;

  @Output() loaded = new EventEmitter<IReservations.IDocument>();

  exists: boolean;

  @Output()
  assignTeam = new EventEmitter<{
    reservation: IReservations.IDocument;
    assign: IReservations.IAssign;
  }>();

  @Output() branchChange = new EventEmitter();

  form = this.fb.group({
    operationUuid: ['', Validators.compose([Validators.required])],
    fleetUuid: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (
      changes.reservation &&
      changes.reservation.currentValue &&
      !!this.reservation
    ) {
      this.loaded.emit(this.reservation);

      if (!!this.reservation?.operation) {
        this.operationUuid.patchValue(this.reservation.operation.uuid);
        this.exists = true;
        this.form.disable();
      }

      if (this.reservation?.mobileService) {
        this.fleetUuid.setValidators(Validators.compose([Validators.required]));
        this.fleetUuid.patchValue(
          this.reservation?.fleet?.uuid ? this.reservation?.fleet?.uuid : ''
        );
        this.fleetUuid.updateValueAndValidity();
      }
    }
  }

  get operationUuid() {
    return this.form.get('operationUuid') as FormControl;
  }

  get fleetUuid() {
    return this.form.get('fleetUuid') as FormControl;
  }

  get formDisabled() {
    return this.form.disabled;
  }

  onCreate(form: FormGroup) {
    const { value, valid } = form;
    if (valid) {
      const reservation = {
        ...this.reservation,
        operation: this.mergedOpt,
      };
      const assign = value;

      traverseAndRemove(assign);

      this.assignTeam.emit({ reservation, assign });
      form.disable();
      this.exists = true;
    }
  }

  get mergedOpt() {
    const fullName = this.team?.operation.find(
      (x) => x.uuid === this.operationUuid?.value
    )?.fullname;

    const operation: IReservations.IOperation = {
      ...this.reservation?.operation,
      uuid: this.operationUuid.value,
      identity: {
        fullName,
      },
    };

    return operation;
  }

  operationCompareFn(
    op1: IReservations.IOperationTeam,
    op2: IReservations.IOperationTeam
  ) {
    return op1 && op2 ? op1.uuid === op2.uuid : op1 === op2;
  }

  fleetCompareFn(
    fleet1: IReservations.IFleetTeam,
    fleet2: IReservations.IFleetTeam
  ) {
    return fleet1 && fleet2 ? fleet1.uuid === fleet2.uuid : fleet1 === fleet2;
  }

  cancel() {
    this.loaded.emit(this.reservation);

    if (!!this.reservation.operation) {
      this.operationUuid.patchValue(this.reservation.operation.uuid);

      this.exists = true;
      this.form.disable();
    }

    if (this.reservation.mobileService) {
      this.fleetUuid.setValidators(Validators.compose([Validators.required]));
      this.fleetUuid.updateValueAndValidity();
    }
  }
}
