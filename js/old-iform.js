var sendTracking = sendTracking || function(){};

var redirectAfterSubmit = function(data,obj) {
	if (typeof data != "undefined" && data != null ){
		if (data.responseStatus == "Success"){
			sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Submitted', 'gaLabel' : 'PPC Form', 'gValue' : '' });
			window.location.href=thankYouUrl;
		} else if (data.responseStatus == "Fail") {
			$(".form-backend-error",obj.form).show();
		} else {
		   $(".form-backend-error",obj.form).show();
		}
	} else {
	   $(".form-backend-error",obj.form).show(); 
	}										
};


$(document).ready(function() {	
	
    // After Submit for old forms	
	$("#tisform").tisValidator({
              afterSubmit : redirectAfterSubmit 
    });
				

   	 // Term Box Events   	 
   	$('.open-terms-box').click(function(e) {
   		e.preventDefault();
   		$(".terms-box").show();
		// Analytics Terms and Conditions Link Click Event
		//_gaq.push(['_trackEvent', 'Lead Form', 'Click', 'Terms and Conditions Link']);
		//sendEvent('Lead Form','Click','Terms and Conditions Link');
		sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Click', 'gaLabel' : 'Terms and Conditions Link', 'gValue' : '' });
   		return false;
   	});
   	
   	$('.close-terms-box').click(function(e) {
   		e.preventDefault();
   		$("div.terms-box").hide();
   		return false;
   	});	
	
	
	// Analytics interaction
	//_gaq.push(['_setCustomVar',1,'lead_form','No',1]);	
	
	$("input, select, textarea").blur(function () {
           
		   var $this = $(this);
		   if($this.val().length > 0 ) {
			   // Analytics Field Completed Event
			   //_gaq.push(['_trackEvent', 'Lead Form', 'Field Completed', $this.attr('name')]);
			   //sendEvent('Lead Form','Field Completed',$this.attr('name'));
			   sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Field Completed', 'gaLabel' : $this.attr('name'), 'gValue' : '' });
			   if ($this.is("textarea")) {
					// Analytics Comments Added Event
					//_gaq.push(['_trackEvent', 'Lead Form', 'Comments', 'Added']); 
					//sendEvent('Lead Form','Comments','Added');
					sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Comments', 'gaLabel' : 'Added', 'gValue' : '' });
			   }
		   } 
		   else {
			   // Analytics Field Skipped Event
			   //_gaq.push(['_trackEvent', 'Lead Form', 'Field Skipped', $this.attr('name')]);
			   //sendEvent('Lead Form','Field Skipped',$this.attr('name'));
			   sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Field Skipped', 'gaLabel' : $this.attr('name'), 'gValue' : '' });
		   }
	});

	$(".fancy-checkbox").click(function(){
		   var $chkBoxObj = $(this).siblings(".checkbox");
		   if($chkBoxObj.is(":checked")) {
			   // Analytics Field Completed Event
			   //_gaq.push(['_trackEvent', 'Lead Form', 'Field Completed', $chkBoxObj.attr('name')]);
			   //sendEvent('Lead Form','Field Completed',$chkBoxObj.attr('name'));
			   sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Field Completed', 'gaLabel' : $chkBoxObj.attr('name'), 'gValue' : '' });
		   } 
		   else {
			   // Analytics Field Skipped Event
			   //_gaq.push(['_trackEvent', 'Lead Form', 'Field Skipped', $chkBoxObj.attr('name')]);
			   //sendEvent('Lead Form','Field Skipped',$chkBoxObj.attr('name'));
			   sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Field Skipped', 'gaLabel' : $chkBoxObj.attr('name'), 'gValue' : '' });
		   }
	});	

});


