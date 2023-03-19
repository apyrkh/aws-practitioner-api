import type { SQSHandler } from 'aws-lambda'
import productService from '@app/store/productService'
import { logger, withRequest } from '@app/utils/logger'

const catalogBatchProcessHandler: SQSHandler = async (event, context) => {
  withRequest(event, context)
  logger.info(event, 'event')

  for (const record of event.Records) {
    try {
      const { title, description, price, count } = JSON.parse(record.body)
      if (!title || !description || (!price && price !== 0) || (!count && count !== 0)) {
        logger.error('Failed: product creation', { title, description, price, count })
        continue
      }
      const createdProduct = await productService.createProduct({ title, description, price, count })

      logger.info('Succeeded: product creation', createdProduct)
    } catch (e) {
      logger.error(e)
    }
  }
}

export const main = catalogBatchProcessHandler
