import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'

const getProductsByIdLambda: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'GET',
        path: 'products/{productId}',
        cors: true,
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
            bodyType: 'NotFoundResponse'
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
