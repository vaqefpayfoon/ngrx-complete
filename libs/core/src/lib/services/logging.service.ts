import { Injectable, Inject } from '@angular/core';
// import { Environment,ENVIRONMENT } from '@neural/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  // constructor(@Inject(ENVIRONMENT) private readonly env: Environment) {}
  constructor() {}

  log(message: string) {
    console.log(`Logging Service ➔ ${message}`);
    // if (!this.env.production) {
    // }
  }
}
