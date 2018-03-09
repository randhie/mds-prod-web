var services = (function(){
	method = {};
	
	method.init = function() {
		var img = $('<img>');
		img.attr({src: '/mdstudioweb/viewPhoto.pics?directoryType=adminMiscType&fileName=brochure.jpg'});
		img.addClass('img-responsiv banner-size');
		
		$('#photoPackage').append(app.showLoading());
		img.load(function(){
			$('#photoPackage').append(img).find('#loading').remove();
		});
	};
	
	return method;
	
}(jQuery));



$(document).ready(function(){
	services.init();
});