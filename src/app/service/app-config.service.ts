import { inject, injectable } from 'inversify';

interface IAppConfig {
}

@injectable()
export class AppConfigService {
  private config: IAppConfig;

  constructor(config: IAppConfig) {
    const hasEmptyFields = Object.keys(config).filter(k => config[k] === undefined).length !== 0;
    if (hasEmptyFields) {
      throw new Error('Error in app config. Check your env file and make sure all fields are filled in');
    }
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: Partial<IAppConfig>) {
    this.config = { ...this.config, ...config };
  }
}
