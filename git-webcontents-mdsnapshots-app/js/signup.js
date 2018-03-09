var signup = (function(){
	method = {};
	
	method.init = function() {
		$('#signupForm').unbind().submit(function(){
			$.post('/mdstudioweb/signup', $('#signupForm').serialize(),function(result){
				if (result.isSuccess) {
					$('#successMsg .bluetext').html($('#emailAddress').val());
					$('#signupForm').slideUp(function(){
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
						$('#emailAddress').prev().removeClass('hide').text(result.error.msg);
						$('#emailAddress').closest('div').addClass('has-error');
					}
				}
				
			});
		});
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	signup.init();
});