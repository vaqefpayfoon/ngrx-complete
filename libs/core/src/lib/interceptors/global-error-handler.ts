import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { LoggingService } from '../services';
import { ErrorService } from '../services';
import { NotificationService } from '../services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationService);

    let message: string | any;
    // let stackTrace;
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = errorService.getServerErrorMessage(error);
      // stackTrace = errorService.getServerErrorStackTrace(error);
      notifier.showError(message);
    } else {
      // Client Error
      message = errorService.getClientErrorMessage(error);
      notifier.showError(message);
    }

    logger.log(message);
    console.error(error);
  }
}
