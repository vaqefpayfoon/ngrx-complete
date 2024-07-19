export interface IDocument {
  uuid: string;
  name: string;
  codes: Code;
  states: State[];
  isActive: boolean;
}

export interface IGetCountry {
  uuid?: string;
  name?: string;
  codes: Codes;
  states: string[];
}

export interface ICreate {
  name: string;
  currencies: string[];
  states: string[];
}

export interface IUpdate {
  uuid?: string;
  name: string;
  currencies: string[];
  states: string[];
}

export interface State {
  uuid: string;
  name: string;
}

export interface Code {
  currencies: Currency[];
  calling: number;
}

export interface Currency {
  symbol: string;
  name: string;
  symbolNative: string;
  decimalDigits: number;
  code: string;
}

interface Codes {
  alpha2: string;
  alpha3: string;
  currency: string;
  calling: number;
}
