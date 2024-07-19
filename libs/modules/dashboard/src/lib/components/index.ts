import { BasicDashboardComponent } from './basic-dashboard/basic-dashboard.component';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart.component';
import {PasswordExpiredDialogComponent} from './password-expired-dialog/password-expired-dialog.component'

export const COMPONENTS: any[] = [
  BasicDashboardComponent,
  DashboardChartComponent,
  PasswordExpiredDialogComponent
];

export * from './basic-dashboard/basic-dashboard.component';
export * from './dashboard-chart/dashboard-chart.component';
export * from './password-expired-dialog/password-expired-dialog.component'
