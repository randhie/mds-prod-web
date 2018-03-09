var index = (function(){
	method = {};
	
	method.init = function(){
//		app.getAllPortfolio();
		
		// get all portfolio
		var postObj = {};
		postObj['url'] = '/mdstudioweb/getPhotoByCategoryType.jctl';
		
		var data = {};
		data['categoryType'] = 2;
		data['onlyList'] = true;
		data['photoType'] = ['2'];
		postObj['data'] = data;
		
		var result = app.doPost(postObj);
		if (result != undefined) {
			if (result.isSuccess) {
				index.populatePortFolioCover(result);
			}
		}
		
		// get all preview
		postObj = {};
		postObj['url'] = '/mdstudioweb/getAllPreviewPhotos.jctl';
		result = app.doPost(postObj);
		if (result != undefined) {
			if (result.isSuccess) {
				index.populateAllPreviewPhotos(result);
			}
		}
		
	};
	
	
	method.populatePortFolioCover = function(result) {
		if (result != undefined && result.photoGatherer != undefined) {
			if (result.photoGatherer.length > 0) {
				
				$('#portfolio').removeClass('hide');
				var ctr = 0;
				var divContainer = '';
				var count = 0;
				$.each(result.photoGatherer, function(idx, pg){
					ctr++;
					count++;
					if (ctr == 1) {
						divContainer = $('<div>').addClass('container-fluid');	
					}
					
					
					var div = $('<div>').addClass('col-md-4');
					var img = $('<img>').addClass('img-responsive img-thumbnail pointer portfolio-album');
					img.attr({src: '/mdstudioweb/viewPhoto.pics?isThumbnail=true&directoryType=' + pg.category.toLowerCase() + 'Type&fileName=' + pg.directory + '/' + pg.photoInfoList[0] + '&photoId=' + pg.photoInfoList[1], title: pg.directory});
					var p = $('<p>').addClass('lobster-font').css('font-size', '25px').text(pg.directory);
					
					div.append(img).append(p);
					divContainer.append(div);
					
					if (ctr == 3 || count == result.photoGatherer.length) {
						$('#portfolio').append(divContainer);
						divContainer = '';
						ctr = 0;
						
						var clearfix = $('<div>').addClass('clearfix buttom-margin');
						$('#portfolio').append(clearfix);
					}
					
					img.unbind().click(function(){
						window.location.href = '/#/portfolio/' + $(this).attr('title');
					});
				});
			}
		}
	};
	
	
	method.populateAllPreviewPhotos = function (result) {
		if (result.photoGatherer != undefined) {
			if (result.photoGatherer.length > 0) {
				var ctr = 0;
				$.each(result.photoGatherer, function(idx, pg){
					ctr++;
					var subCategorySplit = pg.category.split('|');
					var subCategory = subCategorySplit[1];
					var divContent = $('<div>').addClass('col-md-3 img-top-margin');
					var div = $('<div>');
					var a = $('<a>').attr({href: '/#/photoarchives/' + subCategory + '/' + pg.directory});
					

					var divLabel = $('<div>');
					var label = $('<label>').text(pg.directory.replace(/_/g, ' '));
					
					$.each(pg.photoInfoList, function(dx, photo){
						var img = $('<img>').addClass('img-responsive img-thumbnail');
						img.attr({src: '/mdstudioweb/viewPhoto.pics?isThumbnail=true&directoryType=previewType&fileName=' + subCategory + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId});
						a.append(img);
						
						div.append(a);
						divContent.append(div);
					});
					
					$('#newShotsAdded').append(divContent);
					
					if (ctr == 4) {
						var clearfix = $('<div>').addClass('clearfix');
						$('#newShotsAdded').append(clearfix);
						ctr = 0;
					}
					
				});
			}
		}
	};
	
	
	method.populateNewPreviewPhotos = function(previewPhotos){
		var maxCols = 12;
		var minCols = 0;
		
		$.each(previewPhotos, function(idx, photo){
			var divContent = $('<div>');
			divContent.addClass('col-md-3 img-top-margin');
			
			divImg = $('<div>');
			var a = $('<a>');
			a.attr({href: '#/photoarchive/' + photo.parentDirectory + '/' + photo.directoryName});
			
			var img = $('<img>');
			img.attr({src: photoPreviewPrefix + photo.parentDirectory + '/' + photo.directoryName + '/' + photo.fileName + '&photoId=' + photo.photoId});
			img.addClass('img-responsive img-thumbnail');
			
			a.append(img);
			divImg.append(a);
			
			var divLabel = $('<div>');
			var label = $('<label>').append(photo.directoryName.replace(/_/g, ' '));
			divLabel.append(label);
			
			divContent.append(divImg).append(divLabel);
			
			$('#newShotsAdded').append(divContent);
			minCols += 3;
			
			if (minCols == maxCols) {
				minCols = 0;
				var div2 = $('<div>');
				div2.addClass('clearfix');
				$('#newShotsAdded').append(div2);
				
			}
			
			
		});
		
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	index.init();
//	index.getAllNewPreviewPhotos();
	/*app.getAllPortfolio();*/
	//baby
	//kids
	//Adults
	//beauty
	//fashion
	//cosplay
	//commercial
	//landscapes
	//nature
	//events
	
	
});