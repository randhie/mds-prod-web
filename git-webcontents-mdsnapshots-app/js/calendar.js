var page = 1;
var limit = 10;
var initializeInfinite = false;
var photoCategories = [];
var url = '';
var albumDescription = [];

var calendar = (function($){
	method = {};
	
	
	method.init = function(){
		url = photoarchiveUrl.split('/');
		if (photoarchiveUrl == undefined || photoarchiveUrl == '') {
			calendar.getPhotoCategories();
			return false;
		}
		var span = $('<span>').addClass('lobster-font').css('font-size', '23px').text('Calendar');
		$('#categoryAlbum').append(span);
		
		console.log(url);
		switch (url.length) {
		case 1:
			calendar.getAlbums(url);
			break;
		case 2:
			calendar.getAllCoversAndBanner(url[0], [2,3], true);
			break;
		case 3:
			calendar.getAllPhotos(url[0], url[1], url[2], limit);
			break;
		default:
			break;
		}
	};
	
	method.getPhotoCategories = function() {
		var postObj = {};
		postObj['url'] = '/mdstudioweb/getAllPhotoCategories.jctl';
		
		var data = {};
		data['categoryType'] = 4;
		postObj['data'] = data;
		
		var result = app.doPost(postObj);
		if (result.isSuccess) {
			if (result.photoCategories != undefined && result.photoCategories.length > 0) {
				$.each(result.photoCategories, function(idx, pc){
					photoCategories.push(pc);
				});
				
				calendar.getAlbums(result.photoCategories[result.photoCategories.length - 1]);
			}
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
				calendar.populateAlbums(result);
			}
			
			// BREADCRUMBS CATEGORY / PHOTO ALBUM 
			if (result.isSuccess && result.photoGathererList != undefined) {
				var categoryAlbumLink = $('<a>').attr({href: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font').text('Calendar');
				$('#categoryAlbum').html(categoryAlbumLink);
				
				categoryAlbumLink.unbind().click(function(){
					window.location.href = '/#/calendar';
				});
				
				var space = $('<span>').addClass('form-padding').text('/');
				var span = $('<span>').addClass('lobster-font').css('font-size', '23px').text(cat.toString().replace(/_/g, ' '));
				$('#photoAlbum').append(space).append(span);
			}
		}
	};
	
	
	method.populateAlbums = function (result) {
		if (result.isSuccess) {
			var maxCtr = 4;
			var ctr = 0;
			if (result.photoGathererList != undefined && result.photoGathererList.length > 0) {
				var categoryAlbumLink = $('<a>').attr({href: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font').text('Calendar');
				$('#categoryAlbum').html(categoryAlbumLink);
				
			
				var category = '';
				$.each(result.photoGathererList, function(idx, pg){
					var div = $('<div>').addClass('col-md-3 col-xs-12 buttom-margin');
					var img = $('<img>');
					
					$.each(pg.photoInfoList, function(ix, pi){
						if (pi.fileName.indexOf('cover') >=0) {
							img.addClass('img-responsive img-thumbnail pointer albums').attr({src: '/mdstudioweb/viewPhoto.pics?directoryType=calendarType&fileName=' + pg.category + '/' + pg.directory + '/' + pi.fileName + '&photoId=' + pi.photoId, title: pg.directory, id: pg.categoryId});
							return false;
						}
					});
					
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
					window.location.href = '#/calendar/' + $(this).attr('id') + '/' + $(this).attr('title');
				});
			}
		}
	};
	
	
	
	method.getAllCoversAndBanner = function(categoryId, photoTypes, onlyList){
		var postObj = {};
		postObj['url'] = '/mdstudioweb/getPhotoCoversByCategoryId.jctl';
		
		var data = {};
		data['categoryId'] = categoryId;
		data['photoType'] = photoTypes;
		data['onlyList'] = false;
		
		postObj['data'] = data;
		
		var result = app.doPost(postObj);
		if (result.isSuccess) {
			var pg;
			if (result.photoGatherer != undefined && result.photoGatherer[0].photoInfoList != undefined) {
				if (result.photoGatherer[0].photoInfoList.length > 0) {
					calendar.populateCalendarMonth(result);
				}
				pg = result.photoGatherer[0];
			}
			
			// breadcrumbs
			var categoryAlbumLink = $('<a>').attr({href: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font').text('Calendar');
			$('#categoryAlbum').html(categoryAlbumLink);
			
			categoryAlbumLink.unbind().click(function(){
				window.location.href = '/#/calendar';
			});
			
			var space = $('<span>').addClass('form-padding').text('/');
			var a1 = $('<a>').attr({src: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font pointer').text(pg.category.replace(/_/g, ' '));
			
			var space2 = $('<span>').addClass('form-padding').text('/');
			var span2 = $('<span>').addClass('lobster-font').css('font-size', '23px').text(url[1].replace(/_/g, ' '));
			$('#photoAlbum').append(space).append(a1).append(space2).append(span2);
			
			a1.unbind().click(function(){
				window.location.href= '/#/calendar/' + pg.category; 
			});
		}
	};
	
	
	method.populateCalendarMonth = function (result) {
		if (result != undefined) {
			var pg = result.photoGatherer[0];
			var div = $('<div>').addClass('list-group');
			$.each(pg.photoInfoList, function(idx, photo) {
				var fname = photo.fileName.toLowerCase();
				if (fname.indexOf('banner') >=0) {
					var imageBanner = $('<img>').addClass('img-responsive img-thumbnail');
					imageBanner.attr({src: '/mdstudioweb/viewPhoto.pics?directoryType=calendarType&fileName=' + pg.category + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId});
					$('#bannerCalendar').append(imageBanner);
					return true;
				}
				
				var a1 = $('<a>').attr({href: 'javascript:void(0);'}).addClass('list-group-item buttom-margin-small');
				var img = $('<img>').addClass('img-responsive img-thumbnail');
				img.attr({src: '/mdstudioweb/viewPhoto.pics?directoryType=calendarType&fileName=' + pg.category + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId, title: photo});
				a1.append(img);
				div.append(a1);
			});
			
			if (!div.is(':empty')) {
				$("#leftCalendar").append(div);
				$('#calendarCover').removeClass('hide');
				$('#rightCalendar').html(pg.albumDescription);
			}
			calendar.helperMethod(pg.category, pg.directory);
		}
	};
	
	
	method.helperMethod = function(category, directory){
		$('body').unbind().click(function(e){
			var elm = e.target;
			var div = $(elm).closest('div');
			if (div != undefined && div.attr('class') != undefined && div.attr('class').indexOf('list-group') >=0) {
				var a = $(elm).closest('a');
				if (a.index() != undefined) {
					var pageClicked = a.index() + 1;
					window.location.href = '/#/calendar/' + category + '/' + directory + '/' + pageClicked;
				}
			}
			
			
			
		});
		
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
					calendar.populatePhotos(result);
					
					// BREADCRUMBS PHOTO ARCHIVE / CATEGORY / ALBUM
					if (result.photoGatherer != undefined && result.photoGatherer.photoInfoList != undefined) {
						if (result.photoGatherer.photoInfoList.length > 0) {
							if ($('#photoAlbum').empty() && $('#folder').empty()) {
								var categoryAlbumLink = $('<a>').attr({href: 'javascript:void(0);'}).css('font-size', '23px').addClass('lobster-font').text('Calendar');
								$('#categoryAlbum').html(categoryAlbumLink);
								
								categoryAlbumLink.unbind().click(function(){
									window.location.href = '/#/calendar';
								});
								
								var space = $('<span>').addClass('form-padding').text('/');
								var categoryLink = $('<a>').attr({href: 'javascript:void(0);'}).addClass('lobster-font').css('font-size', '23px').text(category.toString().replace(/_/g, ' '));
								$('#photoAlbum').append(space).append(categoryLink);
								categoryLink.unbind().click(function(){
									window.location.href = '/#/calendar/' + category.toString();
								});
								
//								var albumLink = $('<span>').addClass('form-padding lobster-font').css('font-size', '23px').text(result.photoGatherer.albumCaptionName);
								var albumLink = $('<a>').attr({href: 'javascript:void(0);'}).addClass('lobster-font').css('font-size', '23px').text(result.photoGatherer.albumCaptionName);
								var space = $('<span>').addClass('form-padding').text('/');
								$('#folder').append(space).append(albumLink);	
								
								albumLink.unbind().click(function(){
									window.location.href = '/#/calendar/' + result.photoGatherer.categoryId + '/' + directory.toString();
								});
							}
						}
					}
					
				}
			}
		}
	};
	
	var init = true;
	method.populatePhotos = function(result){
		var pg = result.photoGatherer;
		if (pg.photoInfoList != undefined && pg.photoInfoList.length > 0) {
			$('#albumContents').removeClass('hide');
			
			$.each(pg.photoInfoList, function(idx, photo){
				var link = $('<a>').attr({href: '/mdstudioweb/viewPhoto.pics?directoryType=calendarType&fileName=' +  pg.category + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId, rel: 'images', title: photo.fileName}).addClass('swipebox');
				var img = $('<img>').attr({title: photo.fileName, src: '/mdstudioweb/viewPhoto.pics?directoryType=calendarType&fileName=' +  pg.category + '/' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId});
				img.addClass('img-responsive img-rounded');
				link.append(img);	
				
				$('#albumContents').append(link);
			});
			
			if (init) {
				// description of the album
//				var labelDiv = $('<div>');
//				labelDiv.addClass('lobster-font container center-align buttom-margin-medium').css('font-size', '23px').html(pg.albumDescription);
//				$('#albumContents').before(labelDiv);
				init = false;
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
			
			
			calendar.initializeGallery();
			
			var finalDiv = $('<div>').addClass('container-fluid');
			finalDiv.attr('id', 'finalDiv');
		}
	};
	
	method.scrollDown = function () {
		$('html, body').animate({
			scrollTop: $('#latestUpload').offset().top
		}, 2000);
	};
	
	method.initializeGallery = function(){
		$('#albumContents').justifiedGallery({
			rowHeight: 250,
			maxRowHeight: -10,
			lastRow: 'nojustify', 
			fixedHeight: false,
			margins: 50,
			waitThumbnailsLoad: true,
			justifyThreshold: 0.35,
			cssAnimation: true,
			imagesAnimationDuration: 300,
			rel: 'images',
		}).on('jg.complete');
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	calendar.init();
});
