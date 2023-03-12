import { IAvailableProduct } from '@app/types/IAvailableProduct'

export interface IProductService {
  getProductList: () => Promise<IAvailableProduct[]>
  getProductById: (id: string) => Promise<IAvailableProduct | null>
  createProduct: (data: Omit<IAvailableProduct, 'id'>) => Promise<IAvailableProduct>
}
