var booking = (function(){
	method = {};
	
	method.submitBooking = function(){
		$('#desiredDate').datepicker();
		$('#submitBtn').unbind().click(function(){
			$.post('/mdstudioweb/requestEvent.jctl', $('#bookingForm').serialize(),function(result){
				if (result.isSuccess) {
					$('#booking2').append($('#successMsg'));
					$('.form-booking').addClass('hide');
					
					booking.anotherBooking();
				}
				else {
					if (result.fieldErrors != undefined && result.fieldErrors.length > 0) {
						$.each(result.fieldErrors, function(idx, error){
							if (error.code === 'typeMismatch') {
								return true;
							}
							
							var label = $('<label>');
							label.attr({'for': error.field}).text(error.msg);
							label.addClass('control-label');
							
							$('#' + error.field).before(label);
							$('#' + error.field).closest('div').addClass('has-error has-feedback');
						});
					}
				}
			});
		});
	};
	
	
	method.anotherBooking = function() {
		$('#requestAgainBtn').unbind().click(function(){
			location.reload();
		});
	};
	return method;
}(jQuery));



$(document).ready(function(){
//	$('#owl-example').owlCarousel({
//		autoPlay: true
//	});
	
	booking.submitBooking();
});