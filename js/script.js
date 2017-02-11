$(function() {
    var width = 0;
    var height = 0;

    var types = {
        'autobusy' : {
            width: 100,
            height: 100,
            ratio: true,
            resizeX: true,
            resizeY: true,
            color: '#f00',
            caption: 'Autobusy',
            data: {
                lines:[{
                    from: "trojica",
                    to:"veľká pošta"
                }]
            }
        },
        'hodiny' : {
            width: 100,
            height: 100,
            ratio: false,
            resizeX: true,
            resizeY: true,
            color: '#ff0',
            caption: 'Hodiny',
            data: {}
        },
        'spravy' : {
            width: 100,
            height: 100,
            ratio: false,
            resizeX: false,
            resizeY: true,
            color: '#0ff',
            caption: 'Správy',
            data: {
                source: 1
            }
        },
        'gmail' : {
            width: 100,
            height: 100,
            ratio: false,
            resizeX: true,
            resizeY: false,
            color: '#f0f',
            caption: 'Gmail',
            data: {
                email: '',
                password: ''
            }
        },
        'pocasie' : {
            width: 100,
            height: 100,
            ratio: false,
            resizeX: true,
            resizeY: true,
            color: '#00f',
            caption: 'Počasie',
            data: {
                lat: 48.9958127,
                lon: 21.1760141
            }
        }
    };

    $(document).on('click', '.btn-delete', function (e) {
        $element = $(e.target).closest('.element');
        var id = $element.data('id');

        $.ajax({
            url: 'delete.php?id='+id,
            method: 'GET',
        }).done(function (data){
            $('.modal').modal('hide');
            if(data == 1){
                var $alert = $('<div class="col-lg-12"><div class="alert alert-success"><strong>Success!</strong> Element removed.</div></div>');
            }else{
                var $alert = $('<div class="col-lg-12"><div class="alert alert-danger"><strong>Error!</strong> Element not removed.</div></div>');
            }

            $('#btn-save').closest('.row').append($alert);
            setTimeout(function(){ $alert.remove() }, 2000);

            $element.remove();
            store();
        });
    });

    $(document).on('click', '.btn-edit', function (e) {
        var id = $(e.target).closest('.element').data('id');
        $.ajax({
            url: 'edit.php',
            method: 'get',
            data: {
                'id': id
            }
        }).done(function (data){
            var $modal = $(data);
            $('body').append($modal);
            $modal.modal('show');

            $modal.on('hidden.bs.modal', function (e) {
                $modal.remove();
                $('.modal-backdrop').remove();
            });
        });
    });

    $(document).on('click', '#toolbar .btn', function (e) {
        var type = $(e.target).closest('.btn').data('type');
        var x = 0;
        var y = 0;

        var id = Date.now() + '';
        for(var i = 0; i < 4; i++){
            id = id + Math.floor(Math.random() * 10);
        }


        createElement({
            id: id,
            type: type,
            x: 0,
            y: 0,
            width: types[type].width,
            height: types[type].height,
        });

        saveElement(id, types[type].data);
        store();
        save();
    });

    $(document).on('click', '#btn-save', function (e) {
        save();
    });

    function save(){
        $.ajax({
            url: 'save.php',
            method: 'post',
            data: {
                'data': JSON.stringify(serialize())
            }
        }).done(function (data){
            if(data == 1){
                var $alert = $('<div class="col-lg-12"><div class="alert alert-success"><strong>Success!</strong> Elements saved.</div></div>');
            }else{
                var $alert = $('<div class="col-lg-12"><div class="alert alert-danger"><strong>Error!</strong> Elements not saved.</div></div>');
            }

            $('#btn-save').closest('.row').append($alert);
            setTimeout(function(){ $alert.remove() }, 2000);
        })
    }


    $(document).on('click', '#modal-submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var data = serializeModal();
        var id = $('.modal form').attr('action');
        saveElement(id, data);
    });

    $(document).on('click', '#modal-addLine', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var $wrapper = $('.modal form .form-wrapper').last();
        $wrapper.after($wrapper.clone());
    });

    $(document).on('click', '.modal-removeLine', function (e) {
        e.preventDefault();
        e.stopPropagation();

        $(e.target).closest('.form-wrapper').remove();
    });


    function serializeModal(){
        var data = {};

        var $form = $('.modal form');
        var $wrappers = $form.find('.form-wrapper');

        if($wrappers.length == 0){
            var array = $form.serializeArray();

            for(var i in array){
                data[array[i].name] = array[i].value;
            }
        }else{
            var lines = []
            $wrappers.each(function(){
                var line = {};

                $(this).find('input').each(function(){
                    line[$(this).attr('name')] = $(this).val();
                });

                lines.push(line);
            });

            data['lines'] = lines;
        }
        return data;
    }

    function saveElement(id, data){
        $.ajax({
            url: 'update.php?id='+id,
            method: 'POST',
            data: {
                data: JSON.stringify(data)
            }
        }).done(function (data){
            $('.modal').modal('hide');
            if(data == 1){
                var $alert = $('<div class="col-lg-12"><div class="alert alert-success"><strong>Success!</strong> Elements modified.</div></div>');
            }else{
                var $alert = $('<div class="col-lg-12"><div class="alert alert-danger"><strong>Error!</strong> Elements not modified.</div></div>');
            }

            $('#btn-save').closest('.row').append($alert);
            setTimeout(function(){ $alert.remove() }, 2000);
        })
    }

    function elementsInit(elements){
        $.ajax({
            url: 'load.php',
        }).done(function(data){
            width = $('#grid').width();
            height = $('#grid').height();

            if(data != ""){
                $('#serialized').jsonViewer(elements);
                elements = JSON.parse(data);
                for (var i = 0; i < elements.length; i++) {
                    createElement(elements[i]);
                }
            }
        });
    }

    function createElement(element) {
        console.log(width, height);
        var $element = $(
            '<div class="element" data-id="' + element.id + '" data-type="' + element.type + '">' +
            '<button class="btn btn-link btn-delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
            '<button class="btn btn-link btn-edit"><i class="fa fa-pencil" aria-hidden="true"></i></button>' +
            '</div>'
        );

        $('#grid').append($element);

        $element.css({
            position:'absolute',
            width: ((element.width / 100) * width) + 'px',
            height: ((element.height / 100) * height) + 'px',
            background: types[element.type].color,
            left: ((element.x / 100) * width) + 'px',
            top: ((element.y / 100) * height) + 'px'
        });




        elementDraggable($element);
        elementResizable($element, types[element.type]);
    }

    function elementDraggable($element) {
        $element.draggable({
            stop: function (event, ui) {
                store();
            },
            drag: function (event, ui) {
                //console.log(ui.position.top,(height - $(event.target).outerHeight()));
                //console.log(ui.position.left,(width - $(event.target).outerWidth()));

                var top = Math.min(Math.max(0, ui.position.top), (height - $(event.target).outerHeight()));
                var left = Math.min(Math.max(0, ui.position.left), (width - $(event.target).outerWidth()));


                ui.position.top = top;
                ui.position.left = left;
            }
        });
    }

    function elementResizable($element, type){
        var elWidth = $element.outerWidth();
        var elHeight = $element.outerHeight();

        $element.resizable({
            aspectRatio: type.ratio,
            minHeight: (type.resizeY ? null : elHeight),
            maxHeight: (type.resizeY ? null : elHeight),
            minWidth: (type.resizeX ? null : elWidth),
            maxWidth: (type.resizeX ? null : elWidth),
            resize: function (event, ui){
                ui.size.height = Math.min(ui.size.height, (height - ui.position.top));
                ui.size.width = Math.min(ui.size.width, (width - ui.position.left));

            },
            stop: function (event, ui){
                store();
            }

        });
    }

    function store() {
        //var elements = serialize();

        //$('#serialized').jsonViewer(elements);
    }

    function serialize() {
        var elements = [];
        $('#grid .element').each(function () {

            elements.push({
                id: $(this).data('id'),
                type: $(this).data('type'),
                x: ($(this).position().left / width) * 100,
                y: ($(this).position().top / height) * 100,
                width: ($(this).outerWidth() / width) * 100,
                height: ($(this).outerHeight() / height) * 100
            });
        });

        return elements;
    }

    function createToolbar(){
        for (var type in types) {
            $('#toolbar').append('<button class="btn" data-type="'+type+'" style="background:'+types[type].color+'">Add \''+types[type].caption+'\'</button>');
        }
    }


    elementsInit();
    createToolbar();

});