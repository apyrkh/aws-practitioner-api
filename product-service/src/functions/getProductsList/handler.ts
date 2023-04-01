import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@app/libs/api-gateway'
import { middyfy } from '@app/libs/lambda'
import productService from '@app/store/productService'

const getProductListHandler: ValidatedEventAPIGatewayProxyEvent<never> = async () => {
  try {
    const products = await productService.getProductList()

    return formatJSONResponse(200, products)
  } catch (e) {
    return formatJSONResponse(500, { message: 'Internal server error' })
  }
}

export const main = middyfy(getProductListHandler)
