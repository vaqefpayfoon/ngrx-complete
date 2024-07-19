abstract class BaseSaleCard {
  abstract get previewPermission(): boolean;
}

abstract class PurchaseCard extends BaseSaleCard {
  abstract get complete(): boolean;
  abstract get cancel(): boolean;
  abstract get inProcess(): boolean;
  abstract get cancelPermission(): boolean;
  abstract get completePermission(): boolean;
}

export interface IPurchaseCard extends PurchaseCard {}

export interface IPurchaseQouteCard extends BaseSaleCard {}
