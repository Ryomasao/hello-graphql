// resolverに、Query、Mutation、Subscriptions(まだやってない)以外にも、型が参照された場合のresolverも定義できる
// チュートリアルの初期に、LinkResolverを追加したよね
// Linkがもつ値ががスカラー型 or 独自で定義している型であれば、
// GraphQLは解釈できるので、専用のresolverを用意する必要はない。

//Link: {
//  id:(parent, args, context) => {
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


// 使い所としては、定義したものと実装の間を埋める場合に使う？
// ここでは、リレーションを意識するときに使う

// 定義
// Query → スキーマ定義で、QueryのlinkはLinkを返却することをGraphQLは知ってる
// さらにLinkのhogeは、Stringであることを知ってる
// 仮に、hogeの型をUserにすると、hogeはUserを返却することを想定する
// なのでクエリ実行結果にUser型で定義している値がなければエラーになる

// 実装
// Queryのlinkは、prisma.link()を返す

// 以下の場合、parentに、prisma.link()の結果が渡される。
const hoge = (parent, args) => {

  // 型がUser型であればこんなオブジェクトを返す必要がある
  // これだとエラーにはなんないけど、意味ないよね。ほしいのは、Linkにのってるuserなので
  // だからprismaに再度問い合わせるだね
  //return {id: "", name:""}

  //console.log(parent, args)
  return 'fuga'
}

// postedByは、User型そのものを返す。
// 裏では、LinksTableからLinkデータをとってきて
// Linkデータに乗ってるuserIdをもとにUsersTableから値をとってくる的なイメージになってる
// 実際に、postedByは、linkのデータ分呼ばれてる
// こうやってみるとN+1問題の問題そのものが起きる気がするけど、どうやって回避すんだろね
// ああ、prismaとRDBとの間でうまいことやってるのか
const postedBy = (parent, args, context) => {
  // prismaのお作法がよくわからん
  // postedBy()で関数を実行するあたりがなぞ
  // 興味が出たタイミングでよもう
  // https://www.prisma.io/docs/prisma-client/basic-data-access/reading-data-JAVASCRIPT-rsc2/
  return context.prisma.link({ id: parent.id }).postedBy()
}

const votes = (parent, args, context) => {
  return context.prisma.link({id: parent.id}).votes()
}

module.exports = {
  postedBy,
  hoge,
  votes,
}