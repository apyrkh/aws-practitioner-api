import { IProduct } from './IProduct'

export type GetProductsByIdResponse = IProduct
export type GetProductsByIdResponse404 = {
  message: 'Product not found'
}

export type GetProductsListResponse = IProduct[]

export type InternalServerErrorResponse = {
  message: 'Internal server error'
}
