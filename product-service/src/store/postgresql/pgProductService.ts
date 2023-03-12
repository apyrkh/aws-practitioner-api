import { Client, QueryConfig } from 'pg'
import { IProductService } from '@app/types/IProductService'
import { IAvailableProduct } from '@app/types/IAvailableProduct'
import { IStock } from '@app/types/IStock'
import { IProduct } from '@app/types/IProduct'

class PgProductService implements IProductService {
  // https://node-postgres.com/apis/client
  dbClient = new Client()

  constructor () {
    this.dbClient.connect()
  }

  getProductList = async () => {
    const query: QueryConfig = {
      text: 'SELECT * FROM Products LEFT JOIN Stocks on Products.id = Stocks.product_id',
    }

    const result: { rows: IAvailableProduct[] } = await this.dbClient.query(query)
    return result.rows ? result.rows : null
  }

  getProductById = async (id: string) => {
    const query: QueryConfig = {
      text: `SELECT * FROM Products LEFT JOIN Stocks on Products.id = Stocks.product_id WHERE Products.id = $1`,
      values: [id],
    }

    const result: { rows: IAvailableProduct[] } = await this.dbClient.query(query)
    return result.rows[0] ? result.rows[0] : null
  }

  createProduct = async (data: Omit<IAvailableProduct, 'id'>) => {
    const { title, description, price, count } = data
    const productQuery: QueryConfig = {
      text: `INSERT INTO Products(title, description, price) VALUES($1, $2, $3) RETURNING *`,
      values: [title, description, price],
    }
    const productQueryResult: { rows: IProduct[] } = await this.dbClient.query(productQuery)
    const product = productQueryResult.rows[0]

    const stockQuery: QueryConfig = {
      text: 'INSERT INTO Stocks(product_id, count) VALUES($1, $2) RETURNING *',
      values: [product.id, count]
    }
    const stockQueryResult: { rows: IStock[] } = await this.dbClient.query(stockQuery)
    const stock = stockQueryResult.rows[0]

    return { ...product, count: stock.count }
  }
}

export default new PgProductService()
