import { products } from '@app/store/mocks/products'
import { IProduct } from '@app/types/IProduct'

class ProductService {
  getProductList = async () => {
    return products
  }

  getProductById = async (id: string): Promise<IProduct | null> => {
    return products.find(it => it.id === id) || null
  }
}

export default new ProductService()
