<?php
function throwError() {
    return true;
    //throw new Exception('エラー', 1000);
}


echo "before Erorr\n";

try {
    $a = 1;
    throwError();
} catch(Exception $e) {
    echo "After Error\n";
}

// PHPにブロックスコープはないので、tryの中で宣言した変数も参照できる。
echo "scope: $a";
