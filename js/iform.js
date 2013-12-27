var sendTracking = sendTracking || function(){};

var isPlaceHolderEnabled = function(){
	return ('placeholder'in document.createElement("input"));
};

var redirectAfterSubmit = function(data,obj) {
	if (typeof data != "undefined" && data != null ){
		if (data.responseStatus == "Success"){
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

var resetForm = function(){
	  if (typeof leadFormData != "undefined" && leadFormData != null ){
		 leadFormData.ResetForm();
		 if (!placeHolderEnabled){
		   leadFormData.ShowDefault();
		 }
	  }
};

var userInteract = false;
var placeHolderEnabled = isPlaceHolderEnabled();

$(document).ready(function() {
	
	if (typeof campaignID != "undefined"){
		$("input[name='campaign_number']").val(campaignID);		
	}
	
	// After Submit for hightlighted forms
	window.leadFormData = $("#hl-form").tisValidator({
              afterSubmit : redirectAfterSubmit 
    }).data("tisV");

    // For the leadform
    if (typeof leadFormData != "undefined" && leadFormData != null ){	
	
        if (!placeHolderEnabled){	
		   
			leadFormData.ShowDefault = function(){
				$("input, textarea",leadFormData.form).each(function(index, element) {
					var $this = $(this);
					var placeholder = $this.attr("placeholder");
					//if (typeof placeholder != "undefined" && !placeHolderEnabled){
					if (typeof placeholder != "undefined"){
						$this.val(placeholder);					       
					}
					
				});				
			};
			
			var defaultPhoneFormat = leadFormData.Format["phone"];
			
			leadFormData.Format["phone"] = function(){
				var e = arguments[0];
				var field = arguments[1];
				var _this = arguments[2];
				var $field = $(field);			
				defaultPhoneFormat(e,field,_this);
				if ($field.val() == "" && !$field.is(":focus")){			
					$field.val($field.attr("placeholder"));
				}
			};
		

			leadFormData.Validate["non-empty"] = function(){
						var e = arguments[0];
						var field = arguments[1];
						var _this = arguments[2];
						var $field = $(field);		
						
						if (field.value.length == 0 || field.value.replace(/\s/g,"") == "" || field.value == $field.attr("placeholder")) {	   
							_this.DropError(field);
						} 
						
			};			

			
			$('[placeholder]').focus(function() {
			  var input = $(this);
			  if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			  }
			}).blur(function() {
			  var input = $(this);
			  if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			  }
			}).blur();									
			
		}
		
		
		// Removing default before submiting
		var defaultSubmit = leadFormData.Submit;
		
		leadFormData.Submit = function(){
			// Analytics Submitted Event
			//_gaq.push(['_trackEvent', 'Lead Form', 'Submitted', leadFormData.form.attr("id")]);
			//sendEvent('Lead Form','Submitted',leadFormData.form.attr("id"));
			sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Submitted', 'gaLabel' : leadFormData.form.attr("id"), 'gValue' : '' });	
			
			// Analytics Support Type Event
			//_gaq.push(['_trackEvent', 'Lead Form', 'Support Type', $("select[name='reason']").val()]);
			//sendEvent('Lead Form','Support Type',$("select[name='reason']").val());
			sendTracking (true, 'trackEvent', { 'gaCategory' : 'Lead Form', 'gaAction' : 'Support Type', 'gaLabel' : $("select[name='reason']").val(), 'gValue' : '' });
			
			if (!placeHolderEnabled){
				$(".input,textarea",this.form).each(function(index, element) {
					var $this = $(this);
					if ($this.val() == $this.attr("placeholder")){
						$this.val("");
					}            
				});
			}			
			
			defaultSubmit.call(this);		
		
		};	
		
		leadFormData.ShowError["invalid"] = function(){
			var field = arguments[0];
			var _this = arguments[1];							
			var $field = $(field);		
			var errorMsg = $(field).siblings(".invalid-field");
			
			if (errorMsg.length == 0 && field.value != $field.attr("placeholder")){
				$field.parent(".input-wrapper").before("<span class='"+_this.conf.invalidClass+"'>"+_this.conf.invalidMsg+"</span>");
			}
			errorMsg.show();
		};
		
 
	}


	resetForm();
	
	var feedbackFormData = $("#feedbackform").tisValidator({
							  afterSubmit : redirectAfterSubmit 
						   }).data("tisV");


    // For the feedbackform
    if (typeof feedbackFormData != "undefined" && feedbackFormData != null ){
		
		var defaultSubmit = feedbackFormData.Submit;
		feedbackFormData.Submit = function(){                      
		  var totallength = "";
			  $("select,textarea",feedbackFormData.form).each(function(index) {
				  var $this = $(this);
				  if ($this.val() != $this.attr("placeholder")){
					 totallength += $this.val();		
				  }
			  });
			  if (totallength == "" &&  $("input:checked").length == 0) {
				  return false;
			  }
		  $('button[type="submit"]',feedbackFormData.form).attr('disabled', 'disabled');
			  defaultSubmit.call(feedbackFormData);
			  
		};
		
	}


					

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


