import { Component, OnInit } from '@angular/core';

import { LoaderService } from '../../services';
import { Subject } from 'rxjs';

@Component({
  selector: 'neural-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  color = 'primary';
  mode = 'indeterminate';
  value = 10;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  
  constructor(private loaderService: LoaderService) {}

}
