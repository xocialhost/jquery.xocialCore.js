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

// Facebook Initialization and Login Functions
	
$.xcInitFacebook = function(options){
	
	$('#fb-root').remove();
	
	$('body').append('<div id="fb-root"></div>');
	
	var settings = {
	  
	  'appId'		:	null,
	  'callback'	:	null,
	  'channelUrl'  :   'xocialhost.com/channelurl/',
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
			
			settings.channelUrl=location.protocol+'//'+settings.channelUrl;
			
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
	
$fn.xcFbLogin = function(options){
	
	var button = $(this);
	
	var settings = {
	  
	  'permissions'		:	null,
	  'callback'		:	null
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	button.onclick = function() {
		 
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
							  
						  },{scope:settings.permissions});
					
					
				} else {
				
					 FB.login(function(response){
										  
						  if (response.status==='connected') { 
						  
							if(typeof settings.callback == 'function'){ settings.callback.call(this); }
						  
						  } else { $.xcNotify('Extended Permissions Required'); }
						  
					  });
					  
				}
				
			  }
			
			},true);	 
		 
		 
		  
		
		
	 }
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
					
					$.xcNotify('<span style="font-size:12px;font-weight:bold;">Update Process Complete</span>');
				
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
    
    $(this).html('<iframe src="//player.vimeo.com/video/'+settings.videoId+'?title=0&amp;byline=0&amp;portrait=0&amp;color='+settings.color+'" width="'+settings.width+'" height="'+settings.height+'" frameborder="0"></iframe>');
    
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
    
    $(this).html('<iframe width="'+settings.width+'" height="'+settings.height+'" src="//www.youtube.com/embed/'+settings.videoId+'?rel=0" frameborder="0" allowfullscreen></iframe>');
    
}



