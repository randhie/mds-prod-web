var defaultLimit = 10;
var defaultPage = 1;
var initializeInfinite = false;

var portfolio = (function($){
	method = {};
	
	method.init = function(){
		var params = portfolioUrl.split('/');
		if (params != undefined && params != '') {
			switch (params.length) {
			case 1:
				portfolio.getPortfolio('Portfolio', params[0], defaultPage, defaultLimit);	
				break;
			case 2:
				portfolio.getPortfolio('Portfolio', params[0], params[1], defaultLimit);
			default:
				break;
			}
		}
		else {
			portfolio.getCoverPortfolio();
		}
		
		$('#portfolioLink').addClass('lobster-font').css('font-size', '23px').unbind().click(function(){
			portfolioUrl = '';
			window.location.href = '/#/portfolio';
		});
	};
	
	
	
	method.getCoverPortfolio = function() {
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
				portfolio.populatePortFolioCover(result);
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
					img.attr({src: '/mdstudioweb/viewPhoto.pics?directoryType=' + pg.category.toLowerCase() + 'Type&fileName=' + pg.directory + '/' + pg.photoInfoList[0] + '&photoId=' + pg.photoInfoList[1], title: pg.directory});
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
	
	
	
	method.getPortfolio = function(category, directory, page, limit){
		var postObj = {};
		postObj['url'] = '/mdstudioweb/getAllPhotoss.jctl';
		
		var data = {};
		data['category'] = category.toString();
		data['directory'] = directory.toString();
		data['page'] = eval(page);
		data['limit'] = eval(limit);
		postObj['data'] = data;
		
		var result = app.doPost(postObj);
		if (result != undefined) {
			if (result.isSuccess) {
				portfolio.populatePortfolio(result);
			}
		}
		
	};
	
	var init = true;
	method.populatePortfolio = function(result){
		if (result.photoGatherer != undefined && result.photoGatherer.photoInfoList != undefined) {
			if (result.photoGatherer.photoInfoList.length > 0) {
				var pg = result.photoGatherer;
				$('#folder').addClass('lobster-font').css('font-size', '23px').text(pg.directory);
				$('#albumContents').removeClass('hide');
				
				$.each(result.photoGatherer.photoInfoList, function(idx, photo){
					var link = $('<a>').attr({href: '/mdstudioweb/viewPhoto.pics?directoryType=portfolioType&fileName=' +  pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId, rel: 'images', title: photo.fileName}).addClass('swipebox');
					var img = $('<img>').attr({title: photo.fileName, src: '/mdstudioweb/viewPhoto.pics?directoryType=portfolioType&fileName=' + pg.directory + '/' + photo.fileName + '&photoId=' + photo.photoId});
					link.append(img);	
					
					$('#albumContents').append(link);
				});
				
				if (init) {
					// description of the album
					var labelDiv = $('<div>');
					labelDiv.addClass('lobster-font container center-align buttom-margin-medium').css('font-size', '23px').html(pg.albumDescription);
					$('#albumContents').before(labelDiv);
					init = false;
					portfolio.initializeGallery();
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
//							return item.el.attr('title') + '<small>by Marsel Van Oosten</small>' + console.log(item);
							return item.el.attr('title') +  '<a href=' + item.el.attr('href') + ' target=_blank>&nbsp;Download</a>';
						}
					}
				});
				
				$('.spinner').attr({'align': 'center'}).addClass('col-md-12 form-padding top-margin-util buttom-margin');
				var finalDiv = $('<div>').addClass('container-fluid');
				finalDiv.attr('id', 'finalDiv');
				var btnNext = $('<button>').addClass('btn btn-primary btn-block').text('Show more results');
				finalDiv.append(btnNext);
				finalDiv.insertAfter('#albumContents');
				
				if (result.hasMore) {
					btnNext.unbind().click(function(){
						defaultPage ++;
						finalDiv.remove();
						portfolio.getPortfolio(result.photoGatherer.category, result.photoGatherer.directory, defaultPage, defaultLimit );
						portfolio.scrollDown();
					});	
				}
				else {
					finalDiv.remove();
				}
			}
			
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
	portfolio.init();
});