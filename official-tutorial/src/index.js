const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

// GraphQL実装
const resolvers = {
  Query: {
    info:() => 'This is the API of a Hackernews Clone',
    feed:(root, args, context, info) => {
      return context.prisma.links()
    }
  },
  Mutation: {
    post:(root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      })
    },
    updateLink:(parent, args) => {
      // ない場合のエラーハンドリングってどうすんだろ
      const index = links.findIndex(link => link.id === args.id)
      const updatedLink =  {...links[index], ...args}
      links[index] = updatedLink
      return updatedLink
    }
  // 基本は書かなくていい
  // feedはLinkを返すってtypedefで定義してるから、feedから、Linkが呼ばれるっぽい
    //Link: {
    //  id:(parent) => {
    //    //console.log('parent is...', parent)
    //    //parent is... {
    //    //  id: 'link-0',
    //    //  url: 'www.howtographql.com',
    //    //  description: 'Fullstack tutorial for GraphQL'
    //    //}
    //    return parent.id
    //  },
    //  description: (parent) => parent.description,
    //  url: (parent) => parent.url
    //}
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
})
server.start(() => console.log('Server is running'))