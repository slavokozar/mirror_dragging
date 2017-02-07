<?php
    if(isset($_GET['id'])){
        $filename = 'elements/'.$_GET['id'].'.json';

        if(!file_exists($filename)){
            echo "0";
            die();
        }

        unlink ($filename);
        echo "1";
    }
?>

