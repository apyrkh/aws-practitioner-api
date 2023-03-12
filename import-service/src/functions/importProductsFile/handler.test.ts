import { main } from './handler'
import productImportService from '@app/services/productsImportService'

jest.mock('@app/services/productsImportService')
jest.mock('@app/utils/logger')

describe('function importProductsFile', () => {
  const mockedProductsImportService = jest.mocked(productImportService)
  const testEvent = {
    body: null,
    headers: { '"Content-Type ': ' application/json"' },
    multiValueHeaders: { '"Content-Type ': [' application/json"'] },
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '/import',
    pathParameters: null,
    queryStringParameters: { name: 'test.csv' },
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: undefined,
    rawBody: '',
    resource: '/import',
  }

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockedProductsImportService.getSignedUploadUrl.mockClear()
  })

  it('should return 200 if query parameter name is provided', async () => {
    const signedUploadUrl = 'https://test.com'
    mockedProductsImportService.getSignedUploadUrl.mockResolvedValueOnce(signedUploadUrl)

    const result = await main(testEvent, null)

    expect(result).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(signedUploadUrl)
    })
  })

  it('should return 400 if query parameter name is not provided', async () => {
    const result = await main({ ...testEvent, queryStringParameters: null }, null)

    expect(result).toEqual({
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Missing required request parameters: [name]' })
    })
  })

  it('should return 500 if query parameter name is provided and service throws an error', async () => {
    mockedProductsImportService.getSignedUploadUrl.mockRejectedValueOnce(new Error())

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
