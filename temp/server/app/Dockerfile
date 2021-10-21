FROM php:7.4-fpm
# dockerコマンドで、引数を設定する or docker-compose.ymlで指定できるみたい
# https://qiita.com/nacika_ins/items/cf8ceb20711bd077f770#comments
# docker build . --build-arg user=web
ARG user
ARG uid

# まずはパッケージの一覧をアップデート
RUN apt-get -y update
#RUN apt-get -y install zip unzip zlib1g-dev
# composerでlaravelをprefer-distでインストールすると、zipでもってくるので、zip、unzipが必要になる
RUN apt-get -y install zip unzip wget

# PHPの拡張モジュールをインストール
RUN docker-php-ext-install bcmath

# xdebug用のモジュールを追加する
RUN pecl install xdebug \
  && docker-php-ext-enable xdebug

# composerの設定はCOPYコマンドを使うことにする
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
#RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
#  && php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
#  && php composer-setup.php \
#  && php -r "unlink('composer-setup.php');" \
#  && mv composer.phar /usr/local/bin/composer


# php-fpm用にユーザーを新規でつくる
# オプションは、以下の通り
# -G 作成したユーザーをwww-data,rootのグループに所属する
# -u useridを指定する
# -d 作業ディレクトリを指定する(ホームディレクトリは違うのだろうか)
# https://eng-entrance.com/linux-command-useradd

RUN useradd -G www-data,root -u $uid -d /home/$user $user
# composerに必要なのかしら。comoser用のディレクトリをhomeディレクトリに作る
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user
