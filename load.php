<?php
    $filename = 'elements/elements.json';

    if(!file_exists($filename)){
        die();
    }

    $data = file_get_contents($filename);

    echo $data;
?>

