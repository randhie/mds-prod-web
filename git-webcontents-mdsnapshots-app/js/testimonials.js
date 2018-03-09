var testimonials = (function(){
	method = {};

	method.init = function () {
		$('#writeBtn').unbind().click(function(){
			$('.form, #cancelBtn').removeClass('hide');
			$('#testimonialContent').addClass('hide');
			$(this).addClass('hide');
			$('#paging').addClass('hide');
		});
	
		$('#cancelBtn').unbind().click(function(){
			$('.form').addClass('hide');
			$('#testimonialContent, #writeBtn').removeClass('hide');
			$(this).addClass('hide');
			$('#paging').removeClass('hide');
		});
	
		$('#backBtn, #nextBtn').unbind().click(function(){
			$(this).closest('ul').find('li').removeClass('active');
		});
		
		$('#submitBtn').unbind().click(function(){
			$(this).attr('disabled', 'disabled').text('Please wait..');
			$('#testimonialForm div').removeClass('has-error').removeClass('has-feedback');
			$('.control-label').remove();
			$.post('/mdstudioweb/createTestimonial.jctl', $('form[name=testimonialForm]').serialize() ,function(result){
				$('#submitBtn').removeAttr('disabled').text('Submit');
				if (result.isSuccess) {
					window.location.href = '#/testimonials';
					location.reload();
				}
				else {
					if (result.fieldErrors != undefined && result.fieldErrors.length > 0) {
						$.each(result.fieldErrors, function(idx, error){
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
	
	
	method.getTestimonials = function(page) {
		$.post('/mdstudioweb/getAllTestimonial.jctl', 
				{
				'page': page,
				limit: 10
				} ,function(result){
			if (result.isSuccess) {
				if (result.userTestimonialList != undefined && result.userTestimonialList.length > 0) {
					testimonials.populateTesti(result.userTestimonialList);
					testimonials.paging(page, result.hasMore);
				}
			}
			
		});
	};
	
	method.populateTesti = function(testimonial) {
		$.each(testimonial, function(idx, testi){
			var divLeft = $('<div>').addClass('col-md-3');
			var h5 = $('<h5>');
			h5.append($('<strong>').html(testi.firstName + '&nbsp;' + testi.lastName + '<br/>'));
			h5.append(testi.dateCreated);
			divLeft.append(h5);
			
			var divRight = $('<div>').addClass('col-md-9 buttom-margin');
			var p = $('<p>').addClass('text-justify');
			p.append(testi.message);
			divRight.append(p);
			
			var div = $('<div>').addClass('col-md-12 testi-display');
			div.append(divLeft).append(divRight);
			$('#testimonialContent').append(div);
		});
	};
	
	
	method.paging = function(page, hasMore) {
		if (page == 1) {
			$('#backBtn').addClass('hide');
		}
		else {
			$('#paging').removeClass('hide');
			$('#backBtn').removeClass('hide');
			
			$('#backBtn').unbind().click(function(){
				var backPageVal = eval(page) - eval(1);
				window.location.href = '#/testimonials/' + backPageVal;
			});
			
			if (hasMore == undefined) {
				$('#nextBtn').addClass('hide');
			}
		}
		
		if (hasMore) {
			$('#paging').removeClass('hide');
			
			$('#nextBtn').unbind().click(function(){
				var nextPageVal = eval(page) + eval(1);
				window.location.href = '#/testimonials/' + nextPageVal;
			});
		}
	};
	
	
	return method;
}(jQuery));




$(document).ready(function(){
	testimonials.init();
//	testimonials.getTestimonials();
});