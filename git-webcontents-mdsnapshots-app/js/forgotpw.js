var forgotpw = (function(){
	method = {};
	
	method.init = function() {
		$('#forgotPwForm').unbind().submit(function(){
			$.post('/mdstudioweb/processResetPw.jctl', $('#forgotPwForm').serialize(),function(result){
				if (result.isSuccess) {
					$('#successMsg .bluetext').html($('#emailAddress').val());
					$('#forgotPwForm').slideUp(function(){
						$('#successMsg').slideDown();
					});
				}
				else {
					$('div').removeClass('has-error');
					$('label[for*=Error]').addClass('hide').text('&nbsp;');
					
					if (result.error != undefined) {
						$('#emailAddress').next().removeClass('hide').text(result.error.msg);
						$('#emailAddress').closest('div').addClass('has-error');
					}
				}
				
			});
		});
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	forgotpw.init();
});