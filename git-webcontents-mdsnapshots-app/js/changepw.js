var changepw = (function(){
	method = {};
	
	method.init = function() {
		$('#pwChangeForm').unbind().submit(function(){
			$.post('/mdstudioweb/processChangePw.jctl', $('#pwChangeForm').serialize(),function(result){
				if (result.isSuccess) {
					$('#pwChangeForm').slideUp(function(){
						$('#successMsg').slideDown();
					});
				}
				else {
					$('div').removeClass('has-error');
					$('label[for*=Error]').addClass('hide').empty();
					if (result.fieldErrors != undefined && result.fieldErrors.length > 0) {
						$.each(result.fieldErrors, function(fld, error){
							$('#' + error.field).closest('div').addClass('has-error');
							$('label[for="' +  error.field + 'Error"]').removeClass('hide').text(error.msg);
						});
						
					}
					else if (result.error != undefined) {
						$('#currentPw').prev().removeClass('hide').text(result.error.msg);
						$('#currentPw').closest('div').addClass('has-error');
					}
				}
				
			});
		});
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	changepw.init();
});