import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'

const getProductsListLambda: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'GET',
        path: 'products',
        cors: {
          methods: ['GET']
        },
        // @ts-expect-error: untyped swagger config
        responseData: {
          200: {
            bodyType: 'GetProductsListResponse',
          },
          500: {
            bodyType: 'InternalServerErrorResponse'
          },
        },
      },
    },
  ],
}
export default getProductsListLambda
