var trackingCtr = -1;
var trackingNo = 0;
var btnClickCount = 0;

var colCtr = 0;
var	maxCol = 12;
var divContainer = '';

var ctrPhotoShow = 0;
var maxPhotoShow = 12;

var portfolio = (function(){
	method = {};
	
	method.init = function() {
		$('#portfolio').append(app.showLoading);
		if (eventClick == 'portfolio') {
			app.getAllPortfolio();	
		}
		
		if (portfolioUrl == '') {
			$('#portfolio').removeClass('hide');
		}
		
		$('#portfolioLink').unbind().click(function(){
			$('#albumContents').addClass('hide');
			window.location.href = '#/portfolio';
			eventClick = 'portfolio';
			portfolioUrl = '';
			$('#portfolio').removeClass('hide');
		});
	};
	
	
	method.getPortfolioContent = function (album, trackingNumber) {
		if (trackingNumber != undefined) {
			trackingNo = trackingNumber;
		}
		
		
		if (allPortfolioPhotoObj[album]) {
			portfolio.populateContent(allPortfolioPhotoObj[album]);
			
			portfolioUrl = '#/portfolio/' + album;
			if (portfolioUrl != undefined && portfolioUrl != '') {
				$('#folder').text(album);
			}
			return false;
		}
		
		$('#albumContents').removeClass('hide').append(app.showLoading());
		$.post('/mdstudioweb/getPortfolioByDirectory.jctl',
				{
				parentChildFolder: album
				} ,function(result){
			if (result.isSuccess) {
				$('#albumContents, #portfolio').find('#loading').remove();
				$('#albumContents').removeClass('hide');
				if (result.photoList != undefined && result.photoList.length > 0) {
					if (!allPortfolioPhotoObj[album]) {
						allPortfolioPhotoObj[album] = {};
					}
					 
					$.each(result.photoList, function(idx, photo){
						allPortfolioPhotoObj[album][idx] = photo;	
					});
					
					portfolio.populateContent(result.photoList);
					portfolioUrl = '#/portfolio/' + album;
					if (portfolioUrl != undefined && portfolioUrl != '') {
						$('#folder').text(album);
					}
				}
			}
		});
	};
	
	
	method.populateContent = function (contents) {
		var contentLength = contents.length;
		if (contentLength == undefined) {
			contentLength = Object.keys(contents).length;
			$('#albumContents').removeClass('hide');
			$('#loading').remove();
		}
		
		$.each(contents, function(idx, content){
			if (content.fileName != undefined && content.fileName.indexOf('txt') >= 0) {
				return true;
			}
			
			if (eval(trackingCtr) >= eval(idx)) {
				return true;
			}
			
			trackingCtr = idx;
			
			if (colCtr == 0) {
				divContainer = $('<div>').addClass('container-fluid');	
			}
			
			var divCol = ''
			ctrPhotoShow++;
			if (content.photoType == 1) {
				divCol = $('<div>').addClass('col-md-4 col-xs-4');
				divCol.attr('id', content.fileName);
				colCtr +=4;
			}
			else {
				divCol = $('<div>').addClass('col-md-2 col-xs-2');
				divCol.attr('id', content.fileName);
				colCtr +=2;
			}
			 
			
			var a = $('<a>');
			a.attr({href: portfolioViewPrefix + content.directoryName + '/' + content.fileName, rel: 'prettyPhoto[portfolio]'});
			
			var img = $('<img>');
			img.attr({src: portfolioViewPrefix + content.directoryName + '/' + content.fileName, title: content.fileName});
			img.addClass('img-responsive img-thumbnail pointer');
			img.load(function(e){
				divCol.find('#loading').remove();
				a.append(this);
				$('#albumContents').children().removeClass('hide');
			});
			
			divCol.append(a);
			divContainer.append(divCol);
			
			if (colCtr == maxCol) {
				$('#albumContents').append(divContainer);
				var divClear = $('<div>').addClass('clearfix');
				divContainer.append(divClear);
				colCtr = 0;
			}
			
			var lastIdx = eval(contentLength) - eval(trackingCtr);
			if (lastIdx == 1) {
				$('#albumContents').append(divContainer);
			}
			
			if (ctrPhotoShow == maxPhotoShow || lastIdx == 1) {
				ctrPhotoShow = 0;
				
				var divShowMore = $('<div>').addClass('hide');
				divShowMore.addClass('container-fluid');
				var btn = $('<button>');
				btn.attr({type: 'button'}).text('Show More');
				btn.addClass('btn btn-neutral btn-block');
				divShowMore.append(btn);
				
				$('a[rel^=prettyPhoto]').prettyPhoto({
					allow_resize: true,
					allow_expand: false,
					social_tools: false,
					image_markup: '<img id="fullResImage" src="{path}" /><span class="download-btn"><a href="{path}" target="_blank">Download</a></span>',
					changepicturecallback: function(){
			            jQuery(".pp_content").css("height", $(".pp_content").height() + jQuery(".download-btn").outerHeight() + 10);
			        },
					callback: function(){
						
						if (btnClickCount > 0) {
							window.location.href = portfolioUrl + '/' + (eval(btnClickCount) + eval(1));
						}
						else if (portfolioUrl != undefined && portfolioUrl != '') {
							window.location.href = portfolioUrl;
						}
						else {
							window.location.href = '#/portfolio';	
							portfolioUrl = '';
						}
					}
				});
				

				if (lastIdx == 1) {
					return false;
				}
				$('#albumContents').append(divShowMore);
				
				btn.unbind().click(function(){
					portfolio.getPortfolioContent(contents[0].directoryName);
					$(this).closest('div').remove();
					btnClickCount++;
				});	
				
				
				if (trackingNo != undefined) {
					if (trackingNo > 1) {
						trackingNo = eval(trackingNo) - eval(1);
						btn.trigger('click');
					}
				}
				return false;
			}
		});
		
	};
	
	
	return method;
}(jQuery));


$(document).ready(function(){
	portfolio.init();
});