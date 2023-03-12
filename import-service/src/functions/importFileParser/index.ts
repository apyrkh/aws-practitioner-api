import { handlerPath } from '@app/libs/handler-resolver'
import { AWS } from '@serverless/typescript'
import { BUCKET_NAME, UPLOAD_FOLDER_NAME } from '@app/constants'

const importFileParserLambda: AWS['functions']['key'] = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          { prefix: `${UPLOAD_FOLDER_NAME}/` },
        ],
        existing: true,
      },
    },
  ],
}
export default importFileParserLambda
