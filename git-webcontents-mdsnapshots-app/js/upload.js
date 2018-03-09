var permDir = {};
var uploadId = 0;
var upload = (function(){
	method = {};
	
	method.init = function() {
		var bar = $('.bar');
		var percent = $('.percent');
		var status = $('#status');
		
		
		$('form').ajaxForm({
		    beforeSend: function() {
		        status.empty();
		        var percentVal = '0%';
		        bar.width(percentVal)
		        percent.html(percentVal);
		    },
		    uploadProgress: function(event, position, total, percentComplete) {
		        var percentVal = percentComplete + '%';
		        bar.width(percentVal)
		        percent.html(percentVal);
		       /* $('#progressbar').progressbar({value: percentComplete});*/
		        $('#captionDiv').text(percentComplete + "% Completed" );
				//console.log(percentVal, position, total);
		    },
		    success: function() {
		        var percentVal = '100%';
		        bar.width(percentVal)
		        percent.html(percentVal);
		    },
			complete: function(xhr) {
				if (xhr.responseText.indexOf('true') > 0) {
					 percent.html('<h4 style="color: blue; text-align: left;">Upload Completed. Photos will be available in few minutes</h4>');
					 $('#submitBtn').hide();
					 $('#fileUploaded').hide();
				}
				else if (xhr.responseText.indexOf('false') > 0) {
					status.html('Upload unsuccessful.');
				}
				else if (xhr.responseText.indexOf('HTTP Status 500') > 0) {
					status.html('File size exceeded. Maximum upload size is 500MB.');
				}
				else {
					status.html(xhr.responseText);
				}
			}
		}); 
	};
	
	
	method.getAllDirectoryUpload = function() {
		$.post('/mdstudioweb/getAllValidPhotoUploadDir.jctl', function(result){
			if (result.isSuccess) {
				if (result.photoUploadDirectoryList != undefined && result.photoUploadDirectoryList.length > 0) {
					upload.populateDirectories(result.photoUploadDirectoryList);
				}
				else {
					$('#directoryDiv').empty();
					$('#directoryDiv').append('Directory does not exist. Please email admin to provide permission at <br/> randyordinario@mdsnapshots.com');
				}
			}
			
		});
	};
	
	
	method.populateDirectories = function(directories){
		$('#category').empty();
		$('#directory').empty();

		var ctr = 0;
		$.each(directories, function(idx, dir){
			if (!permDir[dir.parentFolder]) {
				permDir[dir.parentFolder] = new Array();
				ctr = 0;
			}
			
			permDir[dir.parentFolder][ctr] = {id: dir.uploadId, value: dir.childFolder};
			ctr++;
		});
		
		upload.processAuthDirectories();
	};
	
	
	method.processAuthDirectories = function(){
		var isPopulated = false;
		$.each(permDir, function(key, val){
			var opt = $('<option>').attr({value: key}).html(key);
			$('#category').append(opt);
			
			if (isPopulated) {
				return true;
			}
			$.each(val, function(idx, v){
				var opt2 = $('<option>').attr({value: v.id}).html(v.value.replace(/_/g,' '));
				$('#directory').append(opt2);
			});
			isPopulated = true;
		});
		
		$('#category').unbind().change(function(){
			$('#directory').empty();
			$.each(permDir[$(this).val()], function(idx, val){
				var opt2 = $('<option>').attr({value: val.id}).html(val.value.replace(/_/g,' '));
				$('#directory').append(opt2);
			});
			
		});
	}
	
	return method;
}(jQuery));


$(document).ready(function(){
	upload.getAllDirectoryUpload();
	upload.init();
});