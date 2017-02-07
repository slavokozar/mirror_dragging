<?php
    $filename = 'elements/elements.json';

    if(isset($_GET['id'])){
        $id = $_GET['id'];
        $elements = json_decode(file_get_contents($filename));
        $element = null;

        foreach($elements as $ele){
            if($ele->id == $id){
                $element = $ele;
            }
        }

        $filename = 'elements/' . $id . '.json';
        $data = json_decode(file_get_contents($filename));

    }else{
        die();
    }
?>
<div class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form action="<?php echo $id;?>" method="post">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Nastavenie elementu</h4>
                </div>
                <div class="modal-body">

<?php
    if($element->type == 'autobusy'):
?>
        <h1>Autobusy</h1>
        <?php foreach($data->lines as $line): ?>
        <div class="form-wrapper row">

            <div class="form-group col-lg-5">
                <label>Odchod:</label>
                <input type="text" class="form-control" name="from" value="<?php echo $line->from;?>">
            </div>
            <div class="form-group col-lg-5">
                <label>Príchod:</label>
                <input type="text" class="form-control" name="to" value="<?php echo $line->to;?>">
            </div>
            <div class="col-lg-2 text-right">
                <button class="btn btn-danger modal-removeLine"><i class="fa fa-minus" aria-hidden="true"></i></button>
            </div>
        </div>
        <?php endforeach; ?>
        <div class="row">
            <div class="col-md-12 text-right">
                <button id="modal-addLine" class="btn btn-success"><i class="fa fa-plus" aria-hidden="true"></i></button>
            </div>
        </div>


<?php
    elseif($element->type == 'spravy'):
?>
        <h1>Spravy</h1>
        <div class="radio">
            <label>
                <input type="radio" name="source" value="1" <?php if($data->source == 1) echo 'checked';?>> Zdroj správ 1
            </label>
        </div>
        <div class="radio">
            <label>
                <input type="radio" name="source" value="2" <?php if($data->source == 1) echo 'checked';?>> Zdroj správ 2
            </label>
        </div>
<?php
    elseif($element->type == 'gmail'):
?>
        <h1>Gmail</h1>
        <div class="form-group">
            <label>Email:</label>
            <input type="email" class="form-control" name="email" value="<?php echo $data->email;?>">
        </div>
        <div class="form-group">
            <label>Heslo:</label>
            <input type="password" class="form-control" name="password" value="<?php echo $data->password;?>">
        </div>

<?php
    elseif($element->type == 'pocasie'):
?>
        <h1>Pocasie</h1>
        <div class="form-group">
            <label>lat:</label>
            <input type="text" class="form-control" name="lat" value="<?php echo $data->lat;?>">
        </div>
        <div class="form-group">
            <label>Heslo:</label>
            <input type="text" class="form-control" name="lon" value="<?php echo $data->lon;?>">
        </div>
<?php
    else:
?>
    <h1>Neznamy element</h1>
<?php
    endif;
?>


                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <input id="modal-submit" type="submit" class="btn btn-primary" value="Save">
                </div>
            </form>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->