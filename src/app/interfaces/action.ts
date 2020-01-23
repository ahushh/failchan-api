
export interface IAction {
  execute: Function;
  /**
   * @description Description of execute payload
   * @type {string}
   * @memberof IAction
   */
  request?: string;
}
