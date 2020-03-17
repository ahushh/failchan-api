interface IConfig {
  tokenSecret: string;
  server: {
    port: number;
  };
  file: {
    maxNumber: number;
    maxUploadSize: number;
    tmpDir: string;
  };
  attachment: {
    // Max width or height in pixels
    thumbnailSize: number;
    // Time in seconds a created attachment will be deleted in, 800 == 15 min
    ttl: number;
  };
  redis: {
    host: string;
    port: number;
  };
  // AWS. S3 console -> My Secuirity Credentials -> Users -> Create new access key
  s3: {
    // Access key
    key: string;
    // Secret access key
    secret: string;
    bucket: string;
    region: string;
  },
}

export default {
  tokenSecret: 'verysecret',
  server: {
    port: 3000,
  },
  file: {
    maxNumber: 5,
    // 10 MB
    maxUploadSize: 10485760,
    tmpDir: '/tmp',
  },
  attachment: {
    // Max width or height in pixels
    thumbnailSize: 200,
    // Time in seconds a created attachment will be deleted in, 800 == 15 min
    ttl: 800,
  },
  redis: {
    host: 'redis',
    port: 6379,
  },
  // AWS. S3 console -> My Secuirity Credentials -> Users -> Create new access key
  s3: {
    // Access key
    key: 'AKIAWZDMYYLVHW52IA57',
    // Secret access key
    secret: '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',
    bucket: 'failchan',
    region: 'eu-west-3',
  },
} as IConfig;
