var email = (function(){
	method = {};
	
	method.init = function() {
//		if (!userObj['user']) {
//			window.location.href = '#/index';
//		}
//		else if (userObj['user'] && !userObj['user'].admin) {
//			window.location.href = '#/index';  
//		}
//		else {
//			email.proceedToEmail();
//		}
		
		if (app.isAdmin()) {
			email.proceedToEmail();
		}
		else {
			window.location.href = '#/index';
		}
	};
	
	
	
	method.proceedToEmail = function () {
		var bar = $('.bar');
		var percent = $('.percent');
		var status = $('#status');
		   
		$('form').ajaxForm({
		    beforeSend: function() {
		        status.empty();
		        var percentVal = '0%';
		        bar.width(percentVal)
		        percent.html(percentVal);
		    },
		    uploadProgress: function(event, position, total, percentComplete) {
		        var percentVal = percentComplete + '%';
		        bar.width(percentVal)
		        percent.html(percentVal);
				//console.log(percentVal, position, total);
		    },
		    success: function() {
		        var percentVal = '100%';
		        bar.width(percentVal)
		        percent.html(percentVal);
		    },
			complete: function(xhr) {
				if (xhr.responseText.indexOf('true') > 0) {
					window.location.reload();
				}
				else if (xhr.responseText.indexOf('false') > 0) {
					$('.bar').css('width', '0%');
					status.html('* All fields are required');
				}
				else {
					status.html(xhr.responseText);
				}
				
//				var myObj = JSON.parse(xhr.responseText);
//				$.each(myObj, function(idx, val){
//					$.each(val, function(d, x){
//						alert(x.code);
//					});
//				});
				
			}
		}); 
		
	};
	
	return method;
	
	
	
}(jQuery));



$(document).ready(function(){
	email.init();
});