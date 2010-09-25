// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery(function($){
  $("input.autocomplete").autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "http://api.sandbox.yellowapi.com/FindBusiness",
				dataType: "jsonp",
				data: {
					pg: 1,
					maxRows: 12,
					where: "Toronto",
					fmt: "JSON",
					what: request.term,
					UID: Math.round(Math.random()*1000),
					apikey: "kdsu6xxqva28eu9zvpcpqfba"
				},
				success: function( data ) {
					response( $.map(data.listings, function(item){
					  var address = [item.address.street, item.address.city, item.address.prov, item.address.pcode].join(", ")
						return {
							label: item.name + " ("+address+")",
							value: item.id
						};
					}));
				}
			});
		},
		minLength: 2,
		select: function( event, ui ) {
			log( ui.item ?
				"Selected: " + ui.item.label :
				"Nothing selected, input was " + this.value);
		},
		open: function() {
			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		close: function() {
			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		}
	}).keydown(function(event){
	  if (event.which == $.ui.keyCode.ENTER) {
	    return false;
	  }
	})
});