import { inject, injectable } from 'inversify';

interface IConfig {
  ENV: 'production' | 'development' | 'test';
  AWS_S3_KEY: string;
  AWS_S3_SECRET: string;
  AWS_S3_BUCKET: string;
  AWS_S3_REGION: string;
  THUMBNAIL_SIZE: number;
  ATTACHMENT_TTL: number;
}

@injectable()
export class AppConfigService {
  private config: IConfig;

  constructor(config: IConfig) {
    const hasEmptyFields = Object.keys(config).filter(k => config[k] === undefined).length !== 0;
    if (hasEmptyFields) {
      throw new Error('Error in app config. Check your env file and make sure all fields are filled in');
    }
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  setConfig(config: Partial<IConfig>) {
    this.config = { ...this.config, ...config };
  }
}
