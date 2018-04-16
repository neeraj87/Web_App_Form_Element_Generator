$(document).ready(function(){
	var inputVar =
	'<div main_div_id  main_div_cls>\n'+
	'	<ul>\n'+
	'		<li>\n'+
	'			<label for="label_for">input_label</label>\n'+
	'			inner_element' +
	'		</li>\n'+
	'	</ul>\n'+
	'</div>';

	var inputTextVar = '<input type="input_type" id="input_id" class="form-control input_classes" name="input_name" value="input_val"/>\n';
	var textareaVar = '<textarea type="input_type" id="input_id" name="input_name" style="width:100%;height:75px;"></textarea>\n';

	var selectVar =
	'<select id="input_id" name="input_name">\n'+
	'	<option th:each="option : ${T(in.surgeri.model.enums.ENUM_CLASS_NAME).values()}" th:value="${option}" th:text="${option.type}" th:attr="selected = ${surgery.PLACEHOLDER} == ${option} ? \'selected\' : null"></option>\n'+
	'</select>\n';

	var radioVar =
	'<div class="row" style="margin-top:1%;">\n'+
	'	<div class="input_classes" th:each="option : ${T(in.surgeri.model.enums.ENUM_CLASS_NAME).values()}">\n'+
	'		<div class="radio radio-primary">\n'+
	'			<input name="input_name" type="radio" th:id="${option.toString()}" th:value="${option}" />\n'+
	'			<label th:for="${option.toString()}" th:text="${option.type}"></label>\n'+
	'		</div>\n'+
	'	</div>\n'+
	'</div>\n';

	var checkboxVar =
	'<div class="row" style="margin-top:1%;">\n'+
	'	<div class="input_classes" th:each="option : ${T(in.surgeri.model.enums.ENUM_CLASS_NAME).values()}">\n'+
	'		<div class="checkbox checkbox-custom checkbox-circle">\n'+
	'			<input name="input_name" type="checkbox" th:id="${option.toString()}" th:value="${option}" />\n'+
	'			<label th:for="${option.toString()}" th:text="${option.type}"></label>\n'+
	'		</div>\n'+
	'	</div>\n'+
	'</div>\n';

	$('#div-enum-class-name').hide();

	$('#addDivClass').on('click', function(){
		var divClassString = $('#main-div-class').val();
		divClassString += ' ' + $("#bootstrap-col-type option:selected").val() + $("#bootstrap-col-val option:selected").val();
		divClassString = divClassString.trim();
		$('#main-div-class').val(divClassString);
	});

	$('#addDivClassToHTML').on('click', function(){
		var divClassString = $('#elem-class-attribute').val();
		divClassString += ' ' + $("#elem-bootstrap-col-type option:selected").val() + $("#elem-bootstrap-col-val option:selected").val();
		divClassString = divClassString.trim();
		$('#elem-class-attribute').val(divClassString);
	});

	$('#elem-type').on('change', function(){
		if($('option:selected',this).val() == 'radio' || $('option:selected',this).val() == 'checkbox' || $('option:selected',this).val() == 'select'){
			$('.input-parent-divs').hide();
			$('#div-enum-class-name').show();
		} else {
			$('.input-parent-divs').show();
			$('#div-enum-class-name').hide();
		}
	});

	$('#gen-block-btn').on('click', function(){
		var elementTypeVal = $('#elem-type option:selected').val();
		var elementTypeText = $('#elem-type option:selected').text();
		var inputTypeVar = inputVar;

		if(elementTypeText == 'Text' || elementTypeText == 'Hidden') {
			inputTypeVar = inputTypeVar.replace('inner_element', inputTextVar);
		} else if(elementTypeText == 'Textarea') {
			inputTypeVar = inputTypeVar.replace('inner_element', textareaVar);
		} else if(elementTypeText == 'Radio') {
			inputTypeVar = inputTypeVar.replace('inner_element', radioVar);
			inputTypeVar = inputTypeVar.replace('ENUM_CLASS_NAME', $('#elem-enum-attribute').val());
		} else if(elementTypeText == 'Checkbox') {
			inputTypeVar = inputTypeVar.replace('inner_element', checkboxVar);
			inputTypeVar = inputTypeVar.replace('ENUM_CLASS_NAME', $('#elem-enum-attribute').val());
		} else if(elementTypeText == 'Select') {
			inputTypeVar = inputTypeVar.replace('inner_element', selectVar);
			inputTypeVar = inputTypeVar.replace('ENUM_CLASS_NAME', $('#elem-enum-attribute').val());
		}

		inputTypeVar = inputTypeVar.replace('main_div_id', $('#main-div-id').val() != '' ? 'id="' + $('#main-div-id').val() + '"' : '');
		inputTypeVar = inputTypeVar.replace('main_div_cls', $('#main-div-class').val() != '' ? 'class="' + $('#main-div-class').val() + '"' : '');
		inputTypeVar = inputTypeVar.replace('input_type', elementTypeVal);
		inputTypeVar = inputTypeVar.replace('label_for', $('#elem-id-attribute').val());
		inputTypeVar = inputTypeVar.replace('input_id', $('#elem-id-attribute').val());
		inputTypeVar = inputTypeVar.replace('input_label', $('#elem-label-attribute').val());
		inputTypeVar = inputTypeVar.replace('input_name', $('#elem-name-attribute').val());
		inputTypeVar = inputTypeVar.replace('input_val', $('#elem-val-attribute').val());
		inputTypeVar = inputTypeVar.replace('input_classes', $('#elem-class-attribute').val());

		$('#container').val(inputTypeVar);
	});

	$('#clear-btn').on('click', function(){
		$('form#html-gen-form input').each(function(){
			$(this).val('');
		});
		$('#container').val('');
	});
});
