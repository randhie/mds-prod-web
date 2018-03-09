var test = (function($){
	method = {};
	
	
	method.init = function () {
//		$.post('/mdstudioweb/getAllPhotoCategories.jctl', function(result){
//			if (result.isSuccess) {
//				
//			}
//		});
//		
//		$.post('/mdstudioweb/getAllPhotoCoversByCategory.jctl', {'category': 'Portraits'} ,function(result){
//			if (result.isSuccess) {
//				
//			}
//		});
//		
//		
//		$.post('/mdstudioweb/getAllPhotoss.jctl', {'category': 'Portraits', 'directory': 'Mirinee_Chaye'} ,function(result){
//			if (result.isSuccess) {
//				
//			}
//		});
		
//		$.post('/mdstudioweb/processPortofolioPhotos.jctl', function(result){
//			if (result.isSuccess) {
//				
//			}
//		});
		
//		$.post('/mdstudioweb/processPreviewPhotos.jctl', function(result){
//			if (result.isSuccess) {
//				
//			}
//		});
		
//		$.post('/mdstudioweb/cleanPhotoArchives.jctl', function(result){
//			if (result.isSuccess) {
//				
//			}
//		});
		
		
		
		$.post('/mdstudioweb/cleanupData.jctl', function(result){
			if (result.isSuccess) {
				
			}
		});
		
	};
	return method;
	
}(jQuery));


$(document).ready(function(){
	test.init();
});