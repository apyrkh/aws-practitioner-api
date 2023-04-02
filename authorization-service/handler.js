function parseTokenBase64 (token) {
  const buff = Buffer.from(token, 'base64')
  const plainCredentials = buff.toString('utf-8').split(':')
  const username = plainCredentials[0]
  const password = plainCredentials[1]

  return {
    username,
    password,
  }
}

module.exports = {
  basicAuthorizer: async function (event, ctx, cb) {

    if (event['type'] != 'TOKEN')
      cb('Unauthorized')

    try {
      const authToken = event.authorizationToken
      const tokenBase64 = authToken.split(' ')[1]
      const { username, password } = parseTokenBase64(tokenBase64)

      const affect = (process.env.AUTH_USER === username && process.env.AUTH_PASSWORD === password) ? 'Allow' : 'Deny'

      const policy = {
        principalId: tokenBase64,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: affect,
              Resource: event.methodArn
            }
          ]
        }
      }
      cb(null, policy)

    } catch (e) {
      cb(`Unauthorized: ${e.message}`)
    }
  }
}
