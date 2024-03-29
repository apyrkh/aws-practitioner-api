import { DynamoDB, SNS } from 'aws-sdk'
import { CREATE_PRODUCT_SNS_TOPIC_ARN } from '@app/constants'
import { IProductService } from '@app/types/IProductService'
import { IAvailableProduct } from '@app/types/IAvailableProduct'
import { IProduct } from '@app/types/IProduct'
import { IStock } from '@app/types/IStock'
import { logger } from '@app/utils/logger'
import { uuid } from '@app/utils/uuid'

class DynamoDbProductService implements IProductService {
  sns = new SNS()
  dynamo = new DynamoDB.DocumentClient()

  stocksTableName = 'Stocks'
  productsTableName = 'Products'

  getProductList = async () => {
    const result = await this.dynamo.scan({ TableName: this.productsTableName }).promise()
    const products = result.Items as IProduct[]

    return Promise.all(products.map((product) => this.convertToAvailableProduct(product)))
  }

  getProductById = async (id: string) => {
    const result = await this.dynamo.query({
      TableName: this.productsTableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id }
    }).promise()
    const product = result.Items[0] as (IProduct | null)
    if (!product) {
      return null
    }

    return this.convertToAvailableProduct(product)
  }

  createProduct = async (data: Omit<IAvailableProduct, 'id'>) => {
    const { title, description, price, count } = data
    const product: IProduct = { id: uuid(), title, description, price }
    const stock: IStock = { product_id: product.id, count: count }

    try {
      await this.dynamo.transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: 'Products',
              Item: product
            },
          },
          {
            Put: {
              TableName: 'Stocks',
              Item: stock
            }
          }
        ]
      }).promise()

      await this.sns.publish({
        TopicArn: CREATE_PRODUCT_SNS_TOPIC_ARN,
        Subject: `New product created: ${product.title}`,
        Message: `New product has been created
${JSON.stringify(product, null, 2)}
`,
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: `${product.price}`
          }
        }
      }).promise()
    } catch (e) {
      logger.error(e)
    }

    return this.getProductById(product.id)
  }

  getStockByProductId = async (productId: string) => {
    const result = await this.dynamo.query({
      TableName: this.stocksTableName,
      KeyConditionExpression: 'product_id = :productId',
      ExpressionAttributeValues: { ':productId': productId }
    }).promise()
    const stock = result.Items[0]

    return (stock || null) as IStock | null
  }

  convertToAvailableProduct = async (product: IProduct) => {
    const stock = await this.getStockByProductId(product.id)

    const availableProduct: IAvailableProduct = {
      ...product,
      count: stock?.count || 0
    }

    return availableProduct
  }
}

export default new DynamoDbProductService()
