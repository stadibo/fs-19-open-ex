const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'SUPER_SECRET'

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

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

const typeDefs = gql`
  type Query {
    hello: String!,
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book!]!,
    allAuthors: [Author!]!,
    me: User
  },

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author,
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type User {
    id: ID!
    username: String!,
    favoriteGenre: String!,
  }

  type Token {
    value: String!
  }

  type Book {
    id: ID!
    title: String!,
    author: Author!,
    published: Int!,
    genres: [String!]!
  },

  type Author {
    id: ID!
    name: String!,
    born: Int
    bookCount: Int!
  }
`

const resolvers = {
  Query: {
    hello: () => { return "world" },
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: (root, args) => {
      const conditions = {}
      if (args.genre) conditions.genres = args.genre
      return Book.find(conditions).populate('author')
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError('Authentication error. Login to add books.')
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          author = await author.save()
        } catch (err) {
          if (err.name === 'ValidationError' && err.kind === 'minlength') {
            return new UserInputError('Author name must be at least 4 characters', { invalidArgs: args })
          }
          return err
        }
      }
      let newBook
      try {
        const book = new Book({ ...args, author })
        newBook = await book.save()
      } catch (err) {
        if (err.name === 'ValidationError' && err.kind === 'minlength') {
          return new UserInputError('Book title must be at least 2 characters', { invalidArgs: args })
        }
      }
      return await newBook.populate('author')
    },
    editAuthor: (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError('Authentication error. Login to edit auhtors.')
      return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'hackerman') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },

  Author: {
    bookCount: (root) => Book.countDocuments({ author: root })
  }
}

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

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})