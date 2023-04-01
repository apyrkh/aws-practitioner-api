import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'

const catalogBatchProcess: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn']
        },
      }
    }
  ]
}

export default catalogBatchProcess
