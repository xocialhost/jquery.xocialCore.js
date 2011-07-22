/*
Xocial Core 
ver 1.0
*/
;(function($) {
	
$.xcInitFacebook = function(options){
	
	$('#fb-root').remove();
	
	$('body').append('<div id="fb-root"></div>');
	
	var settings = {
	  
	  'apiKey'		:	null,
	  'callback'	:	null
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	window.fbAsyncInit = function() { FB.init({appId: apiKey, status: true, cookie: true, xfbml: true, oauth: true, authResponse: true }); 
		
	if(typeof settings.callback == 'function'){ settings.callback.call(this); }
	
	};
  
	(function() {
	var e = document.createElement('script'); 
	e.async = true;
	e.src = '//connect.facebook.net/en_US/all.js';
	document.getElementById('fb-root').appendChild(e);
	}());
	  
}
	
$.xcFbLogin = function(options){
	
	var settings = {
	  
	  'permissions'		:	null,
	  'callback'		:	null
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') { //Logged in let's check the permissions
		  
		  		if(settings.permissions!=null) {
		  
					var FQL = 'SELECT '+settings.permissions+' FROM permissions WHERE uid='+response.authResponse.userID;
					
					FB.api(
						  {
							method: 'fql.query',
							query: FQL
						  },
						  function(response) {
							  
							  var perms=settings.permissions.split(',');
							  
							  var hasPermission=1;
							  
							  $.each(perms, function(index, value) {
								  
								  value=$.trim(value);
								  
								  if(response[0][value]!="1" || response[0][value]=='undefined'){ hasPermission=0; }
								   
							   });
							  
							  if(hasPermission==1){
								  
								  if(typeof settings.callback == 'function'){ settings.callback.call(this); }
								  
							  } else {
								  
								  FB.login(function(response){
									  
									  if (response.status==='connected') { 
									  
										if(typeof settings.callback == 'function'){ settings.callback.call(this); }
									  
									  } else { $.xcNotify('Extended Permissions Required'); }
									  
								  },{scope:settings.permissions});
								  
								  
							  }
							  
							  
							  
						  }
						);
				} else {
					
					 FB.login(function(response){
									  
						  if (response.status==='connected') { 
						  
							if(typeof settings.callback == 'function'){ settings.callback.call(this); }
						  
						  } else { $.xcNotify('Extended Permissions Required'); }
						  
					  });
					
				}
			
		 } else { //No Login At All
		 
		 	if(settings.permissions!=null) {
				
				 FB.login(function(response){
									  
						  if (response.status==='connected') { 
						  
							if(typeof settings.callback == 'function'){ settings.callback.call(this); }
						  
						  } else { $.xcNotify('Extended Permissions Required'); }
						  
					  });
				
				
			} else {
			
				 FB.login(function(response){
									  
					  if (response.status==='connected') { 
					  
						if(typeof settings.callback == 'function'){ settings.callback.call(this); }
					  
					  } else { $.xcNotify('Extended Permissions Required'); }
					  
				  },{scope:settings.permissions});
				  
			}
			
		  }
		
		},true);
	
}

// Utility Section

$.xcNotify = function(msg){
	
	alert(msg);
}

$.trim = function (strng) {
	return strng.replace(/^\s+|\s+$/g,"");
}


/* end Xocial Core */	
})(jQuery);	