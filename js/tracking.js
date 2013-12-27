// For GTM
var dataLayer = [];
var isDebug = false;
	
/**
 *
 * sendTracking( ditto, type, config )
 * 
 * @param ditto   - ( required ) - triggers the ajax to send the information to our servers.
 * @param type    - ( required ) - triggers the proper switch case to push in correct data to the 'dataLayer' array. 
 *                                 possible options ( right now ) are 'trackEvent' and 'trackSocial'
 * @param gaVars  - ( required ) - refer to the cases below to get proper names / values and formating. 
 *
 */
	
var sendTracking = function( ditto, type, gaVars ){
	if( isDebug ) console.log( gaVars);
	
	if( ditto ){
		if( isDebug ) console.log( 'ditto is true from inside ditto' );
		$.ajax({
			type : 'POST',
			url  : '/wps/LeadWebModule/LeadFormServlet',
			data : {
					category  : gaVars.gaCategory,
					action    : gaVars.gaAction, 
					label     : gaVars.gaLabel, 
					form_type : 'track-event' }
			}).done(function( msg ) {
		});
	}
		
	switch ( type ){
		case 'trackEvent':
			if( isDebug ) console.log( 'trackEvent triggered' );
			dataLayer.push({
				'event'      : type,
				'gaCategory' : gaVars.gaCategory,
				'gaAction'   : gaVars.gaAction,
				'gaLabel'    : gaVars.gaLabel,
				'gaValue'    : gaVars.gaValue
			});	
			break;
		case 'trackSocial':
			if( isDebug ) console.log( 'trackSocial triggered' );
			dataLayer.push({
				'event'          : type,
				'gaNetwork'      : gaVars.gaNetwork,
				'gaSocialAction' : gaVars.gaSocialAction,
				'gaOptTarget'    : gaVars.gaOptTarget,
				'gaOptPagePath'  : gaVars.gaOptPagePath
			});
			break;
		case 'undefined':
		case null: 
		case '':
			$.error('Undefined event type passed.');
	}
}