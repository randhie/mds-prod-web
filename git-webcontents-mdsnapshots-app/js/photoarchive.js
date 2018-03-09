var trackingCtr = -1;
var trackingNo = '';
var btnClickCount = 0;

var colCtr = 0;
var ctrPhotoShow = 0;
var maxPhotoShow = 12;
var divContainer = '';

var photoarchive = (function(){
	method = {};
	
	method.init = function () {
		$('body').unbind().click(function(e){
			var element = $(e.target);
			if (element.attr('class') != undefined && element.attr('class').indexOf('category') >=0) {
				window.location.href = '#/photoarchive/' + element.attr('title');
			}
			
			if (element.attr('id') != undefined && element.attr('id').indexOf('photoArchiveLink') >=0) {
				window.location.href = '#/photoarchive';
				photoarchiveUrl = '';
			}
		});
		
		
		if (photoarchiveUrl == undefined || photoarchiveUrl == '') {
			if (Object.keys(coverPhotosObj).length > 0) {
				photoarchive.populateCoverPhotos(coverPhotosObj);	
		}
			else {
				photoarchive.getAllCoverPhotos();
			}	
		}
		
		var trackingNumberIdx = photoarchiveUrl.lastIndexOf('/');
		var trackingNumber = '';
		if (trackingNumberIdx != undefined && trackingNumberIdx > -1) {
			trackingNumber= photoarchiveUrl.substring(trackingNumberIdx + 1);
			photoarchiveUrl = photoarchiveUrl.substring(0, trackingNumberIdx);
			trackingNo = trackingNumber;
		}
	
		
		if (photoarchiveUrl != undefined && photoarchiveUrl != '' && photoarchiveUrl.indexOf('_') < 0) {
			$('#folder').append(photoarchiveUrl);
			photoarchive.getAllAlbums(photoarchiveUrl);
		}
		else if (photoarchiveUrl != undefined && photoarchiveUrl != '' && photoarchiveUrl.indexOf('_') >= 0) {
			
		/*	trackingNo = trackingNumber;*/
			
			var category = photoarchiveUrl.trim().split('_');
			var albumStr = photoarchiveUrl.substring(1);
			var albumIndex = albumStr.indexOf('_');
			var album = albumStr.substring(albumIndex);

			var categoryLink = $('<a>');
			categoryLink.attr({href: '#/photoarchive/' + category[1]}).text(category[1]);
			
			$('#folder').append(categoryLink).append('&nbsp;&nbsp; / &nbsp;&nbsp;' + album.substring(1).replace(/_/g, ' '));
			photoarchive.getAllPhotos(photoarchiveUrl);
			
			
		}
	};
	
	method.getAllCoverPhotos = function() {
		$('#archives').removeClass('hide').append(app.showLoading());
		$.post('/mdstudioweb/getAllCoverPhotos.jctl', function(result){
			if (result.isSuccess) {
				$('#archives #loading').remove();
				if (result.photoCoverList != undefined) {
					$.each(result.photoCoverList, function(idx, cover){
						if (!coverPhotosObj[idx]) {
							coverPhotosObj[idx] = {};
						}
						coverPhotosObj[idx] = cover;
						
					});
					
					photoarchive.populateCoverPhotos(result.photoCoverList);
				}
				
			}
		});
	};
	
	
	
	method.populateCoverPhotos = function(covers) {
		$.each(covers, function(idx, cover) {
			var divContainer = $('<div>').addClass('col-md-4');
			divContainer.append(app.showLoading);
			
			var divImg = $('<div>').addClass('no-spaces');
			var img = $('<img>');
			img.attr({src: '/images/' + cover.toLowerCase() + '.jpg', title: cover});
			img.addClass('img-responsive img-thumbnail pointer category');
			
			img.load(function(){
				/*divContainer.append(this);*/
				divImg.append(this);
				divContainer.find('#loading').remove();
			});
			
			var divLabel = $('<div>').addClass('no-spaces');
			var h3 = $('<h3 class="lobster-font">').text(cover);
			divLabel.append(h3);
			divContainer.append(divImg).append(divLabel);
			$('#archives').append(divContainer).removeClass('hide');
		});
	};
	
	
	
	method.getAllAlbums = function (album) {
		if (Object.keys(photoAlbumObj).length > 0) {
			if (photoAlbumObj[album]) {
				photoarchive.populateAlbums(photoAlbumObj[album]);
				return false;
			}
		}
		
		$('#albums').removeClass('hide').append(app.showLoading());
		$.post('/mdstudioweb/getAllCoverPhotosByParent.jctl', {parentDirectory: album} ,function(result){
			if (result.isSuccess) {
				if (result.photoList != undefined && result.photoList.length > 0) {
					if (!photoAlbumObj[album]) {
						photoAlbumObj[album] = {};
					}
					
					$.each(result.photoList, function(idx, photos){
						photoAlbumObj[album][idx] = photos;
					});
					
					photoarchive.populateAlbums(result.photoList);
				}
				
			}
		});
		
	};
	
	
	method.populateAlbums = function (albumContents) {
		var colspan = 12;
		var colCtr = 0;
		var div = '';
		
		$('#albums').removeClass('hide').find('#loading').remove();
		$.each(albumContents, function(idx, album) {
			if (colCtr == 0) {
				div = $('<div>').addClass('container-fluid');	
			}
			
			var divContent = $('<div>');
			switch (album.photoType) {
			case 0:
				divContent.addClass('col-md-3');
				colCtr += 3;
				break;
			case 1: 
				divContent.addClass('col-md-4');
				colCtr += 4;
				break;
			default:
				break;
			}
			
			divContent.append(app.showLoading);
			
			var divImg = $('<div>');
			var img = $('<img>');
			img.attr({src: photoArchiveViewPrefix + album.parentDirectory + '/' + 
					  album.directoryName + '/' + album.fileName, parentDirectory: album.parentDirectory,
					  directoryName: album.directoryName, captionName: album.albumCaptionName});
			
			img.addClass('img-responsive img-thumbnail pointer album');
			img.load(function(e){
				divContent.find('#loading').remove();
				divImg.append(this);
			});
			
			
			var divLabel = $('<div>');
			var h4 = $('<h4 class="lobster-font">').text(album.albumCaptionName);
			divLabel.append(h4);
			
			divContent.append(divImg).append(divLabel);
			
			div.append(divContent);
			if (colCtr == colspan) {
				$('#albums').append(div);
				colCtr = 0;
			}
			else if (Object.keys(albumContents).length < 4) {
				$('#albums').append(div);
			}
		});
		
		$('body').unbind().click(function(e){
			var element = $(e.target);
			if (element.attr('class') != undefined && element.attr('class').indexOf('album') >=0) {
				window.location.href = '#/photoarchive/' + element.attr('parentDirectory') + '/' + 
				element.attr('directoryName');
			}
			
			if (element.attr('id') != undefined && element.attr('id').indexOf('photoArchiveLink') >=0 ) {
				window.location.href = '#/photoarchive';
				photoarchiveUrl = '';
			}
		});
		
	};
	
	
	method.getAllPhotos = function (absoluteDirectory) {
		$('#albumContents').append(app.showLoading).removeClass('hide');
		var url = absoluteDirectory.substring(1).replace('_', '/');
		if (absoluteDirectory != undefined && allPhotoObj[url]) {
			photoarchive.populatePhotos(allPhotoObj[url], absoluteDirectory);
			return false;
		}
		
		
		$.post('/mdstudioweb/getAllPhotos.jctl', {directoryName: absoluteDirectory} ,function(result){
			if (result.isSuccess) {
				if (result.photoList != undefined && result.photoList.length > 0) {
					$.each(result.photoList, function(idx, photo){
						if (!allPhotoObj[photo.parentDirectory]) {
							allPhotoObj[photo.parentDirectory] = {};
						}
						
						if (photo.fileName != undefined && photo.fileName.indexOf('album-caption') >= 0) {
							allPhotoObj[photo.parentDirectory]['captionName'] = photo.albumCaptionName;
							return true;
						}
						else if (photo.fileName != undefined && photo.fileName.indexOf('album-description') >= 0) {
							allPhotoObj[photo.parentDirectory]['albumDescription'] = photo.albumDescription;
							return true;
						}
						
						allPhotoObj[photo.parentDirectory][idx] = photo ;
					});
					
//					photoarchive.populatePhotos(result, absoluteDirectory);
					photoarchive.populatePhotos(allPhotoObj[url], absoluteDirectory);
				}
				else {
					window.location.href = '#/index';
				}
				
			}
		});
	};
	
	method.populatePhotos = function (result, absoluteDirectory) {
		$('#albumContents').removeClass('hide').find('#loading').remove();
		
		var photoList = '';
		if (result.photoList != undefined) {
			photoList = result.photoList;
		}
		else {
			photoList = result;
		}
		
		var contentLength = photoList.length;
		if (contentLength == undefined) {
			contentLength = Object.keys(photoList).length;
		}
		
		$('#descriptionDiv').remove();
		var divDesContainer = $('<div>').addClass('container').attr({'align':'center', 'id': 'descriptionDiv'});
		var divDesContent = $('<div>').addClass('col-md-12 col-xs-12 container');
		var h4 = $('<h4>').html(result.albumDescription);
		divDesContent.append(h4);
		divDesContainer.append(divDesContent);
		$('#albumContents').before(divDesContainer);
		
		
		$.each(photoList, function(idx, content) {
			if (eval(trackingCtr) >= eval(idx)) {
				return true;
			}
			
			trackingCtr = idx;
			
			if (colCtr == 0) {
				divContainer = $('<div>').addClass('container-fluid');
			}
			
			var divCol = ''
			ctrPhotoShow++;
			
			
			var divContent = $('<div>').attr('id', content.fileName);
			if (content.photoType == 1) {
				divCol = $('<div>').addClass('col-md-4 col-xs-4');
				colCtr +=4;
			}
			else {
				divCol = $('<div>').addClass('col-md-2 col-xs-2');
				colCtr +=2;
			}
			
			divContent.append(app.showLoading);
			var a = $('<a>').addClass();
			a.attr({href: photoArchiveViewPrefix + content.parentDirectory + '/' + content.fileName, rel: 'prettyPhoto[portfolio]'});
			
			var img = $('<img>');
			img.attr({src: photoArchiveViewPrefix + content.parentDirectory + '/' + content.fileName, title: content.fileName});
			img.addClass('img-responsive img-thumbnail pointer');
			img.load(function(e){
				a.append(this);
				$('#albumContents').children().removeClass('hide');
				$('#loading').remove();
			});

			divCol.append(a);
			divContainer.append(divCol);
			
			
			if (colCtr == maxPhotoShow) {
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
						if (photoarchiveUrl != undefined && photoarchiveUrl != '') {
							var categorySplit = photoarchiveUrl.substring(1).split('_');
							var category = categorySplit[0];
							var album = '';
							$.each(categorySplit, function(idx, cat){
								if (idx == 0) {
									return true;
								}
								album += '_' + cat;
							});
							album = album.substring(1);
							
							if (btnClickCount > 0) {
								window.location.href = '#/photoarchive/' +category + '/' + album + '/' + (eval(btnClickCount) + eval(1));
							}
							else if (trackingNo != undefined && trackingNo != '') {
								window.location.href = '#/photoarchive/' +category + '/' + album + '/' + trackingNo;
							}
							else {
								window.location.href = '#/photoarchive/' +category + '/' + album;	
							}
							
						}
						else {
							window.location.href = '#/photoarchive';	
							portfolioUrl = '';
						}
					}
				});
				
				if (lastIdx == 1) {
					return false;
				}
				$('#albumContents').append(divShowMore);
				
				btn.unbind().click(function(){
					photoarchive.getAllPhotos(absoluteDirectory);
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
	photoarchive.init();
});