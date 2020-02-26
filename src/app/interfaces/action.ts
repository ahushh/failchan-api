
export interface IAction {
  execute: Function;
  /**
   * @description Description of execute payload for CLI
   * @type {string}
   * @memberof IAction
   */
  payloadExample?: string;
  /**
   * Description displayed on CLI
   *
   * @type {string}
   * @memberof IAction
   */
  description?: string;
}
