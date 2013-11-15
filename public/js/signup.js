
$( document ).delegate("#signup", "pageinit", function() {
	//Make the signup button inactive until all fields are filled
	var username = $('#username');
	var email = $('#email');
	var pass1 = $('#password1');
	var pass2 = $('#password2');

	$('[type="submit"]').button('disable'); 

	$('input').change(function(){
		if(username.val().trim()!='' && email.val().trim()!='' && pass1.val().trim()!='' && pass2.val().trim()!=''){
			$('[type="submit"]').button('enable'); 
		}else{
			$('[type="submit"]').button('disable'); 
		}
	});
	


});
