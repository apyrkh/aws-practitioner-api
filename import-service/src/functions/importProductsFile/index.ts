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
        authorizer: {
          name: 'basicAuthorizer',
          arn: {
            'Fn::ImportValue': 'authorization-service-${self:provider.stage}-BasicAuthorizerFunctionArn'
          },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
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
