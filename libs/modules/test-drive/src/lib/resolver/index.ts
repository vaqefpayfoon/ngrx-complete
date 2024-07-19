import { TestDrivesResolver } from './test-drives.resolver';
import { TestDriveExistsResolver } from './test-drive-exists.resolver';
import { TestDriveBranchResolver } from './test-drives-branch.resolver';

export const resolvers: any[] = [TestDrivesResolver, TestDriveExistsResolver, TestDriveBranchResolver];

export * from './test-drives.resolver';
export * from './test-drive-exists.resolver';
export * from './test-drives-branch.resolver';
