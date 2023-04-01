import { S3, SQS } from 'aws-sdk'
import csv from 'csv-parser'
import { BUCKET_NAME, PARSED_FOLDER_NAME, PROCESS_PRODUCT_SQS_URL, UPLOAD_FOLDER_NAME } from '@app/constants'
import { logger } from '@app/utils/logger'

class ProductsImportService {
  s3 = new S3()
  sqs = new SQS()

  getSignedUploadUrl = async (name: string) => {
    const filePath = `${UPLOAD_FOLDER_NAME}/${name}`

    return await this.s3.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_NAME,
      Key: filePath,
      ContentType: 'text/csv',
      Expires: 60,
    })
  }

  processUploadedFile = (filePath: string) => {
    const parsedFilePath = filePath.replace(UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME)

    return new Promise((resolve, reject) => {
      const s3Stream = this.s3.getObject({
        Bucket: BUCKET_NAME,
        Key: filePath
      }).createReadStream()

      const headers = ['id', 'title', 'description', 'price', 'count']
      s3Stream.pipe(csv({ separator: ';', headers: headers, skipLines: 1, }))
        .on('data', async (data) => {
          const { title, description, price, count } = data
          if (!title || !description || (!price && price !== 0) || (!count && count !== 0)) {
            logger.error(`Failed to process item - item is invalid: ${JSON.stringify(data)}`)
            return
          }

          try {
            await this.sqs.sendMessage({
              QueueUrl: PROCESS_PRODUCT_SQS_URL,
              MessageBody: JSON.stringify(data)
            }).promise()

            logger.info(`Processed item: ${JSON.stringify(data)}`);
          } catch (e) {
            logger.error('Failed to process item: failed to send sqs');
            logger.error(e)
          }
        })
        .on('end', async () => {
          logger.info(`Move from ${BUCKET_NAME}/${filePath}`)

          try {
            await this.s3.copyObject({
              Bucket: BUCKET_NAME,
              CopySource: `${BUCKET_NAME}/${filePath}`,
              Key: parsedFilePath
            }).promise()

            await this.s3.deleteObject({
              Bucket: BUCKET_NAME,
              Key: filePath,
            }).promise()

            logger.info(`Moved into ${BUCKET_NAME}/${parsedFilePath}`)
            resolve(null)
          } catch (e) {
            logger.error(e)
            reject(e)
          }
        })
    })
  }
}

export default new ProductsImportService()
