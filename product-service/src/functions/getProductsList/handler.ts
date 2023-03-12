import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@app/libs/api-gateway'
import { middyfy } from '@app/libs/lambda'
import productService from '@app/store/productService'
import { logger, withRequest } from '@app/utils/logger'

const getProductListHandler: ValidatedEventAPIGatewayProxyEvent<never> = async (event, context) => {
  withRequest(event, context)
  logger.info(event, 'event')

  try {
    const products = await productService.getProductList()

    return formatJSONResponse(200, products)
  } catch (e) {
    logger.error(e)

    return formatJSONResponse(500, { message: 'Internal server error' })
  }
}

export const main = middyfy(getProductListHandler)
