export const createProductRequestSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'integer' },
    count: { type: 'integer' },
  },
  required: ['title', 'description', 'price', 'count']
} as const
