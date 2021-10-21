<?php
// https://se-tomo.com/2018/12/19/%E3%80%90php%E3%80%91spl_autoload_register%E3%81%A8%E3%82%AA%E3%83%BC%E3%83%88%E3%83%AD%E3%83%BC%E3%83%89/
class ClassLoader
{
    private $dirs;

    public function registerDir($dir)
    {
        $this->dirs[] = $dir;
    }

    public function register()
    {
        // sql_autoload_registerには、callableな値を渡す
        // https://www.php.net/manual/ja/language.types.callable.php
        spl_autoload_register(array($this, 'loadClass'));
    }

    public function loadClass($class)
    {
        print("load class:$class\n");
        foreach ($this->dirs as $dir) {
            $file = "$dir/$class.php";
            if (is_readable($file)) {
                require($file);
                return;
            }
        }
    }
}

$loader = new ClassLoader();

$loader->register();
$loader->registerDir('./otherDir');

$sample = new Sample();
