<?php
// https://www.php.net/manual/ja/language.types.callable.php

function exec_callback($func)
{
    $func(1);
}

// 単純な関数
function simpleFunc($value)
{
    print("simple Func is done, value: $value\n");
}

// 関数を変数に入れることもできるっぽ
// $a = function() {}みたいに無名関数を値としてセットすることもできる
// jsと同じでClosureって呼ぶ
$a = simpleFunc;
$a(2);

// 単純な関数を呼ぶ例
exec_callback('simpleFunc');

class HasStaticMethod
{
    public static function simpleStatic($value)
    {
        print("public static method is done, value: $value\n");
    }

    public function simple($value)
    {
        print("public method is done, value: $value\n");
    }

    private function simplePrivate($value)
    {
        print("private method is done, value: $value\n");
    }
}

// staticメソッドを呼ぶ例
exec_callback(array('HasStaticMethod', 'simpleStatic'));
// PHP5.2.3以降はこれでもいけるって書いてあった。エラーになるぞ。
//exec_callback('HasStaticMethod::simpleStatic');

// オブジェクト(インスタンス)のメソッドを呼ぶ例
$obj = new HasStaticMethod();

exec_callback(array($obj, 'simple'));
// インスタンス渡して、クラスメソッドも当然実行できる
//exec_callback(array($obj, 'simpleStatic'));
// privateなmethodは実行できない
//exec_callback(array($obj, 'simplePrivate'));
