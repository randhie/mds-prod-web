Path.map('#/index').to(function(){
	$('#importHtml').load('landing-page.html', function(){
		$('.js').append('<script src="js/index.js"></script>');
		$('.banner').append($(this).find('#banner'));
		$('.portfolio').append($(this).find('#portfolio'));
		$('.content').append($(this).find('#content'));
		$('#footer').removeClass('footer');
		$('.container-portfolio').removeClass('container').addClass('container-fluid');
	});
}).exit(function(){
	$('.portfolio, .banner, .content, .js').empty();
	$('.container-portfolio').removeClass('container-fluid').addClass('container');
});	

	

Path.map('#/about').to(function(e){
	$('.portfolio').load('about-new.html');
	$('.banner').load('landing-page.html #bannerAbout', function(){
		$('#bannerAbout').removeClass('hide');
	});
	$('.content').empty();
}).exit(function(){
	$('.portfolio, .banner').empty();
});



Path.map('#/services').to(function(){
	var url = app.parseUrl(this.path);
	$('.portfolio').load('services.html', function(){
		$('.content').empty();
		$('.banner').empty();
		$('.js').append('<script src="/js/' + url + '.js"></script>');
	});
}).exit(function(){
	$('.portfolio, .js').empty();
});



Path.map('#/event-form').to(function(){
	$('.banner').load('landing-page.html #bannerContract', function(){
		$('#bannerContract').removeClass('hide');
	});
	$('.portfolio').load('event-form.html');
	$('.content').empty();
}).exit(function(){
	$('.portfolio, .banner').empty();
});



Path.map('#/booking').to(function(){
	$('.banner').load('landing-page.html #bannerBooking', function(){
		$('#bannerBooking').removeClass('hide');
	});
	
	$('#importHtml').load('booking.html', function(){
		var js = $('<script>').attr({src: 'js/booking.js'});
		var datepicker = $('<script>').attr('src', 'js/lib/bootstrap-datepicker.js');
		var datepickerCss = $('<link>').attr({rel: 'stylesheet', href: 'css/datepicker.css'});
		
		$('head').append(datepickerCss);
		$('.js').append(datepicker).append(js);
		$('.portfolio').html($('#bookingContent'));
	});
	
}).exit(function(){
	$('.banner, #importHtml, .js, .portfolio').empty();
	$('head link:last').remove();
});



Path.map('#/testimonials(/:page)').to(function(){
	var url = 'testimonials';
	var page = this.params.page;
	
	$('.banner').load('landing-page.html #bannerTestimonial', function(){
		$('#bannerTestimonial').removeClass('hide');
	});
	
	$('#importHtml').load('testimonials.html', function(){
		var js = $('<script>').attr({src: 'js/testimonials.js'});
		$('.js').html(js);
		
		$('.portfolio').html($('#testimonialContainer'));
		
		if (page != undefined) {
			testimonials.getTestimonials(page);
		}
		else {
			testimonials.getTestimonials(1);
		}
	});
}).exit(function(){
	$('.banner, #importHtml, .js, .portfolio').empty();
});



Path.map('#/events(/:page)').to(function(){
	var script = $('<script>').attr('src', 'js/events.js');
	var page = this.params.page;
	var url = 'events';
	
	$('#importHtml').load(url + '.html',function(){
		$('.js').html(script);
		$('.banner').load('landing-page.html #banner');
		$('.portfolio').html($('#eventsContainer'));

		if (page != undefined) {
			nextPage = page;
		}
		events.getEventInfo();
	});
}).exit(function(){
	$('#importHtml, .js, .banner, .portfolio').empty()
});



Path.map('#/eventmgt').to(function(){
	var script = $('<script>').attr('src', 'js/eventmgt.js');
	var datepicker = $('<script>').attr('src', 'js/lib/bootstrap-datepicker.js');
	var datepickerCss = $('<link>').attr({rel: 'stylesheet', href: 'css/datepicker.css'});
	var url = 'eventmgt';
	
	$('#importHtml').load(url + '.html',function(){
		$('.js').append(datepicker).append(script);
		$('head').append(datepickerCss);
		$('.banner').load('landing-page.html #banner');
		$('.portfolio').html($('#eventContents'));
		
	});
}).exit(function(){
	$('#importHtml, .js, .banner, .portfolio').empty();
	$('head link:last').remove();
});



