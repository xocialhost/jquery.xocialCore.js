/* jQuery Xocial Core Plugin
*  Plugin to access OpenMenu
*  version 0.0.1, July 12, 2011
*  by Dustin Nielson - http://www.xocialhost.com

	Copyright (C) 2011 Dustin Nielson for Xocial Host except as noted by attributions.
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

*  This plugin incorporates some revised MIT licensed plugins so some 
*  sections Copyright the orignal authors.
*  license: MIT
*/

;(function($) {
	
$.getScript('https://raw.github.com/malsup/blockui/master/jquery.blockUI.js');	

// Facebook Initialization and Login Functions
	
$.xcInitFacebook = function(options){
	
	$('#fb-root').remove();
	
	$('body').append('<div id="fb-root"></div>');
	
	var settings = {
	  
	  'appId'		:	null,
	  'callback'	:	null,
	  'channelUrl'  :   null,
	  'status'		:	true,
	  'cookie'		:	true,
	  'xfbml'		:	true
	
	};
	
	if ( options ) { 
		$.extend( settings, options );
	}
	
	if( typeof( xc_app_id ) == 'undefined' ) { window.xc_app_id = settings.appId; }  
	
	window.fbAsyncInit = function() { 
	
		if(settings.channelUrl==null) {
	
			FB.init({appId: settings.appId, status: settings.status, cookie: settings.cookie, xfbml: settings.xfbml, oauth: true, authResponse: true }); 
			
		} else {
			
			FB.init({appId: settings.appId, status: settings.status, cookie: settings.cookie, xfbml: settings.xfbml, oauth: true, authResponse: true, channelUrl: settings.channelUrl }); 
		}
		
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


//Xocialize Functions

$.xcGetXocializeAccount = function(options){
	
	var settings = {
		
	  'pageId'		:	'',	
	  'account'	    :   '',
	  'callback'	:   null
	  
	};
	
	if ( options ) { 
		$.extend( settings, options );
	  }
	  
	var url = "//xocialize.com/api/"+settings.pageId+"/"+settings.account+"/?callback=?";
	  
	  // AJAX request the API
	  $.getJSON(url, function(data){
		  
		if(typeof settings.callback == 'function') {
		
		  settings.callback.call(this, data);
		  
		} else
		  return false;
	  });
	
}

$.xcUpdateXocializeAccount = function(options){
	
	$.blockUI();
	
	var settings = {
		
	  'pageId'		:	'',	
	  'account'	    :   '',
	  'accountId'	:	'',
	  'params'		:	''
	  
	};
	
	if ( options ) { 
		$.extend( settings, options );
	  }
	  
	FB.getLoginStatus(function(response) {
		
		  if (response.status === 'connected') { 
		  
		  	settings.params=settings.params+'&access_token='+response.authResponse.accessToken; 
			
			settings.params=settings.params+'&signed_request='+response.authResponse.signedRequest; 
			
			settings.params=settings.params+'&account_id='+settings.accountId; 
			
			settings.params=settings.params+'&account='+settings.account; 
			
			settings.params=settings.params+'&page_id='+settings.pageId;
			
			settings.params=settings.params+'&action=updateXocialize';
			
			$.ajax({

			  dataType: 'json',
			  type: 'POST',
			  data: settings.params,
			  async:false,
			  url: '/xc_core_helper',
			  
			  success: function (response) {
				  
					$.unblockUI();
					
					$.xcNotify('Update Process Complete');
				
				},
			  error: function(){
				  
				  		$.unblockUI();
				  
						$.xcNotify('There was an error processing your request');
				   }
			});
			 
			
		 }
	});
	
	$.unblockUI();
	
}

// Social Media Functions

$.fn.loadVimeoVideo = function(options){
    
    var settings = {
      
      'videoId'	   :	'',
	  'color'	   :	'ff0179',
      'width'      :    '480',
      'height'     :    '390'
      
     };
    
    if ( options ) { 
    $.extend( settings, options );
    }
    
    $(this).html('<iframe src="http://player.vimeo.com/video/'+settings.videoId+'?title=0&amp;byline=0&amp;portrait=0&amp;color='+settings.color+'" width="'+settings.width+'" height="'+settings.height+'" frameborder="0"></iframe>');
    
}

$.fn.loadYouTubeVideo = function(options){
    
    var settings = {
      
      'videoId'	   :	'',
	  'color'	   :	'ff0179',
      'width'      :    '480',
      'height'     :    '390'
      
     };
    
    if ( options ) { 
    $.extend( settings, options );
    }
    
    $(this).html('<iframe width="'+settings.width+'" height="'+settings.height+'" src="http://www.youtube.com/embed/'+settings.videoId+'?rel=0" frameborder="0" allowfullscreen></iframe>');
    
}



//Based largely on jGFeed: http://jquery-howto.blogspot.com/2009/05/google-feeds-api-jquery-plugin.html
$.xcGFeed = function(options,callbackFnk){
	
	$.blockUI();
	
	var settings = {
	  
	  'url'	:	null,
	  'num'	:  8
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	 if(settings.url == null) return false;
	  // Build Google Feed API URL
	  var gurl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+encodeURIComponent(settings.url);
	  if(settings.num != null) gurl += "&num="+settings.num;
	  if(settings.key != null) gurl += "&key="+settings.key;
	  // AJAX request the API
	  $.getJSON(gurl, function(data){
		if(typeof callbackFnk == 'function') {
		
		  callbackFnk.call(this, data.responseData.feed);
		  
		  $.unblockUI();
		  
		} else
		  return false;
	  });
	
}

// Based in large part on jQuery.tweetable from 
$.xcTweetable = function (options) {
	
		//specify the plugins defauls
        var settings = {
            limit: 15, 						//number of tweets to show
            username: 'xocialhost',
			callback:null, 	
            time: false, 					//display date
            replies: false,				//filter out @replys
            position: 'append'			//append position
        };
        //overwrite the defaults
        var options = $.extend(settings, options);
		
		//assign our initial vars
            var $tweetList;
            var tweetMonth = '';
            var shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            var api = "//api.twitter.com/1/statuses/user_timeline.json?include_rts=1&screen_name=";
            var count = "&count=";
		
		//loop through each instance
       // return this.each(function (options) {
			
            //do a JSON request to twitters API
			
			$.ajax({

			  dataType: 'jsonp',
			  url: api + settings.username + count + settings.limit,
			  timeout:2000,
			  success: function (data) {
				  
					if(typeof (settings.callback) == 'function') {
					
						settings.callback.call(this, data);
					
					} else { return false; }
				
				},
			  error: function(){
				  
				  		$.unblockUI();
				  
						$.xcNotify('There was an error processing your request');
						
						var data={};
						
						data.error=1;
						
						if(typeof (settings.callback) == 'function') {
					
							settings.callback.call(this, data);
					
						} else { return false; }
				   },
			  statusCode: {
				404: function() {
				  alert('page not found');
				}
			  }
				  
			});
			
           
		   
        
}


$.fn.xcCalendar = function(options,callback){
	
	if( typeof( xhCurrentMonth ) == 'undefined' || typeof( xhCurrentYear ) == 'undefined' || typeof( xhCurrentDay ) == 'undefined' ) { 
	
		var xhDate = new Date();
		
		window.xhCurrentDay = xhDate.getFullYear();
		
		window.xhCurrentMonth = xhDate.getMonth() + 1; 
		
		window.xhCurrentYear = xhDate.getFullYear(); 
		
	}  
	
	$obj = $(this); 
	
	var settings = {
	  
	  'action'	:	'getCalendar'
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	var params=settings;
	
	$.blockUI();
	
	$.ajax({

	  dataType: 'json',
	  type: 'POST',
	  data: params,
	  url: '/calendar',
	  
	  success: function (response) {
		  
		  $obj.html(response.calendar);
		  
		  if(typeof callback == 'function'){ callback.call(this); }
		  
		  $.unblockUI();
		  
	},
	  error: function(){
		  
				alert('There was an error processing your request');
		   }
	});
}

$.xcEvents = function(options){
	
	$.blockUI();
	
	if( typeof( xhCurrentMonth ) == 'undefined' || typeof( xhCurrentYear ) == 'undefined' || typeof( xhCurrentDay ) == 'undefined' ) { 
	
		var xhDate = new Date();
		
		window.xhCurrentDay = xhDate.getFullYear();
		
		window.xhCurrentMonth = xhDate.getMonth() + 1; 
		
		window.xhCurrentYear = xhDate.getFullYear(); 
		
	}  
	
	var settings = {
	  
	  'action'			:	'getMonthEvents',
	  'timezone'		:	xh_tz_info.timezone.olson_tz,
	  'currentDay'		:	xhCurrentDay,
	  'currentMonth'	:	xhCurrentMonth,
	  'currentYear'		:	xhCurrentYear,
	  'page_id'			:	fb_page_id,
	  'app_id'			:	fb_application_id
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	var params=settings;
	
	var returnme=[];
	
	$.ajax({

	  dataType: 'json',
	  type: 'POST',
	  data: params,
	  async:false,
	  url: '/calendar',
	  
	  success: function (response) {
		  
		returnme = response;
		
		$.unblockUI();
		
		  
	},
	  error: function(){
		  
				$.xcNotify('There was an error processing your request');
		   }
	});
	
	return returnme;
}


// Utility Section

$.fn.xcAjax = function (options) {
	
	var $obj = $(this);
	
	var settings = {
		
	  'params'		:	'',	
	  'preCallback'	:	null,	
	  'postCallback':	null,	
	  'target'		:	'',
	  'form'		:	'',
	  'action'		:   '',
	  'dataType'	:   'json',
	  'url'			:	''
	  
	};
	
	if ( options ) { 
		$.extend( settings, options );
	  }
	  
	if (settings.form!='') { if ( settings.params == '' ) { settings.params=$('#'+settings.form).serialize(); } else { settings.params=settings.params+'&'+$('#'+settings.form).serialize(); } }
	  
	if (settings.action!='') { if ( settings.params == '' )  { settings.params='action='+settings.action; } else { settings.params=settings.params+'&action='+settings.action; } }
	
	FB.getLoginStatus(function(response) {
		
		  if (response.status === 'connected') { 
		  
		  	if ( settings.params == '' )  { settings.params='access_token='+settings.action; } else { settings.params=settings.params+'&access_token='+response.authResponse.accessToken; } 
			
			if ( settings.params == '' )  { settings.params='signed_request='+settings.action; } else { settings.params=settings.params+'&signed_request='+response.authResponse.signedRequest; } 
		  
		  }
	});
	
	if(typeof settings.preCallback == 'function'){ settigs.preCallback.call(this); }
		  
	$.ajax({
		
	  dataType: settings.dataType,
	  type: 'POST',
	  data: settings.params,
	  url: settings.url,
	  success: function (response) {
		  
		 if(settings.target!=''){
			 
			 	$('#'+settings.target).html(response.html_content);
			 
		 } else { 
		 
		 		$obj.html(response.html_content); 
			 
		}
		  
			if(typeof settings.postCallback == 'function'){ settings.postCallback.call(this); }
		 
		},
	  error: function(){
		  
		  		$.xcNotify('There was an error processing your request');
		   }
	});

}

$.timeAgo = function(date1, date2, granularity){
	
	var self = this;
	
	periods = [];
	periods['week'] = 604800;
	periods['day'] = 86400;
	periods['hour'] = 3600;
	periods['minute'] = 60;
	periods['second'] = 1;
	
	if(!granularity){
		granularity = 5;
	}
	
	(typeof(date1) == 'string') ? date1 = new Date(date1).getTime() / 1000 : date1 = new Date().getTime() / 1000;
	(typeof(date2) == 'string') ? date2 = new Date(date2).getTime() / 1000 : date2 = new Date().getTime() / 1000;
	
	if(date1 > date2){
		difference = date1 - date2;
	}else{
		difference = date2 - date1;
	}

	output = '';
	
	for(var period in periods){
		var value = periods[period];
		
		if(difference >= value){
			time = Math.floor(difference / value);
			difference %= value;
			
			output = output +  time + ' ';
			
			if(time > 1){
				output = output + period + 's ';
			}else{
				output = output + period + ' ';
			}
		}
		
		granularity--;
		if(granularity == 0){
			break;
		}	
	}
	
	return output + ' ago';
}


$.xcNotify = function(msg){
	
	if(typeof $.blockUI == 'function'){  //Check to see if $.blockUI is a function.  If so we have the block UI plugin installed so use it.
	
		$.blockUI({ 
            message: msg, 
            fadeIn: 700, 
            fadeOut: 700, 
            timeout: 2000, 
            showOverlay: false, 
            centerY: false, 
            css: { 
                width: '350px', 
                top: '10px', 
                left: '', 
                right: '10px', 
                border: 'none', 
                padding: '5px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .6, 
                color: '#fff' 
            } 
        }); 
		
	} else {
	
		alert(msg);
	
	}
}

$.xcFanGate = function(options){
	
	var settings = {
		
	  
	};
	
	if ( options ) { 
		$.extend( settings, options );
	  }
	
	
}

$.trim = function (strng) {
	
	return strng.replace(/^\s+|\s+$/g,"");
}

$.fn.clearForm = function() {
  return this.each(function() {
 var type = this.type, tag = this.tagName.toLowerCase();
 if (tag == 'form')
   return $(':input',this).clearForm();
 if (type == 'text' || type == 'password' || tag == 'textarea' || type == 'hidden')
   this.value = '';
 else if (type == 'checkbox' || type == 'radio')
   this.checked = false;
 else if (tag == 'select')
   this.selectedIndex = 0;
  });
};

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};


// Arguments are image paths relative to the current page.
$.preLoadImages = function() {
	if( typeof( cache ) == 'undefined' ) { window.cache = []; }  
	var args_len = arguments.length;
	for (var i = args_len; i--;) {
	  var cacheImage = document.createElement('img');
	  cacheImage.src = arguments[i];
	  cache.push(cacheImage);
	}
}

/* end Xocial Core */	
})(jQuery);	