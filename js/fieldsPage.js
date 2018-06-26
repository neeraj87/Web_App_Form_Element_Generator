$(document).ready(function(){
    var jsonVar = [];

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    $('#sub-types').hide();

    $('#gen-json-btn').on('click', function(){
        if($('#element-label').val() == '') {
            toastr["error"]("Missing Field", "Error");
            return;
        }
        jsonVar.push({
            id : generateUUID(),
            label : $('#element-label').val(),
            field : $('#element-type').find('option:selected').val(),
            rendered : $('#element-rendered').prop('checked'),
            options : getSubTypesJSObj($('#element-type').find('option:selected').val()),
            required : $('#element-required').prop('checked'),
            placeholder : $('#element-placeholder').val(),
            error_text : $('#element-error-text').val(),
        });
        $('#jsonContainer').text(JSON.stringify(jsonVar, undefined, 2));
        toastr["success"]("Field added to JSON", "Success");
        clearForm();
    });
});

$(document).on('change', '#element-type', function(){
    var value = $(this).val();
    if(value == 'select' || value == 'checkbox' || value == 'radio') {
        $('#sub-types').show();
    } else {
        $('#sub-types').hide();
    }
});

$(document).on('click', '#add-sub-type', function(){
    var myvar = '<div class="row mt-2">'+
    '<input type="text" name="label" class="form-control col-md-5" placeholder="label"/>'+
    '<input type="text" name="value" class="form-control col-md-5" placeholder="value"/>'+
    '<button type="button" class="btn btn-danger btn-sm col-md-2 remove-this-btn"><ion-icon name="close"></ion-icon></button>'+
    '</div>';

    $('#sub-type-body').append(myvar);
});

$(document).on('click', '#clear-btn', function(){
    clearForm();
});

$(document).on('click', '.remove-this-btn', function(){
    $(this).parent().remove();
});

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function getSubTypesJSObj(element) {
    var subTypes = [];
    if(element == 'select' || element == 'checkbox' || element == 'radio') {
        $('div#sub-type-body div.row').each(function(){
            subTypes.push({
                id : generateUUID(),
                label : $(this).children('input[name="label"]').val(),
                value : $(this).children('input[name="value"]').val()
            });
        });
    }
    return subTypes;
}

function clearForm() {
    $('#element-label').val('');
    $('#element-placeholder').val('');
    $('#element-error-text').val('');
    $('#element-required').prop('checked', false);
    $('div#sub-type-body div.row').each(function(){
        $(this).remove();
    });
    $('#element-type').find('option:eq(0)').attr('selected', 'selected');
    $('#sub-types').hide();
}