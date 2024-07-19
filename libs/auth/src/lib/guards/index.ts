import { AuthGuard } from './auth.guard';
import { CallingCodesExistsGuard } from './calling-codes-exists.guard';

export const guards: any[] = [AuthGuard, CallingCodesExistsGuard];

export * from './auth.guard';
export * from './calling-codes-exists.guard';
export * from './login.guard';
