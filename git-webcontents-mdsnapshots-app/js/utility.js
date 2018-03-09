var startCheckingStatus;
var totalTempFiles = 0;


var utility = (function(){
	method = {};
	
	
	method.disabledEvnts = function() {
		$('#refreshContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#slideShowContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#referenceContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#emailTemplateContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#processTempBtn, #tempFolderName').attr({disabled: 'disabled', style: 'cursor: wait;' });
		
		$('#portfolioContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#previewPhotoContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#photoArchiveContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
		$('#refreshPhotoGathererContainer a').attr({title: 'click', style: 'color: gray; cursor: wait;'});
	};
	
	method.enabledEvnts = function() {
		$('#refreshContainer a').removeAttr('title').removeAttr('style');
		$('#slideShowContainer a').removeAttr('title').removeAttr('style');
		$('#referenceContainer a').removeAttr('title').removeAttr('style');
		$('#emailTemplateContainer a').removeAttr('title').removeAttr('style');
		$('#processTempBtn, #tempFolderName').removeAttr('disabled').removeAttr('style');
		
		$('#portfolioContainer a').removeAttr('title').removeAttr('style');
		$('#previewPhotoContainer a').removeAttr('title').removeAttr('style');
		$('#photoArchiveContainer a').removeAttr('title').removeAttr('style');
		$('#refreshPhotoGathererContainer a').removeAttr('title').removeAttr('style');
	};
	
	
	method.events = function() {
		$('#container span, #captionDiv').html('&nbsp;')
		$('#refreshContainer a').unbind().click(function(e){
			$('#container span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/refreshPhotoSvc.pics', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
					
					$.post('/mdstudioweb/refreshMapPhoto.jctl');
				}
			});
		});
		
		
		$('#referenceContainer a').unbind().click(function(e){
			$('span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/refreshReferenceData.jctl', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
				}
			});
		});
		
		
		
		$('#refreshPhotoGathererContainer a').unbind().click(function(e){
			$('span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/photoGathererRefreshData.jctl', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
				}
			});
		});
		
		
		
		$('#emailTemplateContainer a').unbind().click(function(e){
			$('span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/refreshEmailTemplates.jctl', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
				}
			});
		});
		

		$('#processTempBtn').unbind().click(function(){
			$('span, #captionDiv').html('&nbsp;')

			utility.disabledEvnts();
			$.post('/mdstudioweb/processTempFolders.jctl',
					{'category': $('#tempFolderName').val()}, function(result, xhr, settings, exception){
				if (result.isSuccess) {
					var stringResult = result.resultMsg.split(':');
					totalTempFiles = eval(stringResult[1]);
					
					if (totalTempFiles > 0) {
						$.post('/mdstudioweb/refreshMapPhoto.jctl');
						startCheckingStatus = setInterval(function() {
							utility.checkTempFolderStatus('tempPhoto');
						}, 2000);	
					}
					else {
						$('#captionDiv').removeClass('alert-info hide').addClass('alert-danger').html('Temporary Folder is empty');
						utility.enabledEvnts();
					}
				}
			});
		});
		
		
		
		$('#portfolioContainer a').unbind().click(function(e){
			$('span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/processPortofolioPhotos.jctl', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
					
					totalTempFiles = result.totalRecords;
					if (totalTempFiles > 0) {
						$.post('/mdstudioweb/photoGathererRefreshData.jctl');
						startCheckingStatus = setInterval(function(){
							utility.checkProcessedRecords();
						}, 2000);
					}
					else {
						$('#captionDiv').removeClass('alert-info hide').addClass('alert-danger').html('Temporary Folder is empty');
						utility.enabledEvnts();
					}
				}
			});
		});
		
		
		
		$('#previewPhotoContainer a').unbind().click(function(e){
			$('span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/processPreviewPhotos.jctl', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
					
					totalTempFiles = result.totalRecords;
					if (totalTempFiles > 0) {
						$.post('/mdstudioweb/photoGathererRefreshData.jctl');
						startCheckingStatus = setInterval(function(){
							utility.checkProcessedRecords();
						}, 2000);
					}
					else {
						$('#captionDiv').removeClass('alert-info hide').addClass('alert-danger').html('Temporary Folder is empty');
						utility.enabledEvnts();
					}
				}
			});
		});
		
		
		
		$('#photoArchiveContainer a').unbind().click(function(e){
			$('span, #captionDiv').html('&nbsp;')
			if ($(this).attr('title') != undefined) {
				return;
			}
			
			utility.disabledEvnts();
			$.post('/mdstudioweb/cleanPhotoArchives.jctl', function(result){
				if (result.isSuccess) {
					utility.enabledEvnts();
					
					totalTempFiles = result.totalRecords;
					if (totalTempFiles > 0) {
						$.post('/mdstudioweb/photoGathererRefreshData.jctl');
						startCheckingStatus = setInterval(function(){
							utility.checkProcessedRecords();
						}, 2000);
					}
					else {
						$('#captionDiv').removeClass('alert-info hide').addClass('alert-danger').html('Temporary Folder is empty');
						utility.enabledEvnts();
					}
				}
			});
		});
		
		
	};
	
	
	method.checkProcessedRecords = function() {
		utility.disabledEvnts();
		
		$.post('/mdstudioweb/getTotalRecordsProcessed.jctl', function(result){
			if (result.isSuccess) {
				var totalProcessed = eval(totalTempFiles) - eval(result.totalRecords);
				var percentageProcessed = eval(totalProcessed) / eval(totalTempFiles);
				var totalPercentage = percentageProcessed * 100;
				
				$('.progress').removeClass('hide');
				$('.progress-bar').attr({'aria-valuenow': totalPercentage, 'style': 'width:' + totalPercentage + '%'}).text(totalPercentage + '%');
				if (totalPercentage == 100) {
					utility.enabledEvnts();
					$('.progress-bar').removeClass('progress-bar-info').addClass('progress-bar-success').attr({'aria-valuenow': totalPercentage, 'style': 'width:100%'}).text(totalPercentage + '%' + ' Completed');
					utility.stopProgress();
				}
			}
		});
		
	};
	
	method.checkTempFolderStatus = function(folderType){
		utility.disabledEvnts();
		
		$.post('/mdstudioweb/countTempFolderFiles.jctl',
				{'folderType': folderType} ,function(result){
			if (result.isSuccess) {
				var totalProcessed = eval(totalTempFiles) - eval(result.countTempFiles);
				var percentageProcessed = eval(totalProcessed) / eval(totalTempFiles);
				var totalPercentage = percentageProcessed * 100;
				
				$('.progress').removeClass('hide');
				$('.progress-bar').attr({'aria-valuenow': totalPercentage, 'style': 'width:' + totalPercentage + '%'}).text(totalPercentage + '%');
				if (totalPercentage == 100) {
					utility.enabledEvnts();
					$('.progress-bar').removeClass('progress-bar-info').addClass('progress-bar-success').attr({'aria-valuenow': totalPercentage, 'style': 'width:100%'}).text(totalPercentage + '%' + ' Completed');
					utility.stopProgress();
				}
			}
		});
	};
	
	
	method.stopProgress = function(){
		clearInterval(startCheckingStatus);
		$.post('/mdstudioweb/photoGathererRefreshData.jctl');
		$.post('/mdstudioweb/refreshReferenceData.jctl');
		utility.enabledEvnts();
	};
	
	
	method.init = function() {
		if (!userObj['user']) {
			window.location.href = '#/index';
		}
		else if (userObj['user'].admin) {
			utility.events();
		}
	};
	
	return method;
}(jQuery));


$(document).ready(function(){
	utility.init();
});