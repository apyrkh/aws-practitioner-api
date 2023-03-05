import type { AWS } from '@serverless/typescript'
import createProduct from '@app/functions/createProduct'
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
    iamRoleStatements: [
      { Effect: 'Allow', Action: ['dynamodb:*'], Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*' },
    ]
  },
  functions: {
    createProduct,
    getProductsById,
    getProductsList,
  },
  resources: {
    Resources: {
      productsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Products',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          }
        }
      },
      stocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Stocks',
          AttributeDefinitions: [
            { AttributeName: 'product_id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'product_id', KeyType: 'HASH' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          }
        }
      },
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      title: 'AWS practitioner api: product service',
      apiType: 'http',
      basePath: '/${sls:stage}',
      typefiles: [
        './src/types/api-types.d.ts',
        './src/types/IProduct.ts',
        './src/types/IAvailableProduct.ts',
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
