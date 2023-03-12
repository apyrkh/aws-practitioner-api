import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'

const importProductsFileLambda: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'GET',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        // @ts-expect-error: untyped swagger config
        responseData: {
          200: {
            bodyType: 'GetImportProductsFile',
          },
          400: {
            bodyType: 'BadRequestResponse'
          },
          500: {
            bodyType: 'InternalServerErrorResponse'
          },
        }
      },
    },
  ],
}
export default importProductsFileLambda
