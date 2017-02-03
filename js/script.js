$(function() {
    var width = 0;
    var height = 0;

    var types = {
        'a' : {
            width: 100,
            height: 100,
            ratio: true,
            color: '#f00',
            caption: 'MHD'
        },
        'b' : {
            width: 100,
            height: 100,
            ratio: true,
            color: '#ff0',
            caption: 'Hodiny'
        },
        'c' : {
            width: 100,
            height: 100,
            ratio: false,
            color: '#0ff',
            caption: 'Správy'
        },
        'd' : {
            width: 100,
            height: 100,
            ratio: false,
            color: '#f0f',
            caption: 'Nieco'
        },
        'e' : {
            width: 100,
            height: 100,
            ratio: false,
            color: '#00f',
            caption: 'Daco'
        }
    };

    var elements = [
        {
            type: 'a',
            x: 10,
            y: 10,
            width: 100,
            height: 100
        },
        {
            type: 'c',
            x: 50,
            y: 10,
            width: 100,
            height: 100
        },
        {
            type: 'e',
            x: 50,
            y: 50,
            width: 100,
            height: 100
        }
    ];

    $(document).on('click', '.btn-delete', function (e) {
        console.log('ref');
        $(e.target).closest('.element').remove();
        store();
    });

    $(document).on('click', '#toolbar .btn', function (e) {
        var type = $(e.target).closest('.btn').data('type');
        var x = 0;
        var y = 0;

        createElement({
            type: type,
            x: 0,
            y: 0,
            width: types[type].width,
            height: types[type].height
        });
        store();
    })

    function elementsStart(elements){
        width = $('#grid').width();
        height = $('#grid').height();

        $('#serialized').jsonViewer(elements);

        for (var i = 0; i < elements.length; i++) {
            createElement(elements[i]);
        }
    }

    function createElement(element) {
        var $element = $(
            '<div class="element" data-type="' + element.type + '">' +
            '<button class="btn btn-link btn-delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
            '</div>'
        );

        $('#grid').append($element);

        $element.css({
            position:'absolute',
            width: element.width + 'px',
            height: element.height + 'px',
            background: types[element.type].color,
            top: element.x + 'px',
            left: element.y + 'px'
        });

        elementDraggable($element);
        elementResizable($element, types[element.type].ratio);
    }

    function elementDraggable($element) {
        $element.draggable({
            stop: function (event, ui) {
                store();
            },
            drag: function (event, ui) {
                var top = Math.min(Math.max(0, ui.position.top), (height - $(event.target).height()));
                var left = Math.min(Math.max(0, ui.position.left), (width - $(event.target).width()));


                ui.position.top = top;
                ui.position.left = left;
            }
        });
    }

    function elementResizable($element, aspectRatio){

        $element.resizable({
            aspectRatio: aspectRatio,
            stop: function (event, ui){
                store();
            }
        });

    }

    function store() {
        var elements = serialize();


        $('#serialized').jsonViewer(elements);


    }

    function serialize() {
        var elements = [];
        $('#grid .element').each(function () {
            $(this);
            elements.push({
                type: $(this).data('type'),
                x: $(this).offset().left,
                y: $(this).offset().top,
                width: $(this).outerWidth(),
                height: $(this).outerHeight()
            });
        });

        return elements;
    }

    function createToolbar(){
        for (var type in types) {
            $('#toolbar').append('<button class="btn" data-type="'+type+'" style="background:'+types[type].color+'">Add \''+type+'\'</button>');
        }
    }


    elementsStart(elements);
    createToolbar();

});