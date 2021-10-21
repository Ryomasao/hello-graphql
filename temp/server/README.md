# はじめに

GraphQL を試すための API サーバーをつくる。
ひとまず Laravel を使うことにする。

## 参考にした Docker 構成

過去の自分 + 改めて記事を読む。全てを忘れたので、メモっておこう。
https://github.com/Ryomasao/docker-laravel

参考にさせていただいた記事
https://www.digitalocean.com/community/tutorials/how-to-containerize-a-laravel-application-for-development-with-docker-compose-on-ubuntu-18-04

### php-fpm

#### はじめに

PHP を FastCGI で動かすのであれば、php-fpm を使おう。
Apache のソースコードを読んで学んだ時に、CGI をリクエストの度に起動してたらやべえよってやつだね。
fastcgi は、別プロセスを最初から立ち上げておいて、Apache と通信して、CGI を実行して結果を返すってやつだったね。FastCGI 自体はそれを実現するための規格で、Web サーバーと通信する際の IF なんかを定義してるやつだった。
ちなみに Apache に含まれる PHP のモジュール版はどう動いてんのかとか調べてなかった。とはいえ今回は Nginx で動かすので、Apache の話はここまでにしよう。
※ ああ、PHP 自体 C 言語で書かれてるから、Apache の拡張モジュールとして動かすことができる気がしてきた。

言いたかったことは、php-fpm のコンテナで php を実行するから、php の実行環境はこのコンテナに用意しようね！ってこと。

#### 使うイメージ

使用するイメージは、PHP の公式 Docker イメージのひとつとして用意されてるから、これを使おう。
https://hub.docker.com/_/php

バージョンは PHP 公式に書いてある現時点で一番新しい 7.4 系を選んだよ。
https://www.php.net/ChangeLog-7.php

Dockerfile

```sh
FROM php:7.4-fpm
```

#### とりあえず起動する

```
$ docker build .
```

```
$ docker run -it  [imageID] bash
```

#### 必要な PHP 拡張モジュールを入れる

```sh
# php -v
PHP 7.4.3 (cli) (built: Feb 26 2020 12:17:01) ( NTS )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies

# php -m
[PHP Modules]
Core
ctype
curl
date
dom
fileinfo
filter
ftp
hash
iconv
json
libxml
mbstring
mysqlnd
openssl
pcre
PDO
pdo_sqlite
Phar
posix
readline
Reflection
session
SimpleXML
sodium
SPL
sqlite3
standard
tokenizer
xml
xmlreader
xmlwriter
zlib

[Zend Modules]

```

<b>要求事項</b>

```
PHP >= 7.2.0
BCMath PHP Extension→デフォルトでなさそう
Ctype PHP Extension
Fileinfo PHP extension
JSON PHP Extension
Mbstring PHP Extension
OpenSSL PHP Extension
PDO PHP Extension
Tokenizer PHP Extension
XML PHP Extension
```

Dockerfile

```sh
FROM php:7.4-fpm
# 追加
RUN docker-php-ext-install bcmath
```

#### Composer を入れる

PHP のパッケージ管理ツール。js で npm に慣れてきたので、こうして別の言語のパッケージマネージャに戻ってくると感慨深いものがある。

今までは、Composer の公式サイトにしたがって、以下のようにインストールを実行していた。

```sh
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
  && php composer-setup.php \
  && php -r "unlink('composer-setup.php');" \
  && mv composer.phar /usr/local/bin/composer
```

参考にさせていただいた記事では、Docker の以下の機能を使って、コンポーザーの公式イメージから、composer コマンドを直接コピーするという方法を取っていたので、試しに使って見ることにした。

https://qiita.com/minamijoyo/items/711704e85b45ff5d6405

このタイミングで、もっかいビルドしなおす。
初期の image とは区別するため、タグをつけることにした。

```
$ docker build . -t "my-php-fpm"
```

これで再度コンテナを起動すると、composer コマンドのパスが通っていることが確認できた。

あと、いっつも root ユーザーのままで使ってるけど、せっかくなので、ユーザーをちゃんと用意することにした。

