import { createProductRequestSchema } from './сreateProductRequestSchema'
import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'

const createProductLambda: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'POST',
        path: 'products',
        cors: true,
        request: {
          schemas: {
            'application/json': createProductRequestSchema,
          },
        },
        // @ts-expect-error: untyped swagger config
        bodyType: 'CreateProductRequest',
        responseData: {
          201: {
            bodyType: 'CreateProductResponse',
          },
          400: {
            bodyType: 'BadRequestResponse',
          },
          500: {
            bodyType: 'InternalServerErrorResponse'
          },
        },
      },
    },
  ],
}
export default createProductLambda
