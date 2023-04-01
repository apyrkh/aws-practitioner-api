import { main } from './handler'
import productService from '@app/store/productService'

jest.mock('@app/store/productService')
jest.mock('@app/utils/logger')

describe('function getProductList', () => {
  const mockedProductService = jest.mocked(productService)
  const testEvent = {
    body: null,
    headers: { '"Content-Type ': ' application/json"' },
    multiValueHeaders: { '"Content-Type ': [' application/json"'] },
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/products',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    rawBody: '',
    resource: '/products',
  }

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockedProductService.getProductList.mockClear()
  })

  it('should return 200 if store returns product list', async () => {
    const products = [{
      id: 'TestID',
      title: 'Test title',
      description: 'Test description',
      price: 25,
      count: 10,
    }]
    mockedProductService.getProductList.mockResolvedValueOnce(products)

    const result = await main(testEvent, null)

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(products)
    })
  })

  it('should return 500 if store throws an error', async () => {
    mockedProductService.getProductList.mockRejectedValueOnce(new Error())

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
