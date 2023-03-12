import type { AWS } from '@serverless/typescript'
import { BUCKET_NAME } from '@app/constants'
import importProductsFile from '@app/functions/importProductsFile'

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: '${opt:stage, "dev"}',
    profile: 'apyrkh_aws_practitioner',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET_NAME}`
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
      },
    ]
  },
  functions: {
    importProductsFile,
  },
  resources: {
    Resources: {
      S3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: BUCKET_NAME,
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT'],
                AllowedOrigins: ['*'],
              },
            ]
          }
        },
      },
      // It is not needed for signed URLS
      // S3BucketPolicy: {
      //   Type: 'AWS::S3::BucketPolicy',
      //   Properties: {
      //     Bucket: BUCKET_NAME,
      //     PolicyDocument: {
      //       Statement: [
      //         {
      //           Effect: 'Allow',
      //           Principal: '*',
      //           Action: ['*'],
      //           // Action: ['s3:GetObject', 's3:PutObject'],
      //           Resource: [
      //             `arn:aws:s3:::${BUCKET_NAME}`,
      //             `arn:aws:s3:::${BUCKET_NAME}/*`,
      //           ]
      //         }
      //       ]
      //     },
      //   }
      // }
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'AWS practitioner api: import service',
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      basePath: '/${sls:stage}',
      typefiles: [
        './src/types/api-types.d.ts',
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
}

module.exports = serverlessConfiguration
