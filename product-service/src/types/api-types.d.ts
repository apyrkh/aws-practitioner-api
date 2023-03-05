import { IAvailableProduct } from '@app/types/IAvailableProduct'

export type CreateProductRequest = {
  title: string
  description: string
  price: number
  count: number
}
export type CreateProductResponse = IAvailableProduct

export type GetProductsByIdResponse = IAvailableProduct

export type GetProductsListResponse = IAvailableProduct[]

export type BadRequestResponse = {
  message: string
}
export type NotFoundResponse = {
  message: string
}
export type InternalServerErrorResponse = {
  message: 'Internal server error'
}
