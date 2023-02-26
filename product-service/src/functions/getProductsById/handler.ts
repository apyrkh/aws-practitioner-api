import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@app/libs/api-gateway'
import { middyfy } from '@app/libs/lambda'
import productService from '@app/store/productService'

const getProductsByIdHandler: ValidatedEventAPIGatewayProxyEvent<never> = async (event) => {
  const productId = event.pathParameters.productId
  try {
    const product = await productService.getProductById(productId)
    if (!product) {
      return formatJSONResponse(404, { message: 'Product not found' })
    }

    return formatJSONResponse(200, product)
  } catch (e) {
    return formatJSONResponse(500, { message: 'Internal server error' })
  }
}

export const main = middyfy(getProductsByIdHandler)
