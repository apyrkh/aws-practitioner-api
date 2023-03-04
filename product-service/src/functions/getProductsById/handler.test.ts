import { main } from './handler'
import productService from '@app/store/productService'

jest.mock('@app/store/productService')

describe('function getProductsById', () => {
  const mockedProductService = jest.mocked(productService)
  const testEvent = {
    body: null,
    headers: { '"Content-Type ': ' application/json"' },
    multiValueHeaders: { '"Content-Type ': [' application/json"'] },
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/products/mock',
    pathParameters: { productId: 'mock' },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    rawBody: '',
    resource: '/products/{productId}',
  }

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockedProductService.getProductById.mockClear()
  })

  it('should return 200 if store returns product', async () => {
    const product = {
      id: 'TestID',
      title: 'Test title',
      description: 'Test description',
      price: 25,
      count: 10,
    }
    mockedProductService.getProductById.mockResolvedValueOnce(product)

    const result = await main(testEvent, null)

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(product)
    })
  })

  it('should return 404 if store returns null', async () => {
    mockedProductService.getProductById.mockResolvedValueOnce(null)

    const result = await main(testEvent, null)

    expect(result).toEqual({
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Product not found' })
    })
  })

  it('should return 500 if store throws an error', async () => {
    mockedProductService.getProductById.mockRejectedValueOnce(new Error())

    const result = await main(testEvent, null)

    expect(result).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Internal server error' })
    })
  })
})
