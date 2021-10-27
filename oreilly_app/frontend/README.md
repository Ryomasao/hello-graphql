# frontend

## MEMO

- 書籍では`apollo-boost`を利用してる。公式docでは`@apollo/client`を利用してる。違いは何？
→ 現時点で、`@apollo/client`にいろいろ統合されてるっぽいので、`@apollo/client`を使う。
※ `apollo-boost`は最終更新が古いので、公式docに記載されているメソッドが使えなかったりする。

- ApolloClientをContext経由で利用するのってなんでだろ。普通にimportじゃだめなんだっけ。  
→ たぶん、ApolloClientが提供するhooksだったり、hocだったりを利用する際に、Contextのclientを参照してるからだと思う。  
また、ApolloClientはInMemoryCacheももってる、かつキャッシュを更新するとUIも更新してくれるので、コンポーネントとの接続が必須になってくると思われる。  

- [ここ](https://www.apollographql.com/docs/react/caching/cache-interaction/)読んだときにキャッシュの読み書きの違いがピンとこない。  
→ まだよくわかってない。`readQuery/writeQuery`は、キャッシュ全体を書き換えるイメージっぽい。部分参照/更新したければ、`readFragment/writeFragment`ってことかな。  
→ `modify`はGraphQlの構文を使わずに直接オブジェクトを書き換えるなんでもできるやつかしら。

- キャッシュのupdateしても、UIに反映されないぞ
→ [この記事](https://qiita.com/longtime1116/items/fc6530c4a30fedb59770)の通り、readQueryで取得した参照をそのままwriteQueryしてたからだった。
       
## Subscription

WebSocket経由で受け取った値を、InMemoryCacheに追加する方法として `useQuery/subscribeToMore`と `useSubscription/onSubscriptionData`のいずれかがありそう。  

```tsx
	// useQueryでsubscriptionの設定もするパターン
	// subscribeするデータをすでにqueryで取得しているのであれば、こっちがシンプル
  const { loading, data, refetch, subscribeToMore } = useQuery<ROOT_DATA>(
    ROOT_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    subscribeToMore({
      document: LISTEN_FOR_USERS,
      updateQuery: (prev, { subscriptionData }) => {
        // ↓でreturnした値がキャッシュになるっぽい
        return prev;
      },
    });
  }, [])
```

後者は、subscriptionを利用することをhooksで書いて、更新データを処理するcallbackを自分で実装するイメージっぽ。  

```tsx
  useSubscription(LISTEN_FOR_USERS, {
    onSubscriptionData: ({client, subscriptionData}) => {
      client.readQuery()
      client.watchQuery()
    }
  });
```


