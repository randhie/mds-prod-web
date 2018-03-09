var page = 1;
var limit = 10;
var initializeInfinite = false;

var pa = (function($){
	method = {};
	
	
	method.init = function(){
		var url = photoarchiveUrl.split('/');
		if (photoarchiveUrl == undefined || photoarchiveUrl == '') {
			pa.getPhotoCategories();
			return false;
		}
		
		var span = $('<span>').addClass('lobster-font').css('font-size', '23px').text('Photo Archive');
		$('#categoryAlbum').append(span);
		
		switch (url.length) {
		case 1:
			pa.getAlbums(url);
			break;
		
		case 2:
			pa.getAllPhotos(url[0], url[1], page, limit);
			break;
			
		case 3:
			pa.getAllPhotos(url[0], url[1], url[2], limit);
			
		default:
			break;
		}
	};
	
	method.getPhotoCategories = function() {
		var postObj = {};
		postObj['url'] = '/mdstudioweb/getAllPhotoCategories.jctl';
		
		var data = {};
		data['categoryType'] = 0;
		postObj['data'] = data;
		
		var result = app.doPost(postObj);
		if (result.isSuccess) {
			pa.populateCategories(result);
		}
	};
	
	method.populateCategories = function(result) {
		if (result.photoCategories != undefined && result.photoCategories.length > 0) {
			$.each(result.photoCategories, function(idx, cat){
				var div = $('<div>').addClass('col-md-3 col-xs-6 buttom-margin');
				var img = $('<img>');
				img.addClass('img-responsive img-thumbnail pointer categories').attr({src: '/images/' + cat.toLowerCase() + '.jpg', title: cat});
				var caption = $('<div>');
				caption.text(cat);
				
				div.append(img).append(caption);
				$('#archives').append(div);
			});
			$('#archives').removeClass('hide');
			
			
			$('img.categories').unbind().click(function(){
				if ($(this).attr('title') != undefined) {
					window.location.href = '#/photoarchives/' + $(this).attr('title');
				}
			});
			
		}
		
	};
	
	method.getAlbums = function(cat) {
		if (cat != undefined) {
			var postObj = {};
			postObj['url'] = '/mdstudioweb/getAllPhotoCoversByCategory.jctl';

			var categories = {};
			categories['category'] = cat.toString();
			postObj['data'] = categories;
			
			var result = app.doPost(postObj);
			
			if (result != undefined) {
				pa.populateAlbums(result);
			}
			
			// BREADCRUMBS CATEGORY / PHOTO ALBUM 
			if (result.isSuccess && result.photoGathererList != undefined) {
				var categoryAlbumLink = $('<a>').attr({href: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font').text('Photo Archive');
				$('#categoryAlbum').html(categoryAlbumLink);
				
				categoryAlbumLink.unbind().click(function(){
					window.location.href = '/#/photoarchives';
				});
				
				var space = $('<span>').addClass('form-padding').text('/');
				var span = $('<span>').addClass('lobster-font').css('font-size', '23px').text(cat.toString());
				$('#photoAlbum').append(space).append(span);
			}
		}
	};
	
	
	method.populateAlbums = function (result) {
		if (result.isSuccess) {
			var maxCtr = 6;
			var ctr = 0;
			if (result.photoGathererList != undefined && result.photoGathererList.length > 0) {
				var category = '';
				$.each(result.photoGathererList, function(idx, pg){
					var div = $('<div>').addClass('col-md-2 col-xs-12 buttom-margin');
					var img = $('<img>');	
					img.addClass('img-responsive img-thumbnail pointer albums').attr({src: '/mdstudioweb/viewPhoto.pics?isThumbnail=true&directoryType=permType&fileName=' + pg.category + '/' + pg.directory + '/' + pg.photoInfoList[0].fileName + '&photoId=' + pg.photoInfoList[0].photoId, title: pg.directory});
					
					var caption = $('<div>');
					caption.text(pg.albumCaptionName);
					
					div.append(img).append(caption);
					$('#albums').append(div);
					
					ctr++;
					if (ctr == maxCtr) {
						ctr = 0;
						var clear = $('<div>').addClass('clearfix');
						$('#albums').append(clear);
					}
					
					if (category == '') {
						category = pg.category;
					}
					
				});
				
				$('#albums').removeClass('hide');
				$('img.albums').unbind().click(function(){
					window.location.href = '#/photoarchives/' + category + '/' + $(this).attr('title');
				});
			}
		}
	};
	
	
	method.getAllPhotos = function(category, directory, page, limit) {
		if (category != undefined && directory != undefined) {
			var postObj = {};
			postObj['url'] = '/mdstudioweb/getAllPhotoss.jctl';

			var data = {};
			data['category'] = category;
			data['directory'] = directory;
			data['page'] = eval(page);
			data['limit'] = eval(limit);
			postObj['data'] = data;
			
			var result = app.doPost(postObj);
			if (result != undefined) {
				if (result.isSuccess) {
					pa.populatePhotos(result);
					
					// BREADCRUMBS PHOTO ARCHIVE / CATEGORY / ALBUM
					if (result.photoGatherer != undefined && result.photoGatherer.photoInfoList != undefined) {
						if (result.photoGatherer.photoInfoList.length > 0) {
							if ($('#photoAlbum').empty() && $('#folder').empty()) {
								var categoryAlbumLink = $('<a>').attr({href: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font').text('Photo Archive');
								$('#categoryAlbum').html(categoryAlbumLink);
								
								categoryAlbumLink.unbind().click(function(){
									window.location.href = '/#/photoarchives';
								});
								
								var space = $('<span>').addClass('form-padding').text('/');
								var categoryLink = $('<a>').attr({href: 'javascript:void(0);'}).addClass('lobster-font').css('font-size', '23px').text(category.toString());
								$('#photoAlbum').append(space).append(categoryLink);
								categoryLink.unbind().click(function(){
									window.location.href = '/#/photoarchives/' + category.toString();
								});
								
								var albumLink = $('<span>').addClass('form-padding lobster-font').css('font-size', '23px').text(result.photoGatherer.albumCaptionName);
								var space = $('<span>').addClass('form-padding').text('/');
								$('#folder').append(space).append(albumLink);	
							}
						}
					}
					
				}
			}
		}
	};
	
	
	var init = true;
	method.populatePhotos = function(result){
		if (result.photoGatherer == undefined) {
			window.location.href = '/#/index'
			return true;
		}
		
		var pg = result.photoGatherer;
		if (pg.photoInfoList != undefined && pg.photoInfoList.length > 0) {
			$('#albumContents').removeClass('hide');
			
			$.each(pg.photoInfoList, function(idx, photo){
				var link = $('<a>').attr({href: '/mdstudioweb/viewPhoto.pics?directoryType=permType&fileName=' +  pg.category + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId, rel: 'images', title: photo.fileName});
				var img = $('<img>').attr({title: photo.fileName, src: '/mdstudioweb/viewPhoto.pics?directoryType=permType&fileName=' +  pg.category + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId, width: '255'});
				link.append(img);
				$('#albumContents').append(link).removeClass('hide');
			});
			
			if (init) {
				// description of the album
				var labelDiv = $('<div>');
				labelDiv.addClass('lobster-font container center-align buttom-margin-medium').css('font-size', '23px').html(pg.albumDescription);
				$('#albumContents').before(labelDiv);
				init = false;
				pa.initializeGallery();
			}
			else {
				$('#albumContents').justifiedGallery('norewind');
			}
			
			
			$('.popup-gallery').magnificPopup({
				delegate: 'a',
				type: 'image',
				tLoading: 'Loading image #%curr%...',
				mainClass: 'mfp-img-mobile',
				gallery: {
					enabled: true,
					navigateByImgClick: true,
					preload: [0,1] // Will preload 0 - before current, and 1 after the current image
				},
				image: {
					tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
					titleSrc: function(item) {
						return item.el.attr('title') +  '<a href=' + item.el.attr('href') + ' target=_blank>&nbsp;Download</a>';
					}
				}
			});
			
			var finalDiv = $('<div>').addClass('container-fluid');
			finalDiv.attr('id', 'finalDiv');
			var btnNext = $('<button>').addClass('btn btn-primary btn-block').text('Show more results');
			finalDiv.append(btnNext);
			finalDiv.insertAfter('#albumContents');
			
			$('.spinner').attr({'align': 'center'}).addClass('col-md-12 form-padding top-margin-util buttom-margin');
			if (result.hasMore) {
				btnNext.unbind().click(function(){
					page++;
					finalDiv.remove();
					pa.getAllPhotos(pg.category, pg.directory, page, limit );
					pa.scrollDown();
				});	
			}
			else {
				finalDiv.remove();
			}
			

		}
	};
	
	method.scrollDown = function () {
		$('html, body').animate({
			scrollTop: $('#footer').offset().top
		}, 1000);
	};
	
	method.initializeGallery = function(){
		$('#albumContents').justifiedGallery({
			rowHeight: 250,
			maxRowHeight: -10,
			lastRow: 'justify', 
			fixedHeight: false,
			margins: 8,
			waitThumbnailsLoad: true,
			justifyThreshold: 0.35,
			cssAnimation: true,
			imagesAnimationDuration: 300,
			rel: 'images'
		}).on('jg.complete');
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	pa.init();
});
