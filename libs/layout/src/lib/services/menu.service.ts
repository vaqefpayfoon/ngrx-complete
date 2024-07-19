import { permissionTags } from '@neural/shared/data';

export class MenuService {
  getMenuItems() {
    return [
      // {
      //   category: 'Home',
      //   icon: 'dashboard',
      //   items: [
      //     {
      //       name: 'Basic',
      //       path: '/app/home/basic',
      //       permission: permissionTags.Analytic.BASIC_DASHBOARD,
      //     },
      //   ],
      // },
      {
        category: 'Administration',
        icon: 'administration_off',
        items: [
          {
            name: 'Accounts',
            items: [
              {
                name: 'Administrators',
                path: 'administration/account',
                permission: permissionTags.Account.LIST_ADMIN_ACCOUNT,
              },
              {
                name: 'Operations',
                path: 'administration/operation',
                permission: permissionTags.Account.LIST_OPERATION_ACCOUNT,
              },
            ],
          },
          {
            name: 'Corporates',
            path: 'customer/corporates',
            permission: permissionTags.Corporate.LIST_CORPORATE,
          },
          {
            name: 'Branches',
            path: 'customer/corporates/branches',
            permission: permissionTags.Branch.LIST_BRANCH,
          },
          {
            name: 'Car Models',
            path: 'models',
            permission: permissionTags.Model.LIST_MODEL,
          },
          {
            name: 'Support Center',
            items: [
              {
                name: 'Enquiries',
                items: [
                  {
                    name: 'General Enquiries',
                    path: 'support-center/enquiries/general',
                    permission: permissionTags.Enquiry.LIST_ENQUIRY,
                  },
                  {
                    name: 'Insurance Enquiries',
                    path: 'support-center/enquiries/insurances',
                    permission:
                      permissionTags.InsuranceEnquiry.LIST_INSURANCE_ENQUIRIES,
                  },
                ],
              },
            ],
          },
          {
            name: 'Marketing',
            items: [
              {
                name: 'Campaigns',
                path: 'marketing/campaigns',
                permission: permissionTags.Campaign.LIST_CAMPAIGNS,
              },
              {
                name: 'Inbox Messages',
                path: 'marketing/inbox-messages',
                permission: permissionTags.Inbox.LIST_INBOX_MESSAGE,
              },
            ],
          },
          {
            name: 'Rewards',
            items: [
              {
                name: 'Voucher',
                path: 'rewards/voucher',
                permission: permissionTags.Promo.LIST_PROMO,
              },
            ],
          },
          {
                name: 'Vehicle Inventory',
                path: 'pre-owned/inventory',
                permission: permissionTags.Analytic.UPLOAD_PRE_OWNED_INVENTORY,
          },
          {
            name: 'Businesses',
            path: 'customer/businesses',
            permission: permissionTags.Business.LIST_BUSINESS,
          },
          {
            name: 'Countries',
            path: 'administration/countries',
            permission: permissionTags.Country.LIST_ALL_COUNTRIES,
            divider: true,
          },
          {
            name: 'Configuration',
            items: [
              {
                name: 'Accounts Roles',
                path: 'administration/roles',
                permission: permissionTags.AccountRole.LIST_ACCOUNT_ROLE,
              },
              {
                name: 'Accounts Groups',
                path: 'administration/groups',
                permission: permissionTags.AccountGroup.LIST_ACCOUNT_GROUP,
              },
              {
                name: 'Vehicle References',
                path: 'customer/vehicles/references',
                permission: permissionTags.Vehicle.LIST_VEHICLE_REFERENCE,
              },
              {
                name: 'Marketplaces',
                path: 'marketplaces/references',
                permission: permissionTags.Product.LIST_PRODUCT_REFERENCE,
              },
              {
                name: 'Templates',
                items: [
                  {
                    name: 'Email',
                    path: 'configuration/templates/email',
                    permission: permissionTags.Template.LIST_TEMPLATE,
                  },
                  {
                    name: 'Inbox',
                    path: 'configuration/templates/inbox',
                    permission: permissionTags.Template.LIST_TEMPLATE,
                  },
                  {
                    name: 'Campaign',
                    path: 'configuration/templates/campaign',
                    permission: permissionTags.Template.LIST_TEMPLATE,
                    divider: true,
                  },
                  {
                    name: 'Master',
                    path: 'configuration/templates/master',
                    permission: permissionTags.Template.CREATE_MASTER_TEMPLATE,
                  },
                ],
                divider: true,
              },
              {
                name: 'Synchronization',
                path: 'administration/synchronization',
                permission: permissionTags.Account.ACCOUNT_EXCEL_IMPORT,
              },
            ],
          },
        ],
      },
      {
        category: 'Customer',
        icon: 'Costumer_off',
        items: [
          {
            name: 'Accounts',
            path: 'administration/customer',
            permission: permissionTags.Account.LIST_CUSTOMER_ACCOUNT,
          },
          {
            name: 'Vehicles',
            path: 'customer/vehicles',
            permission: permissionTags.Vehicle.LIST_VEHICLE,
          },
        ],
      },
      {
        category: 'Hub',
        icon: 'location_off',
        items: [
          {
            name: 'Services',
            path: 'hub/services/list',
            permission: permissionTags.Service.LIST_SERVICE,
          },
          {
            name: 'Inventory',
            path: 'marketplaces/inventory',
            permission: permissionTags.Product.LIST_PRODUCT_COVERAGE,
            divider: true,
          },
          {
            name: 'Fleets',
            path: 'hub/fleets',
            permission: permissionTags.Fleet.LIST_FLEET,
            divider: true,
          },
          {
            name: 'Sales',
            items: [
              {
                name: 'Purchases',
                path: 'hub/sales/purchases',
                permission: permissionTags.Sale.LIST_SALES,
              },
              {
                name: 'Purchases Quote',
                path: 'hub/sales/purchase-quotes',
                permission: permissionTags.Sale.LIST_PURCHASE_QUOTES,
              },
            ],
          },
          {
            name: 'Lead Management',
            path: 'hub/lead/leadList',
            permission: permissionTags.Lead.LIST_LEADS,
            divider: true,
          },
          {
            name: 'Test Drives',
            path: 'hub/test-drives',
            permission: permissionTags.TestDrive.LIST_TEST_DRIVE,
            divider: true,
          },
          {
            name: 'Reminders',
            path: 'hub/reservations/reminders',
            permission: permissionTags.ServiceRecall.LIST_SERVICE_RECALL,
            divider: true,
          },
          {
            name: 'Calendar',
            path: 'hub/calendar',
            permission: permissionTags.Calendar.LIST_CALENDAR,
            divider: true,
          },
          {
            name: 'Mobile',
            items: [
              {
                name: 'Scheduled',
                path: 'hub/reservations/mobile/scheduled',
                permission: permissionTags.Reservation.LIST_RESERVATION,
              },
              {
                name: 'Declined',
                path: 'hub/reservations/mobile/declined',
                permission: permissionTags.Reservation.LIST_RESERVATION,
              },
            ],
          },
          {
            name: 'Service Center',
            items: [
              {
                name: 'Scheduled',
                path: 'hub/reservations/service-center/scheduled',
                permission: permissionTags.Reservation.LIST_RESERVATION,
              },
              {
                name: 'Declined',
                path: 'hub/reservations/service-center/declined',
                permission: permissionTags.Reservation.LIST_RESERVATION,
              },
            ],
          },
          {
            name: 'Service Menu',
            items: [
              {
                name: 'Service',
                path: 'hub/service-menu/service-line/list',
                permission: permissionTags.ServiceLine.LIST_SERVICE_LINES,
              },
              {
                name: 'Package',
                path: 'hub/service-menu/service-package/list',
                permission: permissionTags.ServiceLinePackage.LIST_SERVICE_LINE_PACKAGES,
              },
            ],
          },
          {
            name: 'Next Service',
            path: 'hub/nextService',
            permission: permissionTags.Reservation.LIST_NEXT_SERVICE_RESERVATION,
            divider: true,
          },
          {
            name: 'In Progress',
            path: 'hub/reservations/in-progress',
            permission: permissionTags.Reservation.GET_INPROGRESS,
          },
        ],
      },
    ];
  }
}
