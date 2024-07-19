import { Component, Input } from '@angular/core';

@Component({
  selector: 'neural-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input() version: string;
  
  constructor() {}
}