Path.map('#/privacy-policy').to(function(){
	$('.banner').load('landing-page.html #banner');
	$('.portfolio').load('privacy-policy.html');
	$('.content').empty();
}).exit(function(){
	$('.portfolio, .banner').empty();
});




Path.map('#/legal-disclaimer').to(function(){
	$('.banner').load('landing-page.html #banner');
	$('.portfolio').load('legal-disclaimer.html');
	$('.content').empty();
}).exit(function(){
	$('.portfolio, .banner').empty();
});



Path.map('#/portfolio(/:directory)(/:offset)').to(function(){
	var album = this.params.directory;
	var trackingNumber = this.params.offset;
	var url = 'portfolio';

	$('.portfolio').load(url + '.html', function(){
		var css1 = $('<link>').attr({rel: 'stylesheet', href: 'css/justifiedGallery.min.css'}).addClass('newcss');
		$('head').append(css1);
		
		$('.js').append('<script src="js/lib/jquery.justifiedGallery.min.js"></script>');
		$('.js').append('<script src="js/' +  url + 's.js"></script>');	
		$('.container-portfolio').removeClass('container').addClass('container-fluid');
		$('#albumContents').css({'margin-left': '10px', 'padding-right': '20px'});
	});
	
	if (album != undefined) {
		portfolioUrl = album;		
	}

	if (trackingNumber != undefined) {
		portfolioUrl = album + '/' + trackingNumber;
	}
}).exit(function(){
	$('.js, .portfolio').empty();
	$('.container-portfolio').addClass('container').removeClass('container-fluid');
	$('.newcss').remove();
});



Path.map('#/photoarchives(/:category)(/:album)(/:pageNumber)').to(function(e){
	var category = this.params.category;
	var album = this.params.album;
	var trackingNumber = this.params.pageNumber;
	
	photoarchiveUrl = '';
	$('#importHtml').load('photoarchive.html', function(){
		var css1 = $('<link>').attr({rel: 'stylesheet', href: 'css/justifiedGallery.min.css'}).addClass('newcss');
		$('head').append(css1);
		
		$('.js').append('<script src="js/lib/jquery.justifiedGallery.min.js"></script>');
		$('.js').append('<script src="js/photoarchives.js"></script>');
		$('.portfolio').append($('#importHtml').children());
		$('.container-portfolio').removeClass('container').addClass('container-fluid no-spaces');
		$('#albumContents').css({'margin-left': '10px', 'padding-right': '20px'});
	});	
	
	if (category != undefined) {
		photoarchiveUrl = category;
	}

	if (album != undefined) {
		photoarchiveUrl = photoarchiveUrl + '/' + album;
	}
	
	if (trackingNumber != undefined) {
		photoarchiveUrl = photoarchiveUrl + '/' + trackingNumber;
	}
	
}).exit(function(){
	$('.js, .portfolio').empty();
	$('.container-portfolio').addClass('container').removeClass('container-fluid no-spaces');
	$('.newcss').remove();
});




Path.map('#/calendar(/:yearcategory)(/:month)(/:week)').to(function(){
	var category = this.params.yearcategory;
	var album = this.params.month;
	var trackingNumber = this.params.week;
	
	photoarchiveUrl = '';
	$('#importHtml').load('calendar.html', function(){
		var css1 = $('<link>').attr({rel: 'stylesheet', href: 'css/justifiedGallery.min.css'}).addClass('newcss');
		$('head').append(css1);
		
		$('.js').append('<script src="js/lib/jquery.justifiedGallery.min.js"></script>');
		$('.js').append('<script src="js/calendar.js"></script>');
		$('.portfolio').append($('#importHtml').children());
		$('.container-portfolio').removeClass('container').addClass('container-fluid no-spaces');
		$('#albumContents').css({'margin-left': '10px', 'padding-right': '20px'});
	});	
	
	if (category != undefined) {
		photoarchiveUrl = category;
	}

	if (album != undefined) {
		photoarchiveUrl = photoarchiveUrl + '/' + album;
	}
	
	if (trackingNumber != undefined) {
		photoarchiveUrl = photoarchiveUrl + '/' + trackingNumber;
	}
}).exit(function(){
	$('.js, .portfolio').empty();
	$('.container-portfolio').addClass('container').removeClass('container-fluid no-spaces');
	$('.newcss').remove();
});




