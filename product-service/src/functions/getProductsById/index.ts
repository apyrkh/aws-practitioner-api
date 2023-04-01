import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'

const getProductsByIdLambda: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'GET',
        path: 'products/{productId}',
        cors: {
          methods: ['GET']
        },
        request: {
          parameters: {
            paths: {
              productId: true
            }
          }
        },
        // @ts-expect-error: untyped swagger config
        responseData: {
          200: {
            bodyType: 'GetProductsByIdResponse',
          },
          404: {
            bodyType: 'GetProductsByIdResponse404'
          },
          500: {
            bodyType: 'InternalServerErrorResponse'
          },
        }
      },
    },
  ],
}
export default getProductsByIdLambda
