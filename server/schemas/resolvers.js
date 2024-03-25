const {User} = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth');

// Existing resolvers for user-related queries and mutations
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
              return userData;
            }
            throw AuthenticationError;
          },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
              throw AuthenticationError;
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
              throw AuthenticationError;
            }
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData } },
                { new: true }
              );
              return updatedUser;
            }
            throw AuthenticationError;
          },
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
              return updatedUser;
            }
            throw AuthenticationError;
          },
    }
};

resolvers.Query.searchBooks = async (_, { searchTerm }) => {
  try {
     const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
     if (!response.ok) {
       throw new Error('Failed to fetch books');
     }
     const data = await response.json();
     return data.items.map(item => ({
       id: item.id,
       title: item.volumeInfo.title,
       authors: item.volumeInfo.authors,
       description: item.volumeInfo.description,
       image: item.volumeInfo.imageLinks?.thumbnail,
       link: item.volumeInfo.infoLink,
     }));
  } catch (error) {
     console.error('Error fetching books:', error);
     throw new Error('Failed to fetch books');
  }
 };
 

module.exports = resolvers;