import { S3 } from 'aws-sdk'
import { BUCKET_NAME, UPLOAD_FOLDER_NAME } from '@app/constants'

class ProductsImportService {
  s3 = new S3()

  getSignedUploadUrl = async (name: string) => {
    const filePath = `${UPLOAD_FOLDER_NAME}/${name}`

    return  await this.s3.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_NAME,
      Key: filePath,
      ContentType: 'text/csv',
      Expires: 60,
    })
  }
}

export default new ProductsImportService()
