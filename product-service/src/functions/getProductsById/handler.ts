import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@app/libs/api-gateway'
import { middyfy } from '@app/libs/lambda'
import productService from '@app/store/productService'
import { logger, withRequest } from '@app/utils/logger'

const getProductsByIdHandler: ValidatedEventAPIGatewayProxyEvent<never> = async (event, context) => {
  withRequest(event, context)
  logger.info(event, 'event')

  const productId = event.pathParameters.productId
  try {
    const product = await productService.getProductById(productId)
    if (!product) {
      return formatJSONResponse(404, { message: 'Product not found' })
    }

    return formatJSONResponse(200, product)
  } catch (e) {
    logger.error(e)

    return formatJSONResponse(500, { message: 'Internal server error' })
  }
}

export const main = middyfy(getProductsByIdHandler)
