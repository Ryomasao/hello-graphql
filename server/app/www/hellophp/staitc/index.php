<?php

class Foo {
    public static function helloGateWay() {
        // extednsしたときに、Barでオーバライドしたhelloメソッドを実行できる
        // ただし、$thisなので、helloGatewayがstaticの場合は使えない
        //$this->hello() ;
        // おそらく、自クラスのstaticメソッドを呼ぶのであれば、このやり方が大半なのかな。
        // helloGatewayがstaticでも呼べる。ただし、Barのオーバライドはできない。
        //self::hello();
        // satic + Barでオーバライドしたいのであれば、static
        static::hello();
    }

    public static function hello() {
        echo  __CLASS__, 'hello!'.PHP_EOL;
    }
}

class Bar extends Foo {
    public static function hello() {
        echo  __CLASS__, 'hello!'.PHP_EOL;
    }
}


//$foo = new Foo();
//$foo->helloGateWay();
//Foo::hello();
Foo::helloGateway();
Bar::helloGateway();

//$bar = new Bar();
//$bar->helloGateWay();