var portfolioObj = {};
var allPortfolioPhotoObj = {};
var coverPhotosObj = {};
var photoAlbumObj = {};
var allPhotoObj = {};
var previewPhotosObj = {};
var userObj = {};

var portfolioViewPrefix = '/mdstudioweb/viewPhoto.pics?directoryType=portfolioType&fileName=';
var photoArchiveViewPrefix = '/mdstudioweb/viewPhoto.pics?directoryType=permType&fileName=';
var photoPreviewPrefix = '/mdstudioweb/viewPhoto.pics?directoryType=previewType&fileName=';
var portfolioUrl = '';
var eventClick = '';
var photoarchiveUrl = '';

var app = (function(){
	method = {};
	
	method.googleAnalytics = function() {
		 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
		  ga('create', 'UA-42520389-1', 'mdsnapshots.com');
		  ga('send', 'pageview');
	};
	
	method.parseUrl = function(url){
		var urlIndex = url.indexOf('/');
		var urlParsed = url.substring(urlIndex + 1);
		return urlParsed;
	};
	

	method.eventClick = function() {
		$('body').unbind().click(function(e){
			$('#menus ul > li').removeClass('active');
			var element = $(e.target);
			element.closest('li').addClass('active');
		});
	};
	
	
	method.getAllPortfolio = function () {
		if (portfolioObj !== undefined && Object.keys(portfolioObj).length > 0) {
			app.populatePortfolio(portfolioObj);
		}
		
		else {
			$.post('/mdstudioweb/getAllPortfolio.jctl', function(result){
				app.checkLoginSession(result);
				if (result.isSuccess) {
					if (result.photoList != undefined && result.photoList.length > 0) {
						$.each(result.photoList, function(idx, photo){
							if (!portfolioObj[photo.directoryName]) {
								portfolioObj[photo.directoryName] = photo;
							}
						});
						app.populatePortfolio(result.photoList);
					}
				}
			});	
		}
	};
	
	
	method.populatePortfolio = function(photoList) {
		var min = 0;
		var max = 3;
		var imgHost = '/mdstudioweb/viewPhoto.pics?directoryType=portfolioType&fileName=';
		var divContainer = '';
		var even = false;
		
		$('#loading').remove();
		$.each(photoList, function(idx, photo){
			min++;
			if (min == 1) {
//				divContainer = $('<div>').addClass('container-fluid black-background-opaque');
				divContainer = $('<div>').addClass('container-fluid');
			}
			
			var divContent = $('<div>').addClass('col-md-4');
			var img = $('<img>').attr({src: imgHost + photo.directoryName + '/' + 
					  photo.fileName, title: photo.directoryName}).addClass('img-responsive img-thumbnail pointer portfolio-album');
			var h2 = $('<p style="font-size: 25px;">').addClass('lobster-font').text(photo.albumCaptionName);
			
			divContent.append(app.showLoading);
			img.load(function(){
				divContent.find('#loading').remove();
				divContent.append(this).append(h2);
			});
			
			/*divContent.append(img).append(h2);*/
			divContainer.append(divContent);
			
			$('#portfolio').append(divContainer);
			
			if (min == max) {
				div = $('<div>').addClass('clearfix buttom-margin');
				divContainer.after(div);
				min = 0;
			}
		});
		
		$.each($('#portfolio > div'), function(idx, elm){
			if (!even) {
				if ($(elm).attr('class').indexOf('black') >=0) {
					even = true;
					return true;
				}
			}
			else {
				if ($(elm).attr('class').indexOf('black') >=0) {
					even = false;
					$(elm).removeClass('black-background-opaque');
				}
			}
		});
		
		
		$('body').unbind().click(function(e){
			var element = $(e.target);
			if (element.closest('#portfolio')) {
				if (element.is('img') && element.attr('class').indexOf('portfolio-album') > 0) {
					window.location.href = '#/portfolio/' + element.attr('title');
					$('#portfolio').addClass('hide');
					$('#albumContents').removeClass('hide');
					eventClick = 'content';
				}
			}
		});
	};
	
	
	method.login = function () {
		$('#signinForm').submit('form',function(){
			$.post('/mdstudioweb/login', $('#signinForm').serialize(), function(result){
				if (result.isSuccess) {
					location.reload();
				}
				else {
					if (result.error != undefined) {
						$('#errorMsg').text(result.error.msg);
						$('#signinForm .form-group').addClass('has-error has-feedback');
					}
				}
			});
		});
	};
	
	method.checkLoginSession = function (result) {
		if (result.isLogin) {
			$('#signinContainer').addClass('hide');
			$('#myMenu').removeClass('hide');
			
			if (result.siteUser != undefined) {
				if (result.siteUser.admin) {
					$('.admin-util').removeClass('hide');
				}
				else {
					$('.admin-util').addClass('hide');
					app.checkAuthorization();
				}
			}
		}
		else {
			$('#signinContainer').removeClass('hide');
			$('#myMenu').addClass('hide');
		}
	}
	
	
	method.signout = function () {
		$('#logout').unbind().click(function(){
			$.post('/mdstudioweb/logout', function(result){
				if (result.isSuccess) {
					location.reload();
				}
			});
		});
	}
	
	method.showLoading = function () {
		var divLoading = $('<div id="loading">').attr('align','center');
		var img = $('<img>');
		img.attr({src: '/images/ajax-loader.gif'});
		divLoading.append(img);
		return divLoading;
	};
	
	
	
	method.checkSessionAuth = function() {
		$.post('/mdstudioweb/checkLoginSession.jctl', function(result){
			if (result.isSuccess && result.isLogin) {
				if (!userObj['user']) {
					userObj['user'] = result.siteUser;
				}
				
				$('#uploadPhoto').closest('li').removeClass('hide');
				
				if (result.siteUser.admin) {
//					events();
					$('#myMenu, #myMenu > ul > li').removeClass('hide');
				}
				else {
//					window.location.replace('#/index');
				}
				
				app.checkAuthorization();
			}
			else {
				$('#signinContainer').removeClass('hide');
			}
		});
	};
	
	
	method.checkAuthorization = function () {
		$('.admin-util').addClass('hide');
		$('#myMenu').removeClass('hide');
		if (userObj['user']) {
			var user = userObj['user'];
			if (user != undefined) {
				// auth uploads
				if (user.authUploads != undefined && user.authUploads != '') {
					$('#myMenu').removeClass('hide');
					$('#uploadPhoto').closest('li').removeClass('hide');
				}
				
				if (app.isAdmin()) {
					$('.admin-util').removeClass('hide');
				}
			}
		}
	};
	
	
	method.isAdmin = function () {
		if (!userObj['user']) {
			return false;
		}
		else if (userObj['user'] && userObj['user'].admin) {
			return true;
		}
		return false;
	}
	
	
	method.doPost = function (postObj) {
		// set default post attribs value
		// override default if file upload
		var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
		var processData = true;
		
		var dataToSubmit = postObj.data;
		var urlPost = postObj.url;
		if (dataToSubmit == undefined) {
			dataToSubmit = null;
		}
		
		if (postObj.contentType != undefined) {
			contentType = postObj.contentType;
		}
		
		if (postObj.processData != undefined) {
			processData = postObj.processData;
		}
		
		var jsonResponse = '';
		$.ajax({
			url: urlPost,
			data: dataToSubmit,
			type: 'POST',
			async: false,
			cache: false,
			contentType: contentType,
			processData: processData,
			error: function(xhr, status, error) {
				jsonResponse = xhr;
			},
			complete: function(xhr, textStatus) {
				if (xhr.status == 200) {
					jsonResponse = jQuery.parseJSON(xhr.responseText);
				}
				else {
					if (xhr.status == 404) {
						window.location.href = '/#/index';
					}
				}
			}
		});
		
		return jsonResponse;
	};
	
	method.alertError = function() {
		alert('Something went wrong. Please refresh your page.');
	};
	
	return method;
}(jQuery));

$(document).ready(function(){
	app.googleAnalytics();
	app.eventClick();
	app.login();
	app.signout();
	app.checkSessionAuth();
});


