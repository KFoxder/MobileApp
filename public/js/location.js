$(document).ready(function(){
complete = function(){
	$('#long').attr('value','CHANGED');
	$('#lat').attr('value','CHanged');
	console.log('Step 1');
	$("form").hover(function(){
		alert('trigged');
	});
	console.log('Step 2');
	console.log('Step 3');
	/*$('form.ui-btn-right').submit();*/
};

});