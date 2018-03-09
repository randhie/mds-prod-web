var siteuser = (function($){
	method = {};
	
	method.getAllSiteUser = function() {
		var postObj = {};
		var url = '/mdstudioweb/getAllSiteUser.jctl';
		postObj['url'] = url;
		
		var result = app.doPost(postObj);
		if (result.isSuccess) {
			siteuser.populateUsers(result);
		}
		
	};
	
	
	method.populateUsers = function(result) {
		if (result.siteUserInfoList != undefined && result.siteUserInfoList.length > 0) {
			$.each(result.siteUserInfoList, function(idx, user){
				var row = $('<tr>').attr({id: user.userId});
				row.append($('<td>').append(user.emailAddress));
				row.append($('<td>').append(user.firstName));
				row.append($('<td>').append(user.lastName));
				row.append($('<td>').append(user.userStatus));
				
				var select = $('<select>').addClass('form-control');
				var options = user.authAlbums.split(',');
				$.each(options, function(i, option){
					var optionElm = $('<option>');
					optionElm.attr({value: option}).text(option);
					select.append(optionElm);
				});

				var select2 = $('<select>').addClass('form-control');
				var options2 = user.authUploads.split(',');
				$.each(options2, function(i, option){
					var optionElm = $('<option>');
					optionElm.attr({value: option}).text(option);
					select2.append(optionElm);
				});
				
				row.append($('<td>').append(select));
				row.append($('<td>').append(select2));
				
				if (user.isAdmin) {
					row.append($('<td>').append('Yes'));
				}
				else {
					row.append($('<td>').append('No'));
				}
				
				$('#siteUserTbody').append(row);
			});
		}
	};
	
	
	method.getSiteUser = function (userId) {
		if (userId != undefined) {
			var postObj = {};
			var url = '/mdstudioweb/getSiteUser.jctl';
			
			var data = {};
			data['userId'] = userId;
			
			postObj['url'] = url;
			postObj['data'] = data;
			
			var result = app.doPost(postObj);
			if (result.isSuccess) {
				
			}
			
		}
	};
	
	
	method.helperMethod = function () {
		$('body').unbind().click(function(e){
			var elm = $(e.target);
//			console.log(elm[0].localName);
			
			if (elm.closest('tbody')) {
				var tbodyId = elm.closest('tbody').attr('id');
				if (tbodyId == 'siteUserTbody') {
					if (elm[0].localName == 'select' || elm[0].localName == 'option') {
						return false;
					}
					if (elm.closest('tr')) {
						var elmTr= $(elm.closest('tr'));
						if (elmTr != undefined ) {
							siteuser.getSiteUser(elmTr.attr('id'));
						}
					}

				}
			}
						
			
		});
		
	};
	
	return method;
}(jQuery));




$(document).ready(function(){
	siteuser.getAllSiteUser();
	siteuser.helperMethod();
});