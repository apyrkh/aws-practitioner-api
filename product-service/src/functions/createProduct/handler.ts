import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@app/libs/api-gateway'
import productService from '@app/store/productService'
import { createProductRequestSchema } from '@app/functions/createProduct/сreateProductRequestSchema'
import { middyfy } from '@app/libs/lambda'
import { logger, withRequest } from '@app/utils/logger'

type HandlerType = ValidatedEventAPIGatewayProxyEvent<typeof createProductRequestSchema>

const createProductHandler: HandlerType = async (event, context) => {
  withRequest(event, context)
  logger.info(event, 'event')

  const { title, description, price, count } = event.body
  if (!title || !description || (!price && price !== 0) || (!count && count !== 0)) {
    return formatJSONResponse(400, { message: 'Bad Request' })
  }

  try {
    const createdProduct = await productService.createProduct({ title, description, price, count })

    return formatJSONResponse(201, createdProduct)
  } catch (e) {
    logger.error(e)

    return formatJSONResponse(500, { message: 'Internal server error' })
  }
}

export const main = middyfy(createProductHandler)
