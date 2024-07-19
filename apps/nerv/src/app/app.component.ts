import { Component, OnInit } from '@angular/core';

// Service Worker
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'nrv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nerv';

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load the latest version?')) {
          window.location.reload();
        }
      });
    }
  }
}
