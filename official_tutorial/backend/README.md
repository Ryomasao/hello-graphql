# GraphQL の公式チュートリアルをやってみる

https://www.howtographql.com/graphql-js/0-introduction/

## DB を使う

https://www.howtographql.com/graphql-js/4-adding-a-database/
インメモリで CRUD を作ったところで、DB を使う。
DB と GraphQL を接続する際、MySQL だったり、NoSQL 系の DB を直接繋ぐのは厳しいっぽい。
実際使うとしたらこんな感じになるのかしら。

```js
const resolvers = {
  Query: {
    link: (parent, args) => {
      // ここにSQLを直で書く or SQLを叩くレイヤーがあって、それを実行するイメージ？
    }
  },
```

厳しさの理由としては、resolver が複雑になるし、GraphQL で定義したスキーマによる autocomplete が効かないとかそのへんが言われてる？
また、ORM を使うにしても、GraphQL とのクエリが相性がよくないっぽい。
このへんがいまいちわからん。

そこで、おすすめされるのが、GraphQL のスキーマ定義(SDL)をもとに DB 操作をラップしてくれる`prisma`を使う。

とはいえ、使う場合は prisma 用のサーバーを立てなきゃいけないとのこと。

チュートリアルでは、prisma をホスティングしてくれる PrismaCloud を使ってる。

## GraphQL のクエリをすぐ忘れるのでメモ

```
# 記事を取得する
query {
  feed {
		id,
    url,
    description
  }
}

# where
query {
  feed(filter:"today") {
    id
  	description
    url
  }
}

# pagination 指定されたindex(skip)から、2件とってくる。firstなら先頭から、lastなら後尾
# lastはprismaでサポートしてるけど、このコードではまだ実装してない
query {
  feed(first:2, skip:0) {
    id
  	description
    url
  }
}

#更新する
mutation {
  updateLink(id: "記事のid", url:"www.changed"){
    id,
    url,
    description
  }
}

# ログイン(mutationに名前をつけた)
mutation SignupMutation {
  login(email:"tarou@prisma.io",password:"graphql"){
    token
  }
}

```
