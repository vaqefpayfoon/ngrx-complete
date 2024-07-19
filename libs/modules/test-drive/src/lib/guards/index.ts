import { TestDrivesGuard } from './test-drives.guard';
import { TestDriveExistsGuard } from './test-drive-exists.guard';

export const guards: any[] = [TestDrivesGuard, TestDriveExistsGuard];

export * from './test-drives.guard';
export * from './test-drive-exists.guard';
