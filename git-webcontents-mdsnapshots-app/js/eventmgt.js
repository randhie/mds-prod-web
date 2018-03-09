var eventmgt = (function(){
	method = {};
	
	
	method.init = function () {
		$('#eventDate').datepicker();
	};
	
	method.submitForm = function () {
		$('#eventMgtForm').unbind().submit(function(){
			 var postObj = {};
			 postObj['url'] = '/mdstudioweb/processEventInfo.jctl';
			 
			 var data = $('#eventMgtForm').serialize();
			 postObj['data'] = data;
			 
			 var jsonResponse = app.doPost(postObj);
			 $('#eventMgtForm label').remove();
			 $('#eventMgtForm div').removeClass('has-error').removeClass('has-feedback');
			 
			 if (jsonResponse.isSuccess) {
				 location.reload();
			 }
			 else if (jsonResponse.status != undefined && jsonResponse.status == 404) {
				 window.location.href = '/#/index';
			 }
			 else if (jsonResponse.status != undefined && jsonResponse.status != 200 ) {
				 	app.alertError();
			 }
			 else {
				 if (jsonResponse.fieldErrors != undefined && jsonResponse.fieldErrors.length > 0) {
					 $.each(jsonResponse.fieldErrors, function(idx, error){
						 var label = $('<label>').addClass('control-label').text(error.msg);
						 $('#'+ error.field).before(label);
						 
						 if (error.code == 'typeMismatch') {
								 label.text('Required');
						 }
						 $('#' + error.field).closest('div').addClass('has-error has-feedback');
						 
					 });
				 }
			 }
		});
		
	};
	
	return method;
	
}(jQuery));



$(document).ready(function(){
	eventmgt.init();
	eventmgt.submitForm();
});