```sh
FROM php:7.4-fpm
# dockerコマンドで、引数を設定する or docker-compose.ymlで指定できるみたい
# docker build . --build-arg user=web
ARG user
ARG uid

# PHPの拡張モジュールをインストール
RUN docker-php-ext-install bcmath

# composerの設定はCOPYコマンドを使うことにする
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# php-fpm用にユーザーを新規でつくる
# オプションは、以下の通り
# -G 作成したユーザーをwww-data,rootのグループに所属する
# -u useridを指定する
# -d 作業ディレクトリを指定する(ホームディレクトリは違うのだろうか)

RUN useradd -G www-data,root -u $uid -d /home/$user $user
# composerに必要なのかしら。comoser用のディレクトリをhomeディレクトリに作る
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

```

### あとで PHP の基本ページをつくって移動しよう

#### formatter について

PHP の code formatter は`php-cs-fixer`がよさげ。
https://github.com/FriendsOfPHP/PHP-CS-Fixer

vscode で使う場合は、上記のインストールを済ませたあとに、php-cs-fixer の拡張機能を入れたら、保存時に整形された。
`vscode-php-cs-fixer`っていうダウンロード数も多くって、`php-cs-fixer`を含んでる拡張機能もあったんだけど、整形されなかった。なぜ。

#### モジュールの考え方について

php では、別ファイルは読み込むには`require`と`include`がある。
`require`は指定されたパスのファイルがなかったり、ファイル内で構文エラーがあったりすると、FatalError になるのに対し、`include`は waning でになるとのこと。

基本的に`require`を使えばいい気がする。

index.php

```php
require('./moduleA.php");
```

別ファイルを参照すると、`index.php`にまるっと`moduleA.php`の内容が展開されるイメージでいいと思う。

なので別ファイルに記載されているトップレベルの変数だったり、クラス宣言なんかは`require`するだけで、参照することができる。
なんも考えないと、どのファイルにどのクラス宣言があるかはぱっと見わからなくなりそうね。

### VsCode の RemoteDevelopment を使ってみよう

めちゃくちゃ簡単だった。RemoteDevelopment と Docker の拡張機能入れて事前にコンテナを立ち上げて、Docker の拡張機能で Attache するだけ。

もしくは、 `Command + Shift + P` で`Open WorkSpace`でコンテナを起動すると、コンテナの`/workspace`にプロジェクト全体をマウントしてくれる。
この場合、`.devcontainer/devcontainer.json`が作成され、ここでコンテナ内で有効にする拡張機能の設定とかができる。
コンテナに繋がってる vscode の拡張機能パレットから、歯車アイコンで`devcontainer.json`に追加するを個別で選択することでも対応できる。
拡張機能を追加したら、コンテナを作成しなおしになるっぽいので、vscode を再起したほうがよさげ。

`devcontainer.json`を作成しとくと、Attache で接続しても設定は有効になってた。
特定のディレクトリのみの`devcontainer.json`のみ作成するとかできるんかな。
これに書いてあるかな。
https://code.visualstudio.com/docs/remote/containers

### Xdebug を導入する

Dockerfile

```sh
# xdebug用のモジュールを追加する
RUN pecl install xdebug \
  && docker-php-ext-enable xdebug
```

.vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "XDebug on docker",
      "type": "php",
      "request": "launch",
      "port": 9000,
      "pathMappings": {
        // {docker上のdocument root}:{ローカルのdocument root}
        "/var/www": "${workspaceFolder}/app/www"
      },
      // BreakPointとまんねえって時はとりあえず、entry時にとまるか確かめよう
      "stopOnEntry": false
    }
  ]
}
```

### Composer の仕組み

php の組み込み関数である`spl_autoload_register`で実装されてる。
これは、クラスを new する際に呼び出す関数を設定することができる。
`new App/Hoge`ってすると、`spl_autoload_register`で`composer.json`でマップした情報をもとにクラスを探してくれる。
マップ情報は実行時に json をみるとかじゃなくって`composer dump-autoload`を実行することで、マップ情報が埋め込まれた php を生成してるんだ。

```json
{
  "autoload": {
    "psr-4": {
      // Appってつくものは、services配下にあるっていうマップ
      "App\\": "services/"
    }
  }
}
```

クラスだけじゃなくって、以下のように helper 関数なんかも登録することができる。

```json
{
  "autoload": {
    "psr-4": {
      "App\\": "services/"
    },
    "files": ["helper/functions.php"]
  }
}
```
