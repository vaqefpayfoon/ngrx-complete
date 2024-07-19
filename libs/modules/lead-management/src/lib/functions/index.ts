import { isMoment } from 'moment';

export const flattenObject = (ob: object) => {
  const toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && i !== 'createdAt') {
      const flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else if (i === 'createdAt') {
      continue;
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

/**
 *
 * @param loanAmountMinusDownPayment
 * @param periodInYear
 * @param interestRate
 * @returns {number}
 */
export const lastInstalmentCalc = (
  monthly: number,
  loanAmountMinusDownPayment: number,
  periodInYear: number,
  interestRate: number
): number => {
  const totalAmountWithInterest = parseFloat(
    (
      (interestRate / 100) * loanAmountMinusDownPayment * periodInYear +
      loanAmountMinusDownPayment
    ).toFixed(2)
  );
  const totalMonth = periodInYear * 12 - 1;
  const totalMinOneMonth = (monthly * 100 * totalMonth) / 100;
  const result = (totalAmountWithInterest * 100 - totalMinOneMonth * 100) / 100;
  if (result < 0) {
    return 0;
  }
  return result;
};

/**
 * Monthly calculator
 *
 * @param monthlyInterest
 * @param monthlyPeriod
 * @param totalPrice
 * @param downpayment
 * @returns {number}
 */
export const loanCalculator = ({
  monthlyInterest,
  yearlyPeriod,
  totalPrice,
  downpayment,
}: {
  monthlyInterest: number;
  yearlyPeriod: number;
  totalPrice: number;
  downpayment: number;
}): number => {
  const total = totalPrice - downpayment;
  const totalInterest = monthlyInterest * total * yearlyPeriod;
  const totalMonthly = (total + totalInterest) / (yearlyPeriod * 12);

  return parseFloat(totalMonthly.toFixed(2));
};

export const range = function (start: any, end: any, step: any) {
  const range = [];
  const typeofStart = typeof start;
  const typeofEnd = typeof end;

  if (step === 0) {
    throw TypeError('Step cannot be zero.');
  }

  if (typeofStart == 'undefined' || typeofEnd == 'undefined') {
    throw TypeError('Must pass start and end arguments.');
  } else if (typeofStart != typeofEnd) {
    throw TypeError('Start and end arguments must be of same type.');
  }

  typeof step == 'undefined' && (step = 1);

  if (end < start) {
    step = -step;
  }

  if (typeofStart == 'number') {
    while (step > 0 ? end >= start : end <= start) {
      range.push(start);
      start += step;
    }
  } else if (typeofStart == 'string') {
    if (start.length != 1 || end.length != 1) {
      throw TypeError('Only strings with one character are supported.');
    }

    start = start.charCodeAt(0);
    end = end.charCodeAt(0);

    while (step > 0 ? end >= start : end <= start) {
      range.push(String.fromCharCode(start));
      start += step;
    }
  } else {
    throw TypeError('Only string and number types are supported');
  }

  return range;
};

export function traverseAndRemove(obj) {
  if (!isMoment(obj)) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') {
        traverseAndRemove(obj[key]);
      }
      //recursive for objects
      else if (obj[key] == null || obj[key] === '') delete obj[key]; //remove empty properties
      if (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) {
        delete obj[key]; //remove empty objects
      }
    });
  }
}
