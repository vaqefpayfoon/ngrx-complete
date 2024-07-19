import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Model
import { IInboxMessages } from '../../models';

// Account tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-inbox-message-card',
  templateUrl: './inbox-message-card.component.html',
  styleUrls: ['./inbox-message-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxMessageCardComponent {
  @Input() inboxMessage: IInboxMessages.IDocument;

  @Input() permissions: any;

  constructor() {}
}
