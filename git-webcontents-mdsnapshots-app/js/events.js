var nextPage = 0;
var limit = 6;

var events = (function(){
	method = {};
	
	method.getEventInfo = function() {
		$('.pagination').find('li').removeClass('active');
		$('#paging').addClass('hide');
		
		var postObj = {};
		postObj['url'] = '/mdstudioweb/getAllEventInfo.jctl';
		var data = {};
		data['page'] = nextPage;
		data['limit'] = limit;
		
		postObj['data'] = data;
		var jsonResponse = app.doPost(postObj);
		if (jsonResponse.isSuccess) {
			if (jsonResponse.eventInfoList != undefined && jsonResponse.eventInfoList.length > 0) {
				events.populateEvents(jsonResponse);
				events.helperMethod(jsonResponse);
			}
			else {
				window.location.href = '/#/index';
			}
		}
		else if (jsonResponse.status != 200) {
			alert('Something went wrong. Please refresh your page.');
		}
	};
	
	
	
	method.helperMethod = function (result) {
		$('#eventContents').after($('#paging'));
		
		if (result.hasMore) {
			if (nextPage == 0) {
				$('#backBtn').addClass('hide');
			} 
			else {
				$('#backBtn').removeClass('hide');
			}
			
			$('#nextBtn').removeClass('hide');
			$('#nextBtn').unbind().click(function(){
				nextPage =+ 1;
				window.location.href = '/#/events/' + nextPage; 
			});
		}
		else {
			if (nextPage == 0) {
				$('#backBtn').addClass('hide');
			}
			else {
				$('#backBtn').removeClass('hide');
			}

			$('#nextBtn').addClass('hide');
			$('#backBtn').unbind().click(function(){
				nextPage = nextPage- 1;
				window.location.href = '/#/events/' + nextPage;
			});
		}
	};
	
	
	method.populateEvents = function (result) {
		var ctr = 0;
		var maxCols = 3;
		var divContainer = '';

		var divEventHeader = $('<div>');
		divEventHeader.addClass('container');
		divEventHeader.attr({align: 'center'});
		divEventHeader.append($('<h1>').addClass('lobster-font').text('Events'));
		$('#eventContents').html(divEventHeader);
		
		var eventInfoList = result.eventInfoList;
		$.each(eventInfoList, function(idx, event){
			if (ctr == 0) {
				divContainer = $('<div>');
				divContainer.addClass('container-fluid top-padding');		
			}
			
			var div = $('<div>');
			div.addClass('col-md-4 col-xs-4 container-fluid');
			
			var img = $('<img>');
			img.addClass('img-responsive img-thumbnail');
			img.attr({title: event.eventId ,src: '/mdstudioweb/viewPhoto.pics?directoryType=eventInfoBannerType&fileName=' + event.bannerLocation});
			img.load(function(){
				div.append(img);
				divContainer.append(div);
				ctr++;

				if (maxCols == ctr) {
					var divClear = $('<div>');
					divClear.addClass('clearfix buttom-margin');
					divContainer.append(divClear);
					ctr = 0;
				}
				
				$('#eventContents').append(divContainer);
				$('#paging').removeClass('hide');
				
				var eventName = $('<span style="font-size: 20px;">').text(event.eventName);
				div.append(eventName).append('<br/>');
				
				var eventDate = $('<span>').text(event.eventDate);
				div.append(eventDate).append('<br/>');
				
				var eventDescription = $('<span>').addClass('italic').text(event.description);
				div.append(eventDescription);
				
				if (event.eventWebUrl != undefined && event.eventWebUrl != '') {
					$(this).addClass('pointer');
					$(this).unbind().click(function(){
						window.open(event.eventWebUrl, '_blank');
					});
				}
			});
		});
		
		
	};
	
	
	
	return method;
}(jQuery));
