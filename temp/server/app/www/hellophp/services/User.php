<?php
namespace App {
  class User
  {
      protected $name;

      public function __construct(string $name)
      {
          $this->name = $name;
      }

      public function name()
      {
          return $this->name;
      }
  }

  }
