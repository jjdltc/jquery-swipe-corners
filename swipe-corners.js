$(function () {
	// If true allow the corners swipe events, otherwise just allow the four basic points (left, right, up, down)
	$.event.special.swipe.allowCornerSwipe = true;

	// JQ registration point
	$.each({
		swipeUp: "swipe",
		swipeDown: "swipe",
		swipeBottomRight: "swipe",
		swipeBottomLeft: "swipe",
		swipeTopRight: "swipe",
		swipeTopLeft: "swipe"
	}, function( event, sourceEvent ){
		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			}
		};
	});

	$.each( ( "swipeUp swipeDown swipeBottomRight " +
		"swipeBottomLeft swipeTopRight swipeTopLeft" ).split( " " ), function( i, name ) {
		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};
	});

	// swipe handler override
	$.event.special.swipe.handleSwipe = function ( start, stop ) {
		var enoughTime = (stop.time - start.time < $.event.special.swipe.durationThreshold),
			vMovement = Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ),
			hMovement = Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ),
			enoughVMovement = (vMovement > $.event.special.swipe.horizontalDistanceThreshold),
			enoughHMovement = (hMovement > $.event.special.swipe.horizontalDistanceThreshold),
			positiveVMovement = (start.coords[ 1 ] < stop.coords[ 1 ]),
			positiveHMovement = (start.coords[ 0 ] < stop.coords[ 0 ]),
			isCornerSwipe = (enoughHMovement && enoughVMovement),
			xorDirectional = (enoughHMovement)?!enoughVMovement:enoughVMovement,
			swipeEventType = "swipe";

		if($.event.special.swipe.allowCornerSwipe && isCornerSwipe && enoughTime){
			if(positiveVMovement){
				swipeEventType = (positiveHMovement)?"swipeBottomRight":"swipeBottomLeft";
			}
			else{
				swipeEventType = (positiveHMovement)?"swipeTopRight":"swipeTopLeft"
			}
			start.origin.trigger("swipe").trigger(swipeEventType);
		}
		else{
			if(xorDirectional && enoughTime){
				if(enoughVMovement){
					if(vMovement > $.event.special.swipe.verticalDistanceThreshold){
						swipeEventType = (positiveVMovement)?"swipeDown":"swipeUp";
						start.origin.trigger("swipe").trigger(swipeEventType);
					}
				}
				else{
					if(hMovement > $.event.special.swipe.verticalDistanceThreshold){
						swipeEventType = (positiveHMovement)?"swiperight":"swipeleft";
						start.origin.trigger("swipe").trigger(swipeEventType);
					}
				}
			}
		}
	}
})