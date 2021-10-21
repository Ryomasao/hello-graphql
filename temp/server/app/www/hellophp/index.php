<?
  require('vendor/autoload.php');

  help();
  $user = new App\User('tarou');
  $name = $user->name();
  print("$name\n");


