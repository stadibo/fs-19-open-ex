const { ApolloServer } = require('apollo-server')

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'SUPER_SECRET'

const mongoose = require('mongoose')
const User = require('./models/user')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

mongoose.set('useFindAndModify', false)

const username = process.argv[2]
const password = process.argv[3]

const MONGODB_URI = `mongodb+srv://${username}:${password}@clusterfs-jp-un0hl.mongodb.net/test?retryWrites=true&w=majority`

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})