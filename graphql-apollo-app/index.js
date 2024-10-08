import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// data
import db from './_db.js'

// types
import { typeDefs } from './schema.js'

// resolvers
const resolvers = {
  Query: {
    games() {
      return db.games
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id)
    },
    authors() {
      return db.authors
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id)
    },
    reviews() {
      return db.reviews
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id)
    }
  },
// for this query
  // query ExampleQuery($id: ID!) {
  //   game(id: $id) {
  //     reviews{
  //       rating, content
  //     }
  //   }
  // }
  
  Game: {
    reviews(parent){
      return db.reviews.filter((r)=>r.game_id===parent.id)
    }
  },

  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    }
  },
  
  Review: {
    game(parent){
      return db.games.find((game) => game.id === parent.game_id);
    },
    author(parent){
      return db.authors.find((author) => author.id === parent.author_id);
    }
  },


  
  Mutation: {
  // QUARY FOR MUTAION
  // mutation deleteMutation($id:ID!) {
  //   deleteGame(id: $id) {
  //     id
  //   }
  // }
    deleteGame(_, args) {
      db.games = db.games.filter((game)=> game.id !=args.id);
      return db.games;
    },

    // mutation addMutation($game: addGameInput!) {
    //   addGame(game: $game) {
    //     title,
    //     id
    //   }
    // }
    addGame(_,args){
      let game = {
        ...args.game,
        id: Math.floor(Math.random()*1000)
      }

      db.games.push(game);
      return game;
    }

  },
  
  
}

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)