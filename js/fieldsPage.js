
var text = 
'<div class="form-group">'+
'<label for="label_for">label_name</label>'+
'<input type="text" class="form-control" id="input_id" placeholder="placeholder">'+
'</div>';

var textArea = 
'<div class="form-group">'+
'<label for="label_for">label_name</label>'+
'<textarea type="text" class="form-control" id="label_for" placeholder="placeholder"s></textarea>'+
'</div>';
	

$(document).ready(function(){
    var jsonVar = [];
    var jsTreeDataArray = [];
    var sectionObjArray = [];

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

    new ClipboardJS('#copy-json');

    $('#sub-types').hide();

    $('#gen-json-btn').on('click', function(){
        if($('#element-label').val() == '') {
            toastr["error"]("Missing Field", "Error");
            return;
        }
        var id = generateUUID();
        var fieldType = $('input[name="element-type"]:checked').val();

        var elementObj = {
            id : id,
            label : $('#element-label').val(),
            attribute : $('#element-attribute').val() == '' ? null : $('#element-attribute').val(),
            parent_id : null,
            section : {
                label : $('#element-section').find('option:selected').text(),
                id : $('#element-section').find('option:selected').val()
            },
            field : fieldType,
            rendered : $('#element-rendered').prop('checked'),
            options : getSubTypesJSObj(fieldType),
            required : $('#element-required').prop('checked'),
            placeholder : $('#element-placeholder').val(),
            error_text : $('#element-error-text').val()
        };

        jsonVar.push(elementObj);
        $('#jsonContainer').text(JSON.stringify(jsonVar, undefined, 2));
        toastr["success"]("Field added to JSON", "Success");

        if(fieldType == 'radio' || fieldType == 'checkbox' || fieldType == 'select') {
            $('#field-list').append($("<option></option>").attr("value",id).text($('#element-label').val()));
        }
        $('#connected-field').append($("<option></option>").attr("value",id).text($('#element-label').val()));
        clearForm();
    });

    $('#new-section').on('click', function(){
        bootbox.prompt({
            title: "Create new section",
            inputType: 'text',
            callback: function (result) {
                if(result == '' || result == 'null') {
                    return;
                }
                sectionObjArray.push({
                    label : result,
                    value : generateUUID()
                });

                $('#element-section').empty();
                $('#element-section').append($("<option></option>").attr("value", "").text("None"));
                for(var i = 0; i < sectionObjArray.length; i++) {
                    $('#element-section').append($("<option></option>").attr("value",sectionObjArray[i].value).text(sectionObjArray[i].label));
                }
                toastr["success"]("New Section Created", "Success");
            }
        });
    });

    $('#field-list').on('change', function(){
        $('#field-options').empty();
        jsTreeDataArray = [];
        var parentId = $(this).find('option:selected').val();
        var fieldObject = jsonVar.find(v => v.id === parentId);
        var suboptions = fieldObject.options;
        for(var i = 0; i < suboptions.length; i++) {
            var optionObj = suboptions[i];
            $('#field-options').append($("<option></option>").attr("value",optionObj.id).text(optionObj.label));
        }
    });

    $('#connect').on('click', function(){
        var parentId = $('#field-list').find('option:selected').val();
        var optionId = $('#field-options').find('option:selected').val();
        var connectedFieldId = $('#connected-field').find('option:selected').val();

        var optionsArrayObj = jsonVar.find(v => v.id === parentId).options;
        var selectedOptionObj = optionsArrayObj.find(v => v.id === optionId);
        var connectedFieldObj = jsonVar.find(v => v.id === connectedFieldId);

        console.log('-------- optionsArrayObj: ' + JSON.stringify(optionsArrayObj));
        console.log('-------- selectedOptionObj: ' + JSON.stringify(selectedOptionObj));
        console.log('-------- connectedFieldObj: ' + JSON.stringify(connectedFieldObj));

        connectedFieldObj.parent_id = selectedOptionObj.id;

        if(selectedOptionObj.on_check == null) {
            var onCheckIdArray = [];
            onCheckIdArray.push(connectedFieldObj.id);
            selectedOptionObj.on_check = onCheckIdArray;
        } else {
            selectedOptionObj.on_check.push(connectedFieldObj.id);
        }

        $('#jsonContainer').text(JSON.stringify(jsonVar, undefined, 2));
        toastr["success"]("Fields connected", "Success");
    });
});

$(document).on('change', 'input[name="element-type"]', function(){
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
    '<input type="number" name="order" class="form-control col-md-1"/>'+
    '<button type="button" class="btn btn-danger btn-sm col-md-1 remove-this-btn"><ion-icon name="close"></ion-icon></button>'+
    '</div>';

    $('#sub-type-body').append(myvar);
});

$(document).on('click', '#clear-btn', function(){
    clearForm();
});

$(document).on('click', '.remove-this-btn', function(){
    $(this).parent().remove();
});

$(document).on('blur', '#element-label', function(){
    if($(this).val() != '') {
        var label = $(this).val().replace(/[\. ,:-]+/g, " ");
        $('#element-attribute').val(toTitleCase(label).replace(/ /g,""));
    }
});

$(document).on('blur', 'input[name="label"]', function(){
    if($(this).val() != '') {
        $(this).siblings('input[name="value"]').val($(this).val().toUpperCase().replace(/[\. ,:-]+/g,"_"));
    }
});

$(document).on('click', '#fake', function(){
    var testJSON = [];
    for(var i = 0; i < 131; i++) {
        testJSON.push({
            id : generateUUID(),
            label : 'Label - ' + i,
            attribute : 'LABEL_ATT_' + i,
            parent_id : null,
            section : {
                label : 'None',
                id : ''
            },
            field : 'text',
            rendered : true,
            options : [],
            required : false,
            placeholder : 'placeholder for Label - ' + i ,
            error_text : 'Enter this field'
        });
    }
    $('#jsonContainer').text(JSON.stringify(testJSON, undefined, 2));
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
            var order = $(this).children('input[name="order"]').val();
            subTypes.push({
                id : generateUUID(),
                label : $(this).children('input[name="label"]').val(),
                value : $(this).children('input[name="value"]').val(),
                order : order != undefined ? parseInt(order) : 0,
                default : false,
                on_check : null
            });
        });
    }
    return subTypes;
}

function clearForm() {
    $('#element-label').val('');
    $('#element-attribute').val('');
    $('#element-placeholder').val('');
    $('#element-error-text').val('');
    $('#element-required').prop('checked', false);
    $('div#sub-type-body div.row').each(function(){
        $(this).remove();
    });
    $('#radio1').prop('checked', true);
    $('#sub-types').hide();
}

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

function displayElementPreview(elementObj) {
    var element;
    if(elementObj.field == 'text') {
        element = text;
        element = element.replace('label_for', elementObj.id);
        element = element.replace('input_id', elementObj.id);
        element = element.replace('label_name', elementObj.label);
        element = element.replace('placeholder', elementObj.placeholder);
    } else if(elementObj.field == 'textarea') {
        element = textArea;
    }
    $('#elementHTML').html(element);
}