//Based largely on jGFeed: http://jquery-howto.blogspot.com/2009/05/google-feeds-api-jquery-plugin.html
$.xcGFeed = function(options,callbackFnk){
	
	//$.blockUI();
	
	var settings = {
	  
	  'url'		:	null,
	  'callback':	null,
	  'num'		:  8
	  
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
	  
	  $.ajax({

			  dataType: 'jsonp',
			  url: gurl,
			  timeout:5000,
			  success: function (data) {
				  
					if(typeof (settings.callback) == 'function') {
					
						settings.callback.call(this, data.responseData.feed);
					
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

$.xcGetAlbums = function(options) {
	
	var settings = {
	  
	  'graph_id'	:	null,
	  'callback'    :	null,
	  'app_id'		:	null
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	$.blockUI();
	
	var params="action=getAlbums&graph_id="+settings.graph_id+"&application_id="+settings.app_id;
	
	$.ajax({

	  dataType: 'json',
	  type: 'POST',
	  data: params,
	  url: '/xc_core_helper',
	  
	  success: function (data) {
		  
		$.unblockUI();
		
		if(typeof (settings.callback) == 'function') {
					
			settings.callback.call(this, data);
		
		} else { return false; }
		
		  
	},
	  error: function(){
		  
		  		$.unblockUI();
		  
				$.xcNotify('There was an error processing your request');
		   }
	});
	
}

$.xcGetPhotos = function(options) {
	
	var settings = {
	  
	  'aid'			:	null,
	  'callback'    :	null,
	  'maxPhotos'	:	null,
	  'app_id'		:	null
	  
	};
	
	if ( options ) { 
	$.extend( settings, options );
	}
	
	$.blockUI();
	
	var params="action=getPhotos&album_id="+settings.aid+"&application_id="+settings.app_id+"&maxPhotos="+settings.maxPhotos;
	
	$.ajax({

	  dataType: 'json',
	  type: 'POST',
	  data: params,
	  timeout:25000,
	  url: '/xc_core_helper',
	  
	  success: function (data) {
		  
		$.unblockUI();
		
		if(typeof (settings.callback) == 'function') {
					
			settings.callback.call(this, data);
		
		} else { return false; }
		
		  
	},
	  error: function(){
		  
		  		$.unblockUI();
		  
				$.xcNotify('There was an error processing your request');
		   }
	});
	
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
	
	if(typeof (FB) === 'function') {
		
		FB.getLoginStatus(function(response) {
			
			  if (response.status === 'connected') { 
			  
				if ( settings.params == '' )  { settings.params='access_token='+settings.action; } else { settings.params=settings.params+'&access_token='+response.authResponse.accessToken; } 
				
				if ( settings.params == '' )  { settings.params='signed_request='+settings.action; } else { settings.params=settings.params+'&signed_request='+response.authResponse.signedRequest; } 
			  
			  }
		});
		
	}
		
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
		
		callback:null,
		/* Mode */
        splitMode:        'teaser',            
        cookieName:        'splitscreen',			
    	
    	/* True or False */
    	showFade:			true,				
    	showRaster:			true, 				
    	showCenter:			true, 				
    	showUnderlay:		true,					
    	showIntroSplit:		true, 				
    	showAutoSplit:		true, 				
    	showHints:			false, 				
    
    	/* Timer */
    	splitTimeIntro: 	2000, 		
    	splitTimeAuto:		15000, 
    
    	/* Align Teaser */
    	verticalAlignTeaser:	'middle',		 		
    
    	/* Align Buttons*/
    	verticalAlignBtn:	'middle',			
    	
    	/* Images */
		imageDir: 			'/resources/css/splitscreenimg/', // Image directory for splitscreen images 
		imageBG:			'/resources/css/splitscreenimg/caution.png', 	// Splitscreen background image is increased to fullscreen ('background.png')
		imageWidthBG: 		520, 				// ^Required: Actual width of the background image 
		imageHeightBG:		800, 				// ^Required: Actual height of the background image		
		imageRaster:		'raster00.png', 	// Raster image to use
		alphaRaster:		'80', 				// Alpha transparency of the raster image (i.e. '80', range is '0' to '99') 	
		imageCenter:		'/resources/css/splitscreenimg/logo-large.png',	// Center image	to use
    
    	/* Underlay */
    	colorUnderlay:			'#000000',			
    	alphaUnderlay:			'75'	
	  
	};
	
	if ( options ) { 
		$.extend( settings, options );
	  }
	  
	//Need to make sure we're a xocialhost domain.  If not use blockUI;
	if( window.location.host!='xocialhost.com' && window.location.host!='www.xocialhost.com') {
		
		if(typeof $.blockUI == 'function'){  $.blockUI({message:'<img src="'+settings.imageBG+'" style="width:90%;">'}); }
	
		return;
		
	}
	
	if( typeof( $.fn.splitscreen ) == 'undefined') {
	
		var css= "<link rel='stylesheet' id='splitCss' type='text/css' href='https://xocialhost.com/resources/css/splitscreen.css' title='tyle'  media='screen'/>";
		if($("#splitCss")) $("#splitCss").remove();
		$("head").prepend(css);
		
		$.getScript('//xocialhost.com/resources/scripts/licensed/jquery.xcXocialGate.min.js',function(){
			
			$('body').splitscreen(settings);
			
		});
		
		return;
		
	}
	
	$('body').splitscreen(settings);
	  
	if(typeof settings.callback == 'function'){ settings.callback.call(this); }
}

$.xcUpdatePagePreferences = function(options){
	
	$.blockUI();
	
	var settings = {
		
	  'pageId'		:	'',	
	  'form'		:	null
	  
	};
	
	if ( options ) { 
		$.extend( settings, options );
	  }
	  
	settings.params = $('#'+settings.form).serialize();
	  
	FB.getLoginStatus(function(response) {
		
		  if (response.status === 'connected') { 
		  
		  	settings.params=settings.params+'&access_token='+response.authResponse.accessToken; 
			
			settings.params=settings.params+'&signed_request='+response.authResponse.signedRequest; 
			
			settings.params=settings.params+'&action=updatePagePreferences';
			
			$.ajax({

			  dataType: 'json',
			  type: 'POST',
			  data: settings.params,
			  async:false,
			  url: '/xc_core_helper',
			  
			  success: function (response) {
				  
					$.unblockUI();
					
					$.xcNotify('<span style="font-size:12px;font-weight:bold;">Update Process Complete</span>');
				
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


/*!
 * jQuery blockUI plugin
 * Version 2.39 (23-MAY-2011)
 * @requires jQuery v1.2.3 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2010 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */



if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
	alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
	return;
}

$.fn._fadeIn = $.fn.fadeIn;

var noOp = function() {};

// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
// retarded userAgent strings on Vista)
var mode = document.documentMode || 0;
var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;

// global $ methods for blocking/unblocking the entire page
$.blockUI   = function(opts) { install(window, opts); };
$.unblockUI = function(opts) { remove(window, opts); };

// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
$.growlUI = function(title, message, timeout, onClose) {
	var $m = $('<div class="growlUI"></div>');
	if (title) $m.append('<h1>'+title+'</h1>');
	if (message) $m.append('<h2>'+message+'</h2>');
	if (timeout == undefined) timeout = 3000;
	$.blockUI({
		message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
		timeout: timeout, showOverlay: false,
		onUnblock: onClose, 
		css: $.blockUI.defaults.growlCSS
	});
};

// plugin method for blocking element content
$.fn.block = function(opts) {
	return this.unblock({ fadeOut: 0 }).each(function() {
		if ($.css(this,'position') == 'static')
			this.style.position = 'relative';
		if ($.browser.msie)
			this.style.zoom = 1; // force 'hasLayout'
		install(this, opts);
	});
};

// plugin method for unblocking element content
$.fn.unblock = function(opts) {
	return this.each(function() {
		remove(this, opts);
	});
};

$.blockUI.version = 2.39; // 2nd generation blocking at no extra cost!

// override these in your code to change the default behavior and style
$.blockUI.defaults = {
	// message displayed when blocking (use null for no message)
	message:  '<h1>Please wait...</h1>',

	title: null,	  // title string; only used when theme == true
	draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)
	
	theme: false, // set to true to use with jQuery UI themes
	
	// styles for the message when blocking; if you wish to disable
	// these and use an external stylesheet then do this in your code:
	// $.blockUI.defaults.css = {};
	css: {
		padding:	0,
		margin:		0,
		width:		'30%',
		top:		'40%',
		left:		'35%',
		textAlign:	'center',
		color:		'#000',
		border:		'3px solid #aaa',
		backgroundColor:'#fff',
		cursor:		'wait'
	},
	
	// minimal style set used when themes are used
	themedCSS: {
		width:	'30%',
		top:	'40%',
		left:	'35%'
	},

	// styles for the overlay
	overlayCSS:  {
		backgroundColor: '#000',
		opacity:	  	 0.6,
		cursor:		  	 'wait'
	},

	// styles applied when using $.growlUI
	growlCSS: {
		width:  	'350px',
		top:		'10px',
		left:   	'',
		right:  	'10px',
		border: 	'none',
		padding:	'5px',
		opacity:	0.6,
		cursor: 	'default',
		color:		'#fff',
		backgroundColor: '#000',
		'-webkit-border-radius': '10px',
		'-moz-border-radius':	 '10px',
		'border-radius': 		 '10px'
	},
	
	// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
	// (hat tip to Jorge H. N. de Vasconcelos)
	iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

	// force usage of iframe in non-IE browsers (handy for blocking applets)
	forceIframe: false,

	// z-index for the blocking overlay
	baseZ: 1000,

	// set these to true to have the message automatically centered
	centerX: true, // <-- only effects element blocking (page block controlled via css above)
	centerY: true,

	// allow body element to be stetched in ie6; this makes blocking look better
	// on "short" pages.  disable if you wish to prevent changes to the body height
	allowBodyStretch: true,

	// enable if you want key and mouse events to be disabled for content that is blocked
	bindEvents: true,

	// be default blockUI will supress tab navigation from leaving blocking content
	// (if bindEvents is true)
	constrainTabKey: true,

	// fadeIn time in millis; set to 0 to disable fadeIn on block
	fadeIn:  200,

	// fadeOut time in millis; set to 0 to disable fadeOut on unblock
	fadeOut:  400,

	// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
	timeout: 0,

	// disable if you don't want to show the overlay
	showOverlay: true,

	// if true, focus will be placed in the first available input field when
	// page blocking
	focusInput: true,

	// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
	applyPlatformOpacityRules: true,
	
	// callback method invoked when fadeIn has completed and blocking message is visible
	onBlock: null,

	// callback method invoked when unblocking has completed; the callback is
	// passed the element that has been unblocked (which is the window object for page
	// blocks) and the options that were passed to the unblock call:
	//	 onUnblock(element, options)
	onUnblock: null,

	// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
	quirksmodeOffsetHack: 4,

	// class name of the message block
	blockMsgClass: 'blockMsg'
};

// private data and functions follow...

var pageBlock = null;
var pageBlockEls = [];

function install(el, opts) {
	var full = (el == window);
	var msg = opts && opts.message !== undefined ? opts.message : undefined;
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
	var css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
	var themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
	msg = msg === undefined ? opts.message : msg;

	// remove the current block (if there is one)
	if (full && pageBlock)
		remove(window, {fadeOut:0});

	// if an existing element is being used as the blocking content then we capture
	// its current place in the DOM (and current display style) so we can restore
	// it when we unblock
	if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
		var node = msg.jquery ? msg[0] : msg;
		var data = {};
		$(el).data('blockUI.history', data);
		data.el = node;
		data.parent = node.parentNode;
		data.display = node.style.display;
		data.position = node.style.position;
		if (data.parent)
			data.parent.removeChild(node);
	}

	$(el).data('blockUI.onUnblock', opts.onUnblock);
	var z = opts.baseZ;

	// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
	// layer1 is the iframe layer which is used to supress bleed through of underlying content
	// layer2 is the overlay layer which has opacity and a wait cursor (by default)
	// layer3 is the message content that is displayed while blocking

	var lyr1 = ($.browser.msie || opts.forceIframe) 
		? $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
		: $('<div class="blockUI" style="display:none"></div>');
	
	var lyr2 = opts.theme 
	 	? $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>')
	 	: $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

	var lyr3, s;
	if (opts.theme && full) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
	}
	else if (opts.theme) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
	}
	else if (full) {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
	}			 
	else {
		s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
	}
	lyr3 = $(s);

	// if we have a message, style it
	if (msg) {
		if (opts.theme) {
			lyr3.css(themedCSS);
			lyr3.addClass('ui-widget-content');
		}
		else 
			lyr3.css(css);
	}

	// style the overlay
	if (!opts.theme && (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))))
		lyr2.css(opts.overlayCSS);
	lyr2.css('position', full ? 'fixed' : 'absolute');

	// make iframe layer transparent in IE
	if ($.browser.msie || opts.forceIframe)
		lyr1.css('opacity',0.0);

	//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
	var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
	$.each(layers, function() {
		this.appendTo($par);
	});
	
	if (opts.theme && opts.draggable && $.fn.draggable) {
		lyr3.draggable({
			handle: '.ui-dialog-titlebar',
			cancel: 'li'
		});
	}

	// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
	var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
	if (ie6 || expr) {
		// give body 100% height
		if (full && opts.allowBodyStretch && $.boxModel)
			$('html,body').css('height','100%');

		// fix ie6 issue when blocked element has a border width
		if ((ie6 || !$.boxModel) && !full) {
			var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
			var fixT = t ? '(0 - '+t+')' : 0;
			var fixL = l ? '(0 - '+l+')' : 0;
		}

		// simulate fixed position
		$.each([lyr1,lyr2,lyr3], function(i,o) {
			var s = o[0].style;
			s.position = 'absolute';
			if (i < 2) {
				full ? s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"')
					 : s.setExpression('height','this.parentNode.offsetHeight + "px"');
				full ? s.setExpression('width','jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 : s.setExpression('width','this.parentNode.offsetWidth + "px"');
				if (fixL) s.setExpression('left', fixL);
				if (fixT) s.setExpression('top', fixT);
			}
			else if (opts.centerY) {
				if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
				s.marginTop = 0;
			}
			else if (!opts.centerY && full) {
				var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
				var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
				s.setExpression('top',expression);
			}
		});
	}

	// show the message
	if (msg) {
		if (opts.theme)
			lyr3.find('.ui-widget-content').append(msg);
		else
			lyr3.append(msg);
		if (msg.jquery || msg.nodeType)
			$(msg).show();
	}

	if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
		lyr1.show(); // opacity is zero
	if (opts.fadeIn) {
		var cb = opts.onBlock ? opts.onBlock : noOp;
		var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
		var cb2 = msg ? cb : noOp;
		if (opts.showOverlay)
			lyr2._fadeIn(opts.fadeIn, cb1);
		if (msg)
			lyr3._fadeIn(opts.fadeIn, cb2);
	}
	else {
		if (opts.showOverlay)
			lyr2.show();
		if (msg)
			lyr3.show();
		if (opts.onBlock)
			opts.onBlock();
	}

	// bind key and mouse events
	bind(1, el, opts);

	if (full) {
		pageBlock = lyr3[0];
		pageBlockEls = $(':input:enabled:visible',pageBlock);
		if (opts.focusInput)
			setTimeout(focus, 20);
	}
	else
		center(lyr3[0], opts.centerX, opts.centerY);

	if (opts.timeout) {
		// auto-unblock
		var to = setTimeout(function() {
			full ? $.unblockUI(opts) : $(el).unblock(opts);
		}, opts.timeout);
		$(el).data('blockUI.timeout', to);
	}
};

// remove the block
function remove(el, opts) {
	var full = (el == window);
	var $el = $(el);
	var data = $el.data('blockUI.history');
	var to = $el.data('blockUI.timeout');
	if (to) {
		clearTimeout(to);
		$el.removeData('blockUI.timeout');
	}
	opts = $.extend({}, $.blockUI.defaults, opts || {});
	bind(0, el, opts); // unbind events

	if (opts.onUnblock === null) {
		opts.onUnblock = $el.data('blockUI.onUnblock');
		$el.removeData('blockUI.onUnblock');
	}

	var els;
	if (full) // crazy selector to handle odd field errors in ie6/7
		els = $('body').children().filter('.blockUI').add('body > .blockUI');
	else
		els = $('.blockUI', el);

	if (full)
		pageBlock = pageBlockEls = null;

	if (opts.fadeOut) {
		els.fadeOut(opts.fadeOut);
		setTimeout(function() { reset(els,data,opts,el); }, opts.fadeOut);
	}
	else
		reset(els, data, opts, el);
};

// move blocking element back into the DOM where it started
function reset(els,data,opts,el) {
	els.each(function(i,o) {
		// remove via DOM calls so we don't lose event handlers
		if (this.parentNode)
			this.parentNode.removeChild(this);
	});

	if (data && data.el) {
		data.el.style.display = data.display;
		data.el.style.position = data.position;
		if (data.parent)
			data.parent.appendChild(data.el);
		$(el).removeData('blockUI.history');
	}

	if (typeof opts.onUnblock == 'function')
		opts.onUnblock(el,opts);
};

// bind/unbind the handler
function bind(b, el, opts) {
	var full = el == window, $el = $(el);

	// don't bother unbinding if there is nothing to unbind
	if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
		return;
	if (!full)
		$el.data('blockUI.isBlocked', b);

	// don't bind events when overlay is not in use or if bindEvents is false
	if (!opts.bindEvents || (b && !opts.showOverlay)) 
		return;

	// bind anchors and inputs for mouse and key events
	var events = 'mousedown mouseup keydown keypress';
	b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

// former impl...
//	   var $e = $('a,:input');
//	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
};

// event handler to suppress keyboard/mouse events when blocking
function handler(e) {
	// allow tab navigation (conditionally)
	if (e.keyCode && e.keyCode == 9) {
		if (pageBlock && e.data.constrainTabKey) {
			var els = pageBlockEls;
			var fwd = !e.shiftKey && e.target === els[els.length-1];
			var back = e.shiftKey && e.target === els[0];
			if (fwd || back) {
				setTimeout(function(){focus(back)},10);
				return false;
			}
		}
	}
	var opts = e.data;
	// allow events within the message content
	if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
		return true;

	// allow events for content that is not being blocked
	return $(e.target).parents().children().filter('div.blockUI').length == 0;
};

function focus(back) {
	if (!pageBlockEls)
		return;
	var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
	if (e)
		e.focus();
};

function center(el, x, y) {
	var p = el.parentNode, s = el.style;
	var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
	var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
	if (x) s.left = l > 0 ? (l+'px') : '0';
	if (y) s.top  = t > 0 ? (t+'px') : '0';
};

function sz(el, p) {
	return parseInt($.css(el,p))||0;
};

})(jQuery);

