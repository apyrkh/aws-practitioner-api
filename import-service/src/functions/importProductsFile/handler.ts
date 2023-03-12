import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@app/libs/api-gateway'
import { middyfy } from '@app/libs/lambda'
import { logger, withRequest } from '@app/utils/logger'
import productsImportService from '@app/services/ProductsImportService'

const createImportProductsFileHandler: ValidatedEventAPIGatewayProxyEvent<never> = async (event, context) => {
  withRequest(event, context)
  logger.info(event, 'event')

  const name = event.queryStringParameters?.name
  if (!name) {
    return formatJSONResponse(400, { message: 'Missing required request parameters: [name]' })
  }

  try {
    const signedUrl = await productsImportService.getSignedUploadUrl(name)

    return formatJSONResponse(200, signedUrl)
  } catch (e) {
    logger.error(e)

    return formatJSONResponse(500, { message: 'Internal server error' })
  }
}

export const main = middyfy(createImportProductsFileHandler)
