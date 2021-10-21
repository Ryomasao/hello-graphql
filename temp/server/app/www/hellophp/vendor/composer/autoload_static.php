<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitf3a755c714b88f92b071e828a83148e4
{
    public static $files = array (
        '0570a98970844c51b284e0f68436b4ae' => __DIR__ . '/../..' . '/helper/functions.php',
    );

    public static $prefixLengthsPsr4 = array (
        'A' => 
        array (
            'App\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'App\\' => 
        array (
            0 => __DIR__ . '/../..' . '/services',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitf3a755c714b88f92b071e828a83148e4::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitf3a755c714b88f92b071e828a83148e4::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}