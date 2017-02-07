<?php

    if(isset($_POST['data']) && isset($_GET['id'])){
        $filename = 'elements/'.$_GET['id'].'.json';
        $data = $_POST['data'];
        if(file_put_contents ( $filename , $data)){
            echo 1;
        }else{
            echo 0;
        }
    }

?>

