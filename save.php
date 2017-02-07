<?php
    $filename = 'elements/elements.json';


    if(isset($_POST['data'])){
        $data = $_POST['data'];
        if(file_put_contents ( $filename , $data)){
            echo 1;
        }else{
            echo 0;
        }
    }


?>

