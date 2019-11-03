const { UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const jwt = require('jsonwebtoken')
const JWT_SECRET = 'SUPER_SECRET'

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
    allAuthors: () => {
      console.log('Get authors')
      return Author.find({})
    },
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
        return err
      }
      newBook = await newBook.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
      return newBook
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

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  },

  Author: {
    bookCount: (root) => {
      console.log('Get book count', root.id)
      return Book.countDocuments({ author: root })
    }
  }
}

module.exports = resolvers