Path.map('#/utility').to(function(){
	$('#importHtml').load('utility.html', function(){
		$('.js').append('<script src="js/utility.js"></script>');
		$('.js').append('<script src="js/lib/jquery.uploadprogress.js"></script>');
		$('.portfolio').append($('#importHtml').children());
	});
}).exit(function(){
	$('.js, .portfolio').empty();
	$('.table-bordered').remove();
});



Path.map('#/upload').to(function(){
	$('#importHtml').load('upload.html', function(){
		var uploadJs = $('<script>').attr('src', 'js/lib/jquery.uploadprogress.js');
		var js = $('<script>').attr('src', 'js/upload.js');
		$('.js').append(uploadJs).append(js);
		$('.portfolio').append($('#importHtml').children());
	});
}).exit(function(){
	$('.js, .portfolio').empty();
});




Path.map('#/email').to(function(){
	$('#importHtml').load('email.html', function(){
		var js = $('<script>').attr('src', 'js/email.js');
		var uploadJs = $('<script>').attr('src', 'js/lib/jquery.uploadprogress.js');
		$('.js').append(uploadJs).append(js);
		$('.portfolio').append($('#importHtml').children());
	});
}).exit(function(){
	$('.js, .portfolio').empty();
});



Path.map('#/signup').to(function(){
	$('#importHtml').load('signup.html', function(){
		var js = $('<script>').attr('src', 'js/signup.js');
		
		$('.js').append(js);
		$('.banner').append($('#banner'));
		$('.portfolio').append($('#signupContent'));
	});
}).exit(function(){
	$('.js, .portfolio, .banner').empty();
});



Path.map('#/forgotpw').to(function(){
	$('#importHtml').load('forgotpw.html', function(){
		var js = $('<script>').attr('src', 'js/forgotpw.js');
		
		$('.js').append(js);
		$('.banner').append($('#banner'));
		$('.portfolio').append($('#forgotPwContent'));
	});
}).exit(function(){
	$('.js, .portfolio, .banner').empty();
});



Path.map('#/changepw').to(function(){
	$('#importHtml').load('changepw.html', function(){
		var js = $('<script>').attr('src', 'js/changepw.js');
		
		$('.js').append(js);
		$('.banner').append($('#banner'));
		$('.portfolio').append($('#pwChangeContent'));
	});
}).exit(function(){
	$('.js, .portfolio, .banner').empty();
});



Path.map('#/event(/:page)').to(function(){
	var page = this.params.page;
	$('.banner').load('landing-page.html #banner', function(){
		$('#importHtml').load('events.html', function(){
			var js = $('<script>').attr('src', 'js/events.js');
			$('.js').append(js);
			
			$('.portfolio').append($('#eventContents'));
			$('.container-portfolio').removeClass('container').addClass('container-fluid');
			
			if (page != undefined) {
				nextPage = page;
			}
			events.init();
		});		
	});
}).exit(function(){
	$('.banner').empty();
	$('.container-portfolio').addClass('container').removeClass('container-fluid');
	$('#eventContents').remove();
});



Path.map('#/eventsmgt').to(function(){
	$('head').append('<link rel="stylesheet" href="css/datepicker.css">');
	$('.js').append('<script src="js/lib/bootstrap-datepicker.js"></script>');
	
	$('#importHtml').load('eventsmgt.html', function(){
		var js = $('<script>').attr('src', 'js/eventsmgt.js');
		
		$('.js').append(js);
		
		$('#eventDate').datepicker({
			'setDate': new Date()
		});
	});
}).exit(function(){
	$('.js, .portfolio, .banner').empty();
	$('head link').last().remove();
});



Path.map('#/siteuser(/:userId)').to(function(){
	var userId = this.params.userId;
	if (userId != undefined) {
		
	}
	
	$('#importHtml').load('siteUser.html', function(){
		$('.portfolio').append($('#siteUserList'));
		var siteUserJs = $('<script>');
		siteUserJs.attr({src: 'js/siteuser.js'});
		
		$('.js').append(siteUserJs);
	});
	
	
}).exit(function(){
	$('.portfolio').empty();
});



$(document).ready(function (){
	// Path Initializations
	Path.root('#/index');
	Path.listen();
	Path.rescue(function (path){
		
	  /* window.location.href = '#/index';*/
	});
});