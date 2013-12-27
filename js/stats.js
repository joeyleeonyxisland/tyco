var tisStats =  {
				  cases : [
				  
				            [           
							   { 
							   "pos" : "top",
							   "start" : 1,
							   "end" : 0,
							   "rate" : 0.021,
							   "pref" : "",
							   "name" : "Commercial Burglaries",
							   "desc"  : "The number of commercial burglaries committed in the U.S. so far today"
							   },
							   {
							   "pos" : "bottom",
							   "start" : 1,
							   "end" : 0,
							   "rate" : 3.31,
							   "pref" : "",							   
							   "name" : "Critical Alarms",
							   "desc"  : "The number of Fire, Hold Up, Burglary or Critical Condition Alarms that we responded to today"
							   }
							],

				            [           
							   { 
							   "pos" : "top",
							   "start" : 0,
							   "end" : 30000,
							   "rate" : 13.5,
							   "pref" : "",
							   "name" : "Security Signals",
							   "desc"  : "The security monitoring signals that we received and processed since you arrived on this page"
							   },
							   {
							   "pos" : "bottom",
							   "start" : 13000,
							   "end" : 0,
							   "rate" : 0,
							   "pref" : "",
							   "name" : "Partners",
							   "desc"  : "The number of Police Departments, Fire Departments and Private Guards that we partner with"
							   }
							],
							
				            [           
							   { 
							   "pos" : "top",
							   "start" : 1,
							   "end" : 0,
							   "rate" : 0.2,
							   "pref" : "",
							   "name" : "Telephone Calls",
							   "desc"  : "The telephone calls we’ve received from customers and emergency responders today"
							   },
							   {
							   "pos" : "bottom",
							   "start" : 1,
							   "end" : 0,
							   "rate" : 33,
							   "pref" : "$",
							   "name" : "Commercial Burglary Losses",
							   "desc"  : "The amount of commercial losses suffered by burglary victims in the U.S. so far today"
							   }
							]

	
			  ],
			  
			  statCase : [],
			  			  
			  Engine : function(stat){
				  this.stat = stat;
				  this.counter = null;
				  this.Action = function(st){
					  if (st["end"] == 0 || (st["end"] > 0 && st["start"] < st["end"])){
					  st["start"] = st["start"] + st["rate"];
					   if ($(".stats-widget").is(":hidden")) {
						  $(".submit-pre-loader").hide();
						  $(".stats-widget").show();
						}					  
					  tisStats.RenderStat(st);
					  } else {
						  clearInterval(this.counter);
					  }
				  };
				  this.Bind = function( Method ){
					var _this = this; 
					return(
						 function(){
						 return( Method.apply( _this, arguments ) );
					});
				 };	
				 
				 if (this.stat["rate"] > 0){
					 //alert(this.stat["start"]);	
					 if (this.stat["start"] > 0 ){	  
	  				  var d = new Date();				  
	  				  var seconds = d.getHours()*3600 + d.getMinutes()*60;				  
	  				  this.stat["start"] = seconds*this.stat["rate"];
					 }
					 //alert("after: "+this.stat["start"]);	
	  			      var closure = this.Bind(function(){this.Action(this.stat)});			  
	  				  this.Timer = function(){
	  					  this.counter = setInterval(closure, 1000);
	  				  };
					  this.Timer();
				 }
				  
			  },
			  
			  StartEngine : function(){
                  for (var i=0; i < this.statCase.length; i++){
					  this.RenderStat(this.statCase[i]);
					  //create new engine
					  var statEng = new this.Engine(this.statCase[i]);
					  
				  }
			  },
			  
			  NumberWithCommas : function(x) {
                    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              },
			  
			  RenderStat : function(stat){
				  var container = $("."+stat["pos"]);
				  $(".stat-number",container).html(stat["pref"]+this.NumberWithCommas(Math.round(stat["start"])));
				  $(".stat-name",container).html(stat["name"]);
				  $(".stat-desc",container).html(stat["desc"]);
			  },
			  
			  Init : function(){
				  var ranNumber = Math.floor(Math.random()*this.cases.length);
				  this.statCase = this.cases[ranNumber];
                  this.StartEngine();
			  }			  
			  

}

$(document).ready(function(e) {
    tisStats.Init();
});
