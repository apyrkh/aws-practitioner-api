const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()

const availableProducts = [
  {
    id: '590e9eae-6381-41c7-b7d7-df065616f22c',
    title: 'CloudX: AWS Practitioner for JS',
    description: 'The training program gives hands-on full-stack experience with the main focus on  AWS Cloud from an e2e application perspective.',
    price: 29,
    count: 20,
  },
  {
    id: 'fe7f7e82-aec1-425d-a91c-3c6dc68f6a3b',
    title: 'CloudX Associate: AWS DevOps',
    description: 'The program is designed to prepare engineers who have hands-on experience on driving available, cost-efficient, fault-tolerant, and scalable distributed systems on Cloud.',
    price: 49,
    count: 10,
  },
  {
    id: '47b66772-6a87-4a99-8d14-75bc37b5a069',
    title: 'CloudX Associate: MS Azure DevOps',
    description: 'The program is designed to prepare engineers who have hands-on experience on driving available, cost-efficient, fault-tolerant, and scalable distributed systems on Cloud.',
    price: 49,
    count: 10,
  },
  {
    id: 'd8426654-ead6-49bf-ba42-f96fba4ccb64',
    title: 'CloudX Associate: GCP DevOps',
    description: 'The program is designed to prepare engineers who have hands-on experience on driving available, cost-efficient, fault-tolerant, and scalable distributed systems on Cloud.',
    price: 49,
    count: 10,
  },
  {
    id: '813203c8-bfde-42f9-b49f-8593f0acfad9',
    title: 'CloudX Professional: AWS',
    description: 'The program is designed to prepare architects who have hands-on experience on proposing, designing, maintaining, managing, and provisioning systems in cloud environments.',
    price: 99,
    count: 5,
  },
  {
    id: '31e36550-4ae6-437d-b4d4-37b3180ae83d',
    title: 'CloudX Professional: MS Azure',
    description: 'The program is designed to prepare architects who have hands-on experience on proposing, designing, maintaining, managing, and provisioning systems in cloud environments.',
    price: 99,
    count: 5,
  },
  {
    id: '6e516505-a070-4da1-917a-d9ba499ad2a5',
    title: 'CloudX Professional: GCP',
    description: 'The program is designed to prepare architects who have hands-on experience on proposing, designing, maintaining, managing, and provisioning systems in cloud environments.',
    price: 99,
    count: 5,
  },
]

const products = availableProducts.map(({ count, ...product }) => product)
const stocks = availableProducts.map(({ id, count }) => ({ product_id: id, count }))

const createProduct = async (product) => {
  return dynamo.put({
    TableName: 'Products',
    Item: product
  }).promise()
}

const createStock = async (stock) => {
  return dynamo.put({
    TableName: 'Stocks',
    Item: stock
  }).promise()
}

exports.handler = async (event) => {
  try {
    await Promise.all(products.map(it => createProduct(it)))
    await Promise.all(stocks.map(it => createStock(it)))
  } catch (e) {
    console.log(e)
  }
}
