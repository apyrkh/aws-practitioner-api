import type { AWS } from '@serverless/typescript'
import getProductsById from '@app/functions/getProductsById'
import getProductsList from '@app/functions/getProductsList'

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    profile: 'apyrkh_aws_practitioner',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    getProductsById,
    getProductsList,
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'AWS practitioner api: product service',
      apiType: 'http',
      basePath: '/dev',
      typefiles: [
        './src/types/api-types.d.ts',
        './src/types/IProduct.ts',
      ]
    },
    esbuild: {
      bundle: true,
      minify: false,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
