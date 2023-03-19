import { main } from './handler'
import productService from '@app/store/productService'

jest.mock('@app/store/productService')
jest.mock('@app/utils/logger')

describe('catalogBatchProcess', () => {
  const mockedProductService = jest.mocked(productService)

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockedProductService.createProduct.mockClear()
  })

  it('should call productService.createProduct if valid product', async () => {
    const product1 = { title: 'title1', description: 'description1', price: 100, count: 10 }
    const product2 = { title: 'title2', description: 'description2', price: 100, count: 10 }
    const testEvent = {
      Records: [
        { body: JSON.stringify(product1) },
        { body: JSON.stringify(product2) },
      ]
    }

    // @ts-expect-error: ignore unused properties for simplicity
    await main(testEvent, null, null)

    expect(mockedProductService.createProduct).toHaveBeenCalledTimes(2)
    expect(mockedProductService.createProduct).toHaveBeenCalledWith(product1)
    expect(mockedProductService.createProduct).toHaveBeenCalledWith(product2)
  })

  it('should not call productService.createProduct if invalid product', async () => {
    const product1 = { description: 'description1', price: 100, count: 10 }
    const product2 = { title: 'title2', price: 100, count: 10 }
    const product3 = { title: 'title3', description: 'description3', count: 10 }
    const product4 = { title: 'title4', description: 'description4', price: 100 }
    const testEvent = {
      Records: [
        { body: JSON.stringify(product1) },
        { body: JSON.stringify(product2) },
        { body: JSON.stringify(product3) },
        { body: JSON.stringify(product4) },
      ]
    }

    // @ts-expect-error: ignore unused properties for simplicity
    await main(testEvent, null, null)

    expect(mockedProductService.createProduct).not.toHaveBeenCalled()
  })
})
