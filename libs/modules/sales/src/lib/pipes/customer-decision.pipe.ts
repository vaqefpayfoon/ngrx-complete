import { Pipe, PipeTransform } from '@angular/core';

import { IBankLoan } from '../models';

@Pipe({
  name: 'customerDecision',
})
export class CustomerDecisionPipe implements PipeTransform {
  transform(loans: IBankLoan.IDocument[], item: IBankLoan.IDocument): IBankLoan.IDocument {
    const find = loans.find(
      (loan) =>
        loan.status === IBankLoan.BankLoanStatus.APPROVED &&
        loan.customerDecision ===
          IBankLoan.BankLoanDocumentsCustomerDecision.ACCEPTED
    );

    return find ? find : item;
  }
}
