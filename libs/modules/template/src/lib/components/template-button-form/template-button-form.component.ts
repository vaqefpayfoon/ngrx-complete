import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

import { ITemplates } from '../../models';

@Component({
  selector: 'neural-template-button-form',
  templateUrl: './template-button-form.component.html',
  styleUrls: ['./template-button-form.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateButtonFormComponent {
  constructor() {}

  @Input() backGroundColor = '#4265ed';

  @Input() color = '#FFFFFF';

  @Output() added = new EventEmitter();

  @ViewChild('input', { static: true }) public inputEl: ElementRef;

  get tag() {
    return ITemplates.CampaignTags;
  }

  add() {
    if (!!this.inputEl.nativeElement.value) {
      const button = `<a href="${
        ITemplates.CampaignTags.general[0].value
      }" style="background-color: ${this.backGroundColor}; color:  ${
        this.color
      }; display: inline-block; min-width: 160px; min-height: 40px; border-radius: 4px; border: 0px; padding: 10px; text-align: center;">${
        this.inputEl.nativeElement.value
      }</a>`;

      this.added.emit(button);
    }
  }
}
