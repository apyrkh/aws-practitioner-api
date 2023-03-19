import type { S3Handler } from 'aws-lambda'
import productsImportService from '@app/services/ProductsImportService'
import { logger, withRequest } from '@app/utils/logger'

const importFileParserHandler: S3Handler = async (event, context) => {
  withRequest(event, context)
  logger.info(event, 'event')

  for (let record of event.Records) {
    await productsImportService.processUploadedFile(record.s3.object.key)
  }
}

export const main = importFileParserHandler
