const { GraphQLServer} = require('graphql-yoga')

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  },
  {
    id: 'link-1',
    url: 'www.google.com',
    description: 'google'
  },
]

let idCount = links.length

// GraphQL実装
const resolvers = {
  Query: {
    info:() => 'This is the API of a Hackernews Clone',
    feed: () => links,
    link: (parent, args) => {
      return links.find(link => link.id === args.id)
    }
  },
  Mutation: {
    post:(parent, args) => {
      const link ={
        id: `link-${idCount++}`,
        url: args.url,
        description: args.description
      }
      links.push(link)
      return link
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

const server = new GraphQLServer({typeDefs:'./src/schema.graphql', resolvers})
server.start(() => console.log('Server is running'))