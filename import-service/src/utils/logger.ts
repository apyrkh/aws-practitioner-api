import pino from 'pino'
import { lambdaRequestTracker, pinoLambdaDestination } from 'pino-lambda'

const destination = pinoLambdaDestination()
export const logger = pino(destination)
export const withRequest = lambdaRequestTracker()
