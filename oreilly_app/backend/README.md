# チャプター5の途中から

MongoDBを利用するので、dockerで準備しとく

```
cd infra
docker-compose up 
```

`http://localhost:8081`で、mongodbの管理画面にアクセスして、アプリ用のDB`photo`を作成しとく。 
※ 初回起動時にsql実行的なこともできるはず。一旦見送り。

## MongoDB

こちらの[チートシート](https://qiita.com/morrr/items/8bcb5b0fc643267d6bcf)を参考にさせていただき、すこしさわってみる。

mongoのコンテナに入って、`mongo`コマンドをたたくとcliのmongoクライアントが使える。

```sh
docker-compose exec mongo bash
> mongo
# 認証
db.auth('root', 'example')
# DBの切り替え(or 作成)
use photo
# コレクション作成
db.createCollection('photos')
```

### Tips

#### db.collections時に認証エラー

```
command aggregate requires authentication
```

mongoDB接続のURL(接続文字列)を下記に変更することで、ユーザーを指定してDBに接続することができる。  

```sh
# before
DB_HOST=mongodb://localhost:27017/photo
# after
DB_HOST=mongodb://root:example@localhost:27017/photo?authSource=admin
```

当初、`authSource`の指定をしていてなくって、`connect`する時点で認証に失敗していた。  

[doc](https://docs.mongodb.com/manual/reference/connection-string/)をみると、接続文字列にid/passを含む場合、認証用のDBをクエリパラメータの`authSource` or URLに`deafultauthdb`を含む必要があるっぽい。  
※ 指定がなければデフォルトで`admin`を見に行くよ的なことが書いてある。明示的に指定する値となんか違うのかな。


