/*
 * jScratchcard jQuery plugin - Rel. 0.0
 *
 * Copyright (c) 2010 Giovanni Casassa (senamion.com - senamion.it)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.senamion.com
 *
 */


(function($)
{
	var methods = {
		init : function(options) {
			var o = {
				opacity: 0.8,
				color: '#666666',
				stepx: 30,
				stepy: 30,
				mousedown: true,
				callCallbackPerc: false,
				callbackFunction: null
			};

			return this.each(function(i) {
				var el = $(this);
				var h = el.height();
				var	w = el.width();
				var	position = el.position();
				var x = position.left;
				var y = position.top;
				var	uuid = (el.attr('name') || el.attr('id') || el.attr('class') || 'internalName') + '__sc';


				if (options)
					$.extend(o, options);

				var	remainder = (w / o.stepx) * (h / o.stepy);
				var	limitRem = remainder * o.callCallbackPerc / 100;

				over = "";
				for (i=0;i<w;i+=o.stepx) {
					for (j=0;j<h;j+=o.stepy) {
						over += "<div class='"+uuid+"' style='height:" + o.stepy + "px; width:" + o.stepx + "px; background-color:" + o.color + "; position: absolute;border: 0;overflow: hidden;top:" + (y + j) + "px; left:" + (x + i) + "px;' />";
					}
				}
				el.after(over);
				$('.'+uuid)
					.mouseover(function() {
						if (o.mousedown == false || el.data('okMouse')) {
							op = $(this).css('opacity') - o.opacity;

							if (o.callCallbackPerc != false && (remainder-- < limitRem))
								o.callbackFunction();

							if (op <= 0)
								$(this).remove();
							else
								$(this).css({'opacity': op});
						}
					})
				if (o.mousedown)
					$('.'+uuid)
						.mousedown(function() {
							el.data('okMouse', true);
							return false;
						})
						.mouseup(function() {
							el.data('okMouse', false);
							return false;
						});
			});
		}
	};

  $.fn.jScratchcard = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.jScratchcard' );
    }    
  };

})(jQuery);

function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

             //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

                                                                                 first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() 
{
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);    
}