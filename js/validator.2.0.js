/**
 * TycoIS - Real Time Form Validator Plugin 
 * Version: 2.0
 * Author: Alain Gonzalez
 * Dependencies: Jquery
 * Description: Define the config parameters and add classes (required, non-empty, email, phone, zipcode) to your form fields.
*/

(function( $ ){

	$.fn.tisValidator = function( options ) {  
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
									checkboxSpanClass : "fancy-checkbox",
									selectSpanClass : "fancy-select",
									textAreaSpanClass : "fancy-textarea",	
									radioDivClass : "fancy-radio",								
									invalidClass : "invalid-field",
									invalidMsg : "Invalid Value",
									postUrl : "/wps/LeadWebModule/LeadFormServlet",
									errors : 0,
									errorClass : "wrong-field",
									formErrorClass : "form-error",
									backEndErrorClass : "form-backend-error",
									afterSubmit : function(data,obj) {
										  var formCont = obj.form.parents("div.form-container");
										  if (typeof data != "undefined" && data != null ){
											  if (data.responseStatus == "Success"){
												  $(".form-wrapper",formCont).hide();
												  $(".thankyou",formCont).show();
											  } else if (data.responseStatus == "Fail") {
												  $(".form-backend-error",formCont).show();
											  } else {
												 $(".form-backend-error",formCont).show();
											  }
										  } else {
											 $(".form-backend-error",formCont).show(); 
										  }
									}  ,
									afterError : function(obj) {
										var formCont = obj.form.parents("div.form-container");
									     $(".form-backend-error",formCont).show();
									}
								}, options);
         
	     return this.each(function(i,form) {
			 	var $this = $(this);
				if ( typeof $this.data('tisV') == "undefined"){                
		  		  var validateForm = new tisVal(settings, $this);
				  $this.data('tisV',validateForm);
				}
         });
		
	};

	var tisVal = function(options, formObj){
		this.form = formObj;
		this.conf = options;
        this.Init();
	};	
	


	tisVal.proto = {
		
		Init : function(){
			this.ApplyStyles();
			this.Parse();
			var _this = this;		
			this.form.submit(function(e){
				e.preventDefault();				
				_this.Parse(e,_this);
				return false;
			}); 		
		},
		
		ApplyStyles : function(){
			
			var _this = this;
			$(".checkbox",_this.form).each(function(index, element) {
				var elem = $(element);
				var sibClass = elem.attr("class");
				$(element).before('<span class="'+_this.conf.checkboxSpanClass+' '+sibClass+'"></span>');
			});
			
			$("select",_this.form).each(function(index, element) {
				var elem = $(element);
				var sibClass = elem.attr("class");
				var defaultText = $("option:selected", $(elem)).text();
				$(element).before('<span class="'+_this.conf.selectSpanClass+' '+sibClass+'">'+defaultText+'</span>');
			});	
			
			$("textarea",_this.form).each(function(index, element) {
				$(element).wrap('<div class="'+_this.conf.textAreaSpanClass+'" />');
			});
			
			$(".radio",_this.form).each(function(index, element) {
				var elem = $(element);
				$(element).parent('div').addClass(_this.conf.radioDivClass);
			});	
			
			$("."+_this.conf.radioDivClass+" span",_this.form).click(function() {
				var elem = $(this);
				elem.addClass("radio-on").prev("input[type='radio']").trigger("click");
				elem.siblings("span").removeClass("radio-on");
				_this.ResetField(null,elem.parent("."+_this.conf.radioDivClass),_this);				
				return false;
			});									
			
			$("."+this.conf.checkboxSpanClass,_this.form).click(function(){
					var chkBoxObj = $(this).siblings(".checkbox");
					chkBoxObj.trigger("click");
					_this.Validate["checkbox"](null,chkBoxObj,_this);
			});			
			
			$("select",_this.form).change(function(){
			  $(this).siblings("span").text( $("option:selected", $(this)).text());
			});	
			
			$("input[type='text']",_this.form).each(function(index, element) {
				var inputClass = $(this).attr("class");
			    $(element).wrap('<div class="input-wrapper '+inputClass+'" />');
			});	
			
			$('textarea',_this.form).keyup(function(){  
					//get the limit from maxlength attribute  
					var limit = parseInt($(this).attr('maxlength'));  
					//get the current text inside the textarea  
					var text = $(this).val();  
					//count the number of characters in the text  
					var chars = text.length;  
			  
					//check if there are more characters then allowed  
					if(chars > limit){  
						//and if there are use substr to get the text before the limit  
						var new_text = text.substr(0, limit);  
			  
						//and change the current text with the new text  
						$(this).val(new_text);  
					}  
			});	
			
		      // Adding preloader	
		  	if ($(".submit-pre-loader",_this.form).size() == 0){
		  	   $('<div class="submit-pre-loader"></div>').insertAfter("#submit");
		  	}						
			
		},
		
		Parse : function(ev){
			
			var _this = this;
			this.Reset();
			
			$.each($("input,select",_this.form),function(i,field){
				
				var classGroup = $(field).attr('class');
				
				if (typeof classGroup != "undefined"){
					$(classGroup.split(' ')).each(function(i,className) {
						
						var formatFn = "";
						var validateFn = "";
						
						var fieldObj = $(field);
						
						fieldObj.focus(function(e){_this.ResetField(e,this,_this)});
						
						if (typeof _this.Format[className] != "undefined"){
							if (typeof ev == "undefined"){
								fieldObj.keyup(function(e){_this.Format[className](e,this,_this)});
							}
						}
						if (typeof _this.Validate[className] != "undefined"){							
							if (typeof ev == "undefined"){
								fieldObj.focusout(function(e){_this.Validate[className](e,this,_this)});
							} else {
								fieldObj.trigger("focusout");
							}
						}
						
						if ( className == "checkbox"){
							fieldObj.change(function(e){_this.Validate["checkbox"](e,this,_this)});		
						}
					});
				}
				
			});	       
			
			
			if ($("."+this.conf.errorClass,_this.form).length == 0 && $("."+this.conf.invalidClass+":visible",_this.form).length == 0 && typeof ev != "undefined") {
				this.Submit();
				return false;
			} 
			
			return false;		
		
		},
		
		Submit: function(){
			
			var _this = this;			

			var $phone = $("input[name$='phone']",_this.form);
			if ($phone.length > 0){
				$phone.val($phone.val().replace(/[^0-9]+/g, ""));
			}
			var $zipcode = $("input[name$='zipcode']",_this.form);
			if ($zipcode.length > 0){
				$zipcode.val($zipcode.val().replace(/[^0-9]+/g, ""));
			}
			
			$("button[name='submit']",_this.form).attr('disabled', 'disabled');
			
			$(".submit-pre-loader",_this.form).show();		

			$.ajax({
			  type: "POST",
			  url: this.conf.postUrl,
			  data: _this.form.serialize(),
			  dataType: "json",
			  success: function(data){
				  _this.conf.afterSubmit(data,_this);
				  $(".submit-pre-loader",_this.form).hide();	
				  $("button[name='submit']",_this.form).removeAttr('disabled');
			  }
			  }).error(function(){				  
				  _this.conf.afterError(_this);
				  $(".submit-pre-loader",_this.form).hide();	
				  $("button[name='submit']",_this.form).removeAttr('disabled');
			  });

		},		
		
		Format : {
		
			/*'zipcode' : function(e, field, _this){	
				
				var curchr = field.value.length;
				var curval = $(field).val();
	
				if ( curchr < 10 ){	
					if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {				
						if (curchr == 6) {
							var firstNum = curval.substring(0,5);
							var lastNum = curval.substring(5,6);
							$(field).val(firstNum + "-" + lastNum);
						} 
					} else {
						curval = curval.substr(0,curval.length -1);
						$(field).val(curval);
					}
				}
			},*/
			
			'phone' : function(e,field,_this){
				
				if ((typeof e != "undefined" && e != null ) && e.keyCode == 8){
					return;
				}
				var curchr = field.value.length;
				var curval = $(field).val();
				var display = curval;			
				if ((typeof e != "undefined" && e != null ) && (e.keyCode == 16 || !(e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105))) {
						display = curval.substr(0,curval.length-1);
						$(field).val(display);
				}
				
				var numbers = curval.replace(/[^0-9]+/g, "");
	
				var last = curval.substring(curval.length-1,curval.length);
				var first = numbers.substring(0,3);
				var second = numbers.substring(3,6);
				var third = numbers.substring(6,10);			
				
							
				if (numbers.length < 3) {
					display = numbers;
				}
				else if (numbers.length == 3) {
					display = "(" + first + ")-";
				} 
				else if (numbers.length > 3 && numbers.length < 6 ) {
					display = "(" + first + ")-"+second;
				}
				else if (numbers.length == 6) {
					display =  "(" + first + ")" + "-" + second + "-";
				}
				else if (numbers.length > 6) {
					display =  "(" + first + ")" + "-" + second + "-" + third;
				}				
				else {
					display =  curval;
				}
	
				$(field).val(display);
				
				
			}
		
		},
		
		Validate : {
		
			'phone' : function(e,field,_this){
				 var reg = /^\(\d{3}\)-\d{3}-\d{4}$/;
				 var numReg = /^\d{10}$/;
				 var phone = $(field).val();
				 if((reg.test(phone) == false && numReg.test(phone) == false )|| field.value.length == 0 ) {				    
					_this.DropError(field);
				 } 
				
				 _this.Format['phone'].call(this,null,field,_this); 
	
			},
			
			'email' : function(e,field,_this){
				
				 var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				 var address = $(field).val();
				 if(reg.test(address) == false || field.value.length == 0) {	   
					_this.DropError(field);
				 }		
				
			},
			
			'zipcode' : function(e,field,_this) {
				
				 var reg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
				 var zip = $(field).val();
				 if(reg.test(zip) == false && field.value.length != 0) {	   
					_this.DropError(field);
				 }			
				
			},
			
			'zipcode-ca' : function(e,field,_this) {
				
				 var reg = /(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/;			 
				 var zip = $(field).val();
				 if(reg.test(zip) == false && field.value.length != 0) {	   
					_this.DropError(field);
				 }			
				
			},		
			
			'non-empty' : function(e,field,_this){
				
				if (field.value.length == 0 || field.value.replace(/\s/g,"") == "") {	   
					_this.DropError(field);
				} 
				
			},
			
			'checkbox' : function(e,field,_this) {
	
				var checkSpan = $(field).siblings("."+_this.conf.checkboxSpanClass);			
		
				if ($(field).is(':checked')) {	   
					_this.ResetField(null,field,_this);
					_this.ResetField(null,checkSpan,_this);
					checkSpan.addClass("checked");				
				} else {
					checkSpan.removeClass("checked");
					if ($(field).hasClass("required")){
						_this.DropError(this);
						_this.DropError(checkSpan);					
					}
				}			
	
			}, 
			
			'select' : function(e,field,_this) {
	
				var selectSpan = $(field).siblings("."+_this.conf.selectSpanClass);			
		
				if (field.value.length == 0 || field.value.replace(/\s/g,"") == "") {	   
					_this.DropError(field);
					_this.DropError(selectSpan);
				} 			
	
			}, 
			
			'radio' : function(e,field,_this) {
				$("."+_this.conf.radioDivClass, _this.form).each(function(index, element) {
                    if ($("input[type='radio']:checked",element).length == 0){
						_this.DropError(element);
					}
                });				
			}
			
		},
		
		DropError : function(field){
			
			var _this = this;
			
			if ($(field).hasClass("required")){
				this.ShowError.required(field, _this);
			} else {
				var attr = $(field).attr("type");
				if (attr == "text" ){
					this.ShowError.invalid(field, _this);
				}
			}
			$("button[name='submit']",_this.form).removeAttr('disabled');
			
		},
	
		ShowError : {
			
			'required' : function(field, _this){
					$(field).addClass(_this.conf.errorClass);
					$(field).parent(".input-wrapper").addClass(_this.conf.errorClass);
					_this.conf.errors ++;
					var errorMsg = $("."+_this.conf.formErrorClass,_this.form);
					errorMsg.show();
			},
			
			'invalid' : function(field, _this){			
				
				var errorMsg = $(field).siblings(".invalid-field");
				
				if (errorMsg.length == 0 ){
					$(field).parent(".input-wrapper").before("<span class='"+_this.conf.invalidClass+"'>"+_this.conf.invalidMsg+"</span>");
				}
				errorMsg.show();
			}		
			
			
		},
		
		Reset : function(){		
					$("."+this.conf.errorClass,this.form).removeClass(this.conf.errorClass);
					$("."+this.conf.formErrorClass+",."+this.conf.backEndErrorClass+",."+this.conf.invalidClass, this.form).hide();
					$("button[name='submit']",this.form).removeAttr('disabled');
		},
		
		ResetForm : function(){
			        var _this = this;
					this.Reset();		
					this.form.find('input:text, input:password, input:file, select, textarea',this.form).val('');
					this.form.find('input:radio, input:checkbox',this.form).removeAttr('checked').removeAttr('selected');
					$("span",this.form).removeClass(_this.conf.errorClass);
					$(".checkbox",this.form).removeClass("checked");
					var $selects = $("select",this.form);
					$selects.each(function(index, selectItem) {
						var $firstOption = $("option",this)[0].text;
						$(this).siblings("."+_this.conf.selectSpanClass).text($firstOption);                        
                    });
					
					//Radio Buttons					
					$("."+_this.conf.radioDivClass+" input[name='radio']",this.form).attr("checked",false); 
					$("."+_this.conf.radioDivClass+" span",this.form).removeClass("radio-on");
		},		
		
		ResetField : function(e,field,_this){
			
			var $field = $(field);
			
			if ($field.hasClass(_this.conf.errorClass)){
				$field.removeClass(_this.conf.errorClass);
				$field.parent(".input-wrapper").removeClass(_this.conf.errorClass);
				$field.siblings("."+_this.conf.errorClass).removeClass(_this.conf.errorClass);
				if ($("."+_this.conf.errorClass, _this.form).length == 0) {
					_this.Reset();
				}
			}
			
			var invalidError = $field.parent(".input-wrapper").siblings("."+_this.conf.invalidClass);
			if (invalidError.length > 0 ){
				invalidError.hide();
			}
			
			var $selectSiblings = $field.siblings("."+_this.conf.selectSpanClass);
			if ($field.siblings("."+_this.conf.selectSpanClass).length > 0){
				var $firstOption = $("option",$field)[0].text;
				$selectSiblings.text($firstOption);
				$field.prop('selectedIndex',0);                     
		     }
		}

    };
	

	tisVal.prototype = tisVal.proto;





})( jQuery );