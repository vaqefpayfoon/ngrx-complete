import { ButtonTypes } from './ui-component.interface';

export class Buttons {
  /**
   * @description
   * @private
   * @type {string}
   * @memberof Buttons
   */
  private _previewIcon: string;

  /**
   * @description
   * @private
   * @type {string}
   * @memberof Buttons
   */
  private _deleteIcon: string;

  /**
   * @description
   * @private
   * @type {string}
   * @memberof Buttons
   */
  private _resyncIcon: string;

  /**
   * @description
   * @type {string}
   * @memberof Buttons
   */
  public get previewIcon(): string {
    return this._previewIcon;
  }
  /**
   * @description
   * @memberof Buttons
   */
  public set previewIcon(value: string) {
    this._previewIcon = value;
  }

  /**
   * @description
   * @type {string}
   * @memberof Buttons
   */
  public get deleteIcon(): string {
    return this._deleteIcon;
  }

  /**
   * @description
   * @memberof Buttons
   */
  public set deleteIcon(value: string) {
    this._deleteIcon = value;
  }

  /**
   * @description
   * @type {string}
   * @memberof Buttons
   */
  public get resyncIcon(): string {
    return this._resyncIcon;
  }

  /**
   * @description
   * @memberof Buttons
   */
  public set resyncIcon(value: string) {
    this._resyncIcon = value;
  }

  private _firebaseResyncIcon: string;

    /**
   * @description
   * @type {string}
   * @memberof Buttons
   */
     public get firebaseResyncIcon(): string {
      return this._firebaseResyncIcon;
    }
  
    /**
     * @description
     * @memberof Buttons
     */
    public set firebaseResyncIcon(value: string) {
      this._firebaseResyncIcon = value;
    }

  constructor(
    preview?: string,
    deleteActionIcon?: string,
    firebaseResyncActionIcon?: string,
    resyncActionIcon?: string
  ) {
    this.previewIcon = preview ? preview : ButtonTypes.PREVIEWOFF;
    this.deleteIcon = deleteActionIcon
      ? deleteActionIcon
      : ButtonTypes.DELETEOFF;
    this.resyncIcon = resyncActionIcon
      ? resyncActionIcon
      : ButtonTypes.RESYNCOFF;
      this.firebaseResyncIcon = firebaseResyncActionIcon
      ? firebaseResyncActionIcon
      : ButtonTypes.FIRBASERESYNCOFF;
  }
}
