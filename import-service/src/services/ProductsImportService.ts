import { S3 } from 'aws-sdk'
import csv from 'csv-parser'
import { BUCKET_NAME, PARSED_FOLDER_NAME, UPLOAD_FOLDER_NAME } from '@app/constants'
import { logger } from '@app/utils/logger'

class ProductsImportService {
  s3 = new S3()

  getSignedUploadUrl = async (name: string) => {
    const filePath = `${UPLOAD_FOLDER_NAME}/${name}`

    return await this.s3.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_NAME,
      Key: filePath,
      ContentType: 'text/csv',
      Expires: 60,
    })
  }

  parseUploadedFile = (filePath: string) => {
    const parsedFilePath = filePath.replace(UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME)

    return new Promise((resolve, reject) => {
      const s3Stream = this.s3.getObject({
        Bucket: BUCKET_NAME,
        Key: filePath
      }).createReadStream()

      s3Stream.pipe(csv())
        .on('data', (data) => {
          logger.info(data)
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
