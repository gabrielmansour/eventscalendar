// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery(function($){
  $("input.autocomplete").autocomplete({
		source: function(request, response) {
			$.getJSON('/venues/search', {q: request.term},
				function(data) {
				  response( $.map(data.listings, function(item){
					  var address = [item.address.street, item.address.city, item.address.prov, item.address.pcode].join(", ")
						return {
							label: item.name + "\n" + address,
							value: item.id
						};
					}) );
			});
		},
		minLength: 2,
		select: function( event, ui ) {
			if(ui.item) {
			  $("#event_venue_id").val(ui.item.value);
			  $("#event_venue_id").val(0 ? 0 : 1)
			}
		},
		open: function() {
			$(this).find("*").andSelf().removeClass('ui-corner-all');
			$(".ui-autocomplete").css('zIndex', 1000000);
			$(this).find('li a').html(function(i, val){
			  var d = val.split("\n", 2);
			  console.log(d);
			  return d[0] + '<span class="adr">'+d[1]+'</span>';
			});
		},
		close: function() {
			$(this).find('*').andSelf().removeClass("ui-corner-all");
		}
	}).keydown(function(event){
	  if (event.which == $.ui.keyCode.ENTER) {
	    return false;
	  }
	});
	
	// Time Slider
	if ($("body.events").is(".new,.edit")){
	  // Example Usage:
    window.a = $('select#event_dtstart_time, select#event_dtend_time').timeSlider().bind('slidechange', slideEvent);
    function slideEvent(event, ui){
      var values = $(a[0].self).map(function(i){ return $(this).val(); }),
          valueFields = $(a[0].self).map(function(i){ return document.getElementById(this.id.replace('_time','')); }),
          dateField = $('#event_dtstart_date').val();
      valueFields.each(function(i){
        var date = $.datepicker.parseDate($.datepicker.ATOM, dateField );
        if (date) { // make sure the value in the date field is valid
          var value = values[i],
              timeParts = value.split(':'),
              hours = parseInt(timeParts[0], 10),
              minutes = parseInt(timeParts[1], 10);
          var pad = function(n){ return (n<10) ? '0'+n : n; }; // adds leading zeros
          var time = new Date( date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes );
          var timestamp = ' ' + [pad(hours % 24), pad(minutes), '00'].join(":");
          $(this).val( $.datepicker.formatDate($.datepicker.ISO_8601, time ) + timestamp );
        } else {
          console.log("Invalid Date");
        }
      });
    }

    slideEvent(); // populate initial values
    
    $('input.datepicker').datepicker({minDate: new Date(), dateFormat: $.datepicker.ATOM });
	}
});