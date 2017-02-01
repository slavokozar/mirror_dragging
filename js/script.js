$(function() {
    var width = $('#grid').width();
    var height = $('#grid').height();

    $('#serialized').jsonViewer(elements);

    for (var i = 0; i < elements.length; i++) {
        createElement(elements[i].type, elements[i].x, elements[i].y);
    }


    $(document).on('click', '.btn-delete', function (e) {
        $(e.target).closest('.element').remove();
        store();
    });

    $(document).on('click', '#toolbar .btn', function (e) {
        var type = $(e.target).closest('.btn').data('type');
        var x = 0;
        var y = 0;
        createElement(type, x, y);
        store();
    })

    function createElement(type, x, y) {
        var $element = $(
            '<div class="element element-' + type + '" data-type="' + type + '">' +
            '<button class="btn btn-link btn-delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>' +
            '</div>'
        );

        $('#grid').append($element);

        $element.css({
            top: x + '%',
            left: y + '%'
        });

        elementDraggable($element);
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
                x: ($(this).offset().left / width) * 100,
                y: ($(this).offset().top / height) * 100
            });
        });

        return elements;
    }
});

