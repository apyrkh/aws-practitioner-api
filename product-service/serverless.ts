import type { AWS } from '@serverless/typescript'
import catalogBatchProcess from '@app/functions/catalogBatchProcess'
import createProduct from '@app/functions/createProduct'
import getProductsById from '@app/functions/getProductsById'
import getProductsList from '@app/functions/getProductsList'

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
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
      CREATE_PRODUCT_SNS_TOPIC_ARN: { Ref: 'CreateProductTopic' },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*'
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] }
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: 'CreateProductTopic' }
      },
    ]
  },
  functions: {
    catalogBatchProcess,
    createProduct,
    getProductsById,
    getProductsList,
  },
  resources: {
    Outputs: {
      CatalogItemsQueueArn: {
        Value: { 'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'] },
        Description: 'SQS will be used by other stacks',
        Export: {
          Name: '${self:service}-${self:provider.stage}-CatalogItemsQueueArn'
        }
      },
      CatalogItemsQueueUrl: {
        Value: { Ref: 'CatalogItemsQueue' },
        Description: 'SQS will be used by other stacks',
        Export: {
          Name: '${self:service}-${self:provider.stage}-CatalogItemsQueueUrl'
        }
      }
    },
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
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue'
        },
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic'
        }
      },
      CreateProductTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.CREATE_PRODUCT_SUBSCRIPTION_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'CreateProductTopic' }
          // TopicArn: { 'Fn::GetAtt': ['CreateProductTopic', 'Arn'] }
        }
      },
      CreateProductHighPriceTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.CREATE_PRODUCT_HIGH_PRICE_SUBSCRIPTION_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'CreateProductTopic' },
          FilterPolicy: {
            price: [{ numeric: ['>=', 1000] }]
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
      generateSwaggerOnDeploy: true,
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
