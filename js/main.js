/* ---- [ For GTM ] ---- */
var dataLayer = dataLayer || [];

$(function(){
	
	var $globalNavCont    = $('.global-nav-cont'),
	    $globalNav		  = $('.global-nav'),
	    $mainNav          = $('.nav-first'),
	    $megaMenu         = $('.mega-menu'),
		$close            = $('.close'),
		$megaAnchors      = $('.mega-menu a'),
		$pullQuoteDisplay = $('.pull-quote-display'),
		firstClick        = true,
		isVisible         = false,
		pullQuote,
		currentMenu,
		whichMenu,
		whichSubmenu,
		url = document.location.href;
	


	
	/* ----- [ Mega Nav functionality ] ---- */
	$megaMenu.slideUp(0);
	$mainNav.on('click', function(e){
		var $this = $(this);
		
		// Changing the pull quote
		pullQuote = $(this).next('span').text();
		if( pullQuote ) { showPullQuote( pullQuote ); }
		
		// Putting Mega-Nav into the right position
		// in the DOM so the slide function can work
		if( firstClick ) moveIntoPlace();
		
		removeActiveClass();
		$this.addClass('main-active');
		
		whichMenu = '#' + $this.data('menu');
		$megaMenu.animate({'height': '280px'});
		
		if( !isVisible ){
			e.preventDefault();
			//$megaMenu.slideDown( 500, 'easeOutBack' );
			$megaMenu.slideDown( 250 );
			isVisible = true;
		}
		if( currentMenu !== whichMenu ){
			e.preventDefault();
			$mainNav.addClass('active');
			hideOtherMenus();			
			$(whichMenu).removeClass('hidden').addClass('show');
			// ------------------------------------------------------------
			// need this to know which nav is open
			// ------------------------------------------------------------
			currentMenu = whichMenu;
		}
		
	});
	
	$close.on('click', function(e){
		e.preventDefault();
		//$megaMenu.slideUp( 250, 'easeInBack', function(){
		$megaMenu.slideUp( 250, function(){
			hideOtherMenus();
			removeActiveClass();
		});
		isVisible   = false;
		currentMenu = '';
		if (typeof window.megaNavCloseTimeout != "undefined"){
			window.clearInterval(window.megaNavCloseTimeout);
		}
	});
	
	$globalNavCont.on('mouseleave',function(e){
		// Trigger autoclose mega nav
		window.megaNavCloseTimeout = setTimeout(function(){
			$close.trigger('click');
		},3000);	
	}).on('mouseenter',function(e){
		if (typeof window.megaNavCloseTimeout != "undefined"){
			window.clearInterval(window.megaNavCloseTimeout);
		}		
	});;
	

	
	$megaAnchors.on('mouseover', function(e){
		pullQuote = $(this).next('span').text();
		if( pullQuote ) showPullQuote( pullQuote );
	});
	
	
	var $subNav        = $('.nav-options > a'),
	    $subNavOptions = $subNav.find('.mega-container'),
		currentSubmenu = '#tab1';
	
	// Below shows and hides the mega content to be displayed
	$subNav.on('click', function(e){
		$this = $(this);
		// setting this for the scope
		$parentSection = $this.parents(".menu-section");
		// removing all the active classes
		$('.nav-options > a',$parentSection).removeClass('active');
		
		// adding active to current item clicked
		$this.addClass('active');
		// finding the adjacent div and displaying it
		$this.find('.mega-container').css({'display' : 'block'});
		
		// defining which submenu i should go to 
		whichSubmenu = '#' + $this.data('submenu');
		// hiding all the submenus
		$('.nav-products > div',$parentSection).removeClass('show').addClass('hidden');
		// showing submenu desired
		$(whichSubmenu).removeClass('hidden').addClass('show');
		
		// for tablets, if picking a different sub menu, dont force them to the page but instead show the sub menu
		// if active submenu is clicked whild open, then go to desired page. 
		if( currentSubmenu !== whichSubmenu ) e.preventDefault();
		currentSubmenu = whichSubmenu;
		
	});
	
	
	/* ---- [ Google Tracking ] ---- */
   	var sendTracking = function( ditto, type, gaVars ){
		
		if( ditto ){
			$.ajax({
				type : "POST",
				url  : "/wps/LeadWebModule/LeadFormServlet",
				data : { 
						category  : gaVars.gaCategory,
						action    : gaVars.gaAction, 
						label     : gaVars.gaLabel, 
						form_type : "track-event" }
				}).done(function( msg ) {
			});
		}
			
		switch ( type ){
			case 'trackEvent':
				dataLayer.push({
					'event'      : type,
					'gaCategory' : gaVars.gaCategory,
					'gaAction'   : gaVars.gaAction,
					'gaLabel'    : gaVars.gaLabel,
					'gaValue'    : gaVars.gaValue
				});	
				break;
			case 'trackSocial':
				dataLayer.push({
					'event'          : type,
					'gaNetwork'      : gaVars.gaNetwork,
					'gaSocialAction' : gaVars.gaSocialAction,
					'gaOptTarget'    : gaVars.gaOptTarget,
					'gaOptPagePath'  : gaVars.gaOptPagePath
				});
				break;
			case 'customVar ':
				dataLayer.push({
					'event'   : type,
					'gaIndex' : gaVars.gaIndex,
					'gaName'  : gaVars.gaName,
					'gaValue' : gaVars.gaValue,
					'gaScope' : gaVars.gaScope
				});
				break;
			case 'undefined':
			case null: 
			case '':
				$.error('Undefined event type passed.');
		}
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	//                             Functions                                 //
	///////////////////////////////////////////////////////////////////////////
	
	// showPullQUote( pullQuote ) - Shows the pull quote on the right side. ---
	function showPullQuote(){
		$pullQuoteDisplay.text( pullQuote );
	}
	
	// moveIntoPlace() - Moves mega nav into the right spot in the dom --------
	function moveIntoPlace(){
		$globalNavCont.append( $megaMenu );
		//$global-nav.after( $megaMenu );
		firstClick = false;
	}
	
	// Hide all mega-menus ----------------------------------------------------
	function hideOtherMenus(){
		$mainNav.each(function(){
			$(this).removeClass('active');
		});
		$('.menu-section').each(function(){
			$(this).removeClass('show').addClass('hidden');
		});
	}
	
	// Taking the active class off the main navigation. -----------------------
	function removeActiveClass(){
		$mainNav.removeClass('main-active');
	}
	
	
	
	// ------------------------------------------------------------------------
	// This is an ie hack. 
	// Since ie 7 and 8 can't use :before and :after to add this via css,
	// this is an option to get it to work across board. 
	// ------------------------------------------------------------------------
	//addFocusBars( $('.menu-selection') );
	//addFocusBars( $('.title') );
	
	function addFocusBars( element ){
		element.prepend('/ ').append(' /');
	}
	
	// ------------------------------------------------------------------------
	// This opens and closes the blue cta areas
	// ------------------------------------------------------------------------
	var $cta = $('.cta');
	$cta.hover(function(){
		$this = $(this);
		
		$this.children('div').filter(':not(:animated)').animate({
			'top'    : '-135px',
			'height' : '220px'  
		}, 500, 'easeOutBack').addClass('cta-expanded');
		$(this).find('.cta-message').show();
	}, function(){
		
		$this.children('div').animate({
			'top'    : '0',
			'height' : '85px'
		}, 150, 'easeOutQuad', function(){
			$(this).find('.cta-message').hide();
		}).removeClass('cta-expanded');
		
	});
	
	
	
	
	/* ---- [ Accordion ] ---- */
	
	$('.accordion').accordion({
		 collapsible: true,
		 active: false,
		 heightStyle: 'content'
	});
	
	
	
	
	/*
	 *
	 * Messing around with a sticky navigation
	 * 
	 */
	var $globalNav    = $('.global-nav'),
		$megaNav      = $('.mega-menu'),
    	$stickyNavTop = 0;

		if ($globalNav.size()>0){
			$stickyNavTop = $globalNav.offset().top;
		}
	
	var stickyNav = function(){  
		var scrollTop = $(window).scrollTop();  
			   
		if (scrollTop > $stickyNavTop) {   
			$globalNav.addClass('sticky');  
			$megaNav.addClass('sticky').addClass('mega-sticky');
		} else {  
			$globalNav.removeClass('sticky'); 
			$megaNav.removeClass('sticky').removeClass('mega-sticky');
		}  
	};  
	  
	stickyNav();  
	  
	$(window).scroll(function() {  
		stickyNav();  
	});  
	
	
	/*************************************
	Tracking
	**************************************/

	// Social 
	$(".icon-facebook").click(function(){
		sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Facebook', 'gaSocialAction' : 'find', 'gaOptTarget' : $(this).attr("href"), 'gaOptPagePath' : '' });
	});
	$(".icon-twitter").click(function(){
		sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Twitter', 'gaSocialAction' : 'find', 'gaOptTarget' : $(this).attr("href"), 'gaOptPagePath' : '' });
	});
	$(".icon-google-plus").click(function(){
		sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Google Plus', 'gaSocialAction' : 'find', 'gaOptTarget' : $(this).attr("href"), 'gaOptPagePath' : '' });
	});
	$(".icon-linked-in").click(function(){
		sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Linkedin', 'gaSocialAction' : 'find', 'gaOptTarget' : $(this).attr("href"), 'gaOptPagePath' : '' });
	});
	$(".icon-you-tube").click(function(){
		sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Youtube', 'gaSocialAction' : 'find', 'gaOptTarget' : $(this).attr("href"), 'gaOptPagePath' : '' });
	});	
	$(".icon-rss").click(function(){
		sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'RSS', 'gaSocialAction' : 'find', 'gaOptTarget' : $(this).attr("href"), 'gaOptPagePath' : '' });
	});


	// Managed Services
	$(".login-btn").click(function(e){
		//_gaq.push(['_setCustomVar',2,'manage_services','YES',1]);
		sendTracking( true, 'trackEvent', { 'gaCategory' : 'Outbound Link', 'gaAction' : 'exit', 'gaLabel' : 'manage services link', 'gValue' : ''});
	});	

	// Download btn
	$("a.download-btn").click(function(){
		sendTracking (true, 'trackEvent', { 'gaCategory' : 'Downloads', 'gaAction' : 'download', 'gaLabel' : $(this).attr("href"), 'gValue' : ''});
	});
	
	// Breadcrumb
	$(".bread-crumbs a").click(function(){
		sendTracking (true, 'trackEvent', { 'gaCategory' : 'Breadcrumb', 'gaAction' : $(this).attr("title"), 'gaLabel' : window.location.href, 'gValue' : ''});
	});
	
	// Right Rail Promo
	$(".promo a").click(function(){
	   	sendTracking (true, 'trackEvent', { 'gaCategory' : 'Site Nav', 'gaAction' : 'Right Rail Promo', 'gaLabel' : $(this).attr("title"), 'gValue' : ''});
	});
	
	
	/*************************************************************************/
	/** Capture the current url and place the appropriate link in the href. **/
	/*************************************************************************/
	$('.social-btn').each(function(){
		var newLink,
		    $this = $(this);
		$this.on('click', function(e){
			switch ( true ){
				case $this.hasClass('share-facebook'):
					newLink = 'http://www.facebook.com/sharer.php?u=' + url;
					sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Facebook', 'gaSocialAction' : 'share', 'gaOptTarget' : newLink, 'gaOptPagePath'  : '' });
					break;
				case $this.hasClass('share-twitter'):
					newLink = 'http://twitter.com/share?url=' + url;
					sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'Twitter', 'gaSocialAction' : 'share', 'gaOptTarget' : newLink, 'gaOptPagePath' : '' });
					break;
				case $this.hasClass('share-linkedin'):
					newLink = 'http://www.linkedin.com/shareArticle?mini=true&url=' + url;
					sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'LinkedIn', 'gaSocialAction' : 'share', 'gaOptTarget' : newLink, 'gaOptPagePath' : '' });
					break;
				case $this.hasClass('share-googleplus'):
					newLink = 'https://plus.google.com/share?url=' + url;
					sendTracking ( false, 'trackSocial', { 'gaNetwork' : 'GooglePlus', 'gaSocialAction' : 'share', 'gaOptTarget' : newLink, 'gaOptPagePath'  : '' });
					break;
			}
			$this.attr('href', newLink);
		});
	});
	
	
	/*************************************
	Modal
	**************************************/

    var iframe = $('<a href="#" class="ui-tis-modal-close sprite" title="close">Close</a><iframe frameborder="0" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" allowfullscreen></iframe>');
    var defaultWidth = 880;
	var defaultHeight = 620;
	var iframePadding = 40;
	// Defaul dialog
	var dialogDiv = $("<div></div>").append(iframe).appendTo("body").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: defaultWidth,
        height: defaultHeight,
		show:{effect: 'fade', duration: 200},
		hide:{effect: 'fade', duration: 200},
		dialogClass: 'ui-tis-modal',
		open: function(event, ui) { 
		  $('.ui-widget-overlay').on('click', function(){ 
				dialogDiv.dialog('close'); 
		  }); 
		},
        close: function () {
            iframe.attr("src", "");
        }
    });
	
	var openModal = function (src, modal, width, height, pos){
		if (typeof width == "undefined") width = defaultWidth;
		if (typeof height == "undefined") height = defaultHeight;
		if (typeof modal == "undefined") modal = true;
		if (typeof pos == "undefined") pos = { my: "center", at: "center", of: window };		
		
        iframe.attr({
            width: +(width-iframePadding),
            height: +(height-iframePadding),
            src: src
        });

		dialogDiv.dialog("option", { 
		     width: width,
			 height: height,
			 modal:modal,
			 position:pos
		}).dialog("open");		
	};

   /*	
   $(".open-modal").on("click", function (e) {
        e.preventDefault();
        var src = $(this).attr("href");
        var width = $(this).attr("data-width");
        var height = $(this).attr("data-height");
        openModal (src, width, height);
    });	
	*/
	
	
   $(".open-modal-video").on("click", function (e) {
        e.preventDefault();
		
		var servletPref = "/wps/wcm/connect/tycois_us_v2/tycois";
		var servletSuf = "?presentationtemplate=pt_video_player_v2";
        var src = servletPref + $(this).attr("href")+servletSuf;
        openModal (src);
    });

   $(".open-modal-feedback").on("click", function (e) {
        e.preventDefault();
		var width = 320;
		var height = 460;
		var servletPref = "/wps/wcm/connect/tycois_us_v2/tycois";
		var servletSuf = "?presentationtemplate=pt_content_only";
        var src = servletPref + $(this).attr("href")+servletSuf;
        openModal (src, true, width, height);
    });
	
	$(".open-terms-box").on("click", function (e) {
        e.preventDefault();
		var width = 360;
		var height = 230;
		var modal = false;
		var servletPref = "/wps/wcm/connect/tycois_us_v2/tycois";
		var servletSuf = "?presentationtemplate=pt_content_only";
        var src = servletPref + $(this).attr("href")+servletSuf;
		var pos = { my: "left+3 bottom-3", of: e };
        openModal (src, modal, width, height, pos);
    });
	
	 $(".ui-tis-modal-close").on("click", function (e) {
        e.preventDefault();
		dialogDiv.dialog("close");
     });
	 
	/*************************************
	  Feed
	**************************************/
	$(".feed-item").click(function(){
		var $this = $(this);
		$this.siblings(".feed-op").slideToggle(150);
		sendTracking (true, 'trackEvent', { 'gaCategory' : 'Site Nav', 'gaAction' : 'RSS Interest', 'gaLabel' : $this.text(), 'gValue' : '' });
		return false;
	});
	
	$(".feed-item-rss").click(function(){
		sendTracking (true, 'trackEvent', { 'gaCategory' : 'Site Nav', 'gaAction' : 'RSS File', 'gaLabel' : $(this).attr("href"), 'gValue' : '' });		
	});
	
	$(".feed-item-atom").click(function(){
		sendTracking (true, 'trackEvent', { 'gaCategory' : 'Site Nav', 'gaAction' : 'Atom File', 'gaLabel' : $(this).attr("href"), 'gValue' : ''});
	});	 
	 
	 
	 
});