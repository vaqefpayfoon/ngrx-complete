import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'neural-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  constructor() {}

  @Input() error: { status: number; message: string } | null;
}
