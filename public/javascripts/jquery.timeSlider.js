/**
 * Time Slider for Say Yeah!'s Toronto Events Calendar
 * Created by Gabriel Mansour for Say Yeah!
 */
(function($){

$.fn.timeSlider = function(args) {
  var defaults = {
    hide: true, // hide the dropdowns and associated labels
    returnSelf: false, // return the $slider object instead of this (return this is normally expected of jQuery methods)
    minRangeSize: 1, // minimum number of steps wide range must be. defaults to 1 so that handles don't overlap
    labels: 5,
    tooltip: true,
    labelSrc: 'title',
    tooltipSrc: 'text'
  };
  args = $.extend(defaults, args);

  var tabindex = 2;
  var $slider = this.attr('tabindex',tabindex++).selectToUISlider(args).nextAll('.ui-slider:eq(0)');
  $slider.find('.ui-corner-all').andSelf().removeClass('ui-corner-all ui-widget-content').end().end() // remove those infernal classNames!
    .find('.ui-slider-handle:first').addClass('ui-slider-handle-left').end() // uniquely identify slider handle
    .find('ol li')
      .not(':nth-child(4n+1)').find('span.ui-slider-tic').hide().end().end() // hide extra ticks, only show on the hour.
      .filter(":first-child,:last-child").find("span.ui-slider-label").removeClass('ui-slider-label-show').end().end() // hide first and last labels
      .not(':first,:last').filter(function(){ return $(this).text().match(/Midnight/i); })
        .find('.ui-slider-label').addClass('ui-slider-label-show').end().end().end() // display "Midnight" label
      .find('span.ui-slider-label').removeAttr('style'); // remove inline margin-left CSS (taking out the entire attr, since it's the only declaration anyways)


  // backreference to original node list
  $slider.get(0).self = this;

  // Slide the range bar
  $slider.find('.ui-slider-range').attr('tabindex',0)
    // the following event handlers taken from ui.slider to mimic handle behaviour
  	.click(function(event) {
  		event.preventDefault();
  	})
  	.hover(function() {
  		if (!$slider.slider('option','disabled')) {
  			$(this).addClass('ui-state-hover');
  		}
  	}, function() {
  		$(this).removeClass('ui-state-hover');
  	})
  	.focus(function() {
  		if (!$slider.slider('option','disabled')) {
  			$(".ui-slider .ui-state-focus").removeClass('ui-state-focus'); $(this).addClass('ui-state-focus');
  		} else {
  			$(this).blur();
  		}
  	})
  	.blur(function() {
  		$(this).removeClass('ui-state-focus');
  	})
    .bind('mousedown', function(e){
      $(this).focus()
        .parents('.ui-slider:eq(0)').find('ui-state-active').removeClass('ui-state-active')
          .end().end().addClass('ui-state-active');
      $(this).parents('.ui-slider:eq(0)').find('.ui-slider-handle').trigger(e); // not working?
    })
    .bind('mouseup', function(e){
      $(this).removeClass('ui-state-active');
      $(this).parents('.ui-slider:eq(0)').find('.ui-slider-handle').trigger(e); // not working?
    })

    // Relay keydown event to slider handles
    .bind('keydown', function(e, data){
      var evt = $.Event('keydown');
      evt = $.extend( evt, {keyCode: e.keyCode || data.keyCode} );
      $('.ui-slider-handle').trigger(evt);
    })
    // Relay keyup event to slider handles too
    .bind('keyup', function(e, data){ // release draggable grippy
      var evt = $.Event('keyup');
      evt = $.extend( evt, {keyCode: e.keyCode || (data && data.keyCode) || null} );
      $('.ui-slider-handle').trigger(evt);
    })

    // initialize dragging variable
    .bind('mousedown', function(event){
      var position = { x: event.pageX, y: event.pageY };
      $.data(this, 'initialNormValue', $slider.data('slider')._normValueFromMouse(position));
    });

  $slider.bind('slide slidechange', function(e, ui){
    var old_values = $slider.slider('values'),
      new_values = ui.values, // the values that will be used
      index = $slider.data('slider').handles.index(ui.handle),
      delta = new_values[index] - old_values[index];

    if (delta != 0) {
      // check to see if the result of the first slider event was false so we don't take any action on this one.
      if ( index > 0 ) {
        if ( $.data(this, 'slideProhibited') ) {
          $(this).removeData('slideProhibited'); // reset for future uses
          e.stopImmediatePropagation();
          return false;
        }
      } else {
        // if first handle, remove data if haven't already so we can start with a clean slate
        $(this).removeData('slideProhibited');
      }
      
      if ( ((ui.dragging ? old_values[0] + delta : new_values[0]) < $(this).slider('option','min'))
          || ((ui.dragging ? old_values[1] + delta : new_values[1]) > $(this).slider('option','max')) ) { // exceeds bounds?
        $.data(this, 'slideProhibited', true);
        e.stopImmediatePropagation(); // don't update further
        return false;
      } else if ( (Math.abs(new_values[1] - new_values[0]) < args.minRangeSize ) ) { // below min range size
        // since range size cannot be changed by just dragging the range, we don't need to set slideProhibited
        e.stopImmediatePropagation(); // don't update further
        return false;
      }
    }
  });

  // Rebind 'slide' event that slider was initialized with;
  // for some reason it doesn't respond to jQuery#trigger, so this fixes that.
  if ($slider.data('slider').options.slide) {
    var slide_event = $slider.data('slider').options.slide;
    $slider.data('slider').options.slide = function(){};
    $slider.bind('slide', slide_event);
  }

  // modify the slider instance's mouseDrag behaviour so we can drag the range
  (function(){
    var old_mouseDrag = this._mouseDrag,
      old_mouseCapture = this._mouseCapture,
      range = $slider.find('.ui-slider-range')[0];
    
    // intercept mouseCapture as well so that "closestHandle" doesn't hijack the click
    this._mouseCapture = function(event) {
      // copied a few necessary lines from the original method for compatibility
      if (this.options.disabled)
        return false;
      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      };
      this.elementOffset = this.element.offset();


      if (event.originalEvent.target == range || $(event.originalEvent.target).is('.ui-slider-tic') )
        return true;

      return old_mouseCapture.apply(this, [event]);
    };

    this._mouseDrag = function(event){
      // allow ui-slider-tic as well so that z-index order doesn't affect dragging
      if ( event.target == range || $(event.target).is('.ui-slider-tic') ) {
    		var position = { x: event.pageX, y: event.pageY };
    		var normValue = this._normValueFromMouse(position);

        var old_values = $slider.slider('values'),
          initialNormValue = $.data(range, 'initialNormValue'),
          diff = normValue - initialNormValue,
          new_values = [old_values[0] + diff, old_values[1] + diff];

        // private helper method used for trigger calls
        function uiHash(i){
          return {
            handle: $slider.find('.ui-slider-handle')[i],
            value: new_values[i],
            values: new_values,
            dragging: true // to differentiate from normal uiHash
          };
        }
        var allowed0 = $slider.data('slider')._trigger('slide', event, uiHash(0) );
        var allowed1 = $slider.data('slider')._trigger('slide', event, uiHash(1) );

        // if neither event trigger returned false, then we're ok to update the value
        if (allowed0 && allowed1) {
          // left handle
          this._handleIndex = 0;
      		$slider.slider('values', 0, new_values[0]);
      		// right handle
      		$slider.slider('values', 1, new_values[1]);
    		}

        // reset initialNormValue
    		$.data(range, 'initialNormValue', normValue);

        return false;
      }

      return old_mouseDrag.apply(this, [event]); // call the original handler in the right context
    };
  }).apply( $slider.data('slider') );


  if (args.hide) {
    this.hide();  // hide the selects
    this.each(function(){ $('label[for="'+(this.id||'')+'"]').hide(); }); // hide the labels attached to the selects
  }

  // nonstandard return object: return $slider instead of this (as expected with jQuery methods).
  // this is so we can easily call the slider() function on it for getters and setters.
  return args.returnSelf ? this : $slider;
};

})(jQuery);