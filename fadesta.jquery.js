(function($) {
	
	
	$.fn.fadesta = function(options) {
	
		var $this = this,
			items = $this.find('i'),
			images = [],
			count = 0,
			interval,
			navigation,
			pagination,
			menuhighlight = function(int) {
				var paginationLinks = $(pagination).find('a');
				
				$.each(paginationLinks, function(e){
					$(this).removeClass('is-active');
				});
			
				$('[data-id="' + int + '"]').addClass('is-active');
				
			},
			lookUp = function(int){
				
				if (int > images.length -1) {
					count = 0;
				}
				
				if (int < 0) {
					count = images.length -1;
				}
			
				// Loop through and remove opacity
				$.each(images, function(i){
					$(this).css('opacity', 0);
				});
				
				// Find item with count identifier and apply style				
				$this.find('.item--' + count).css('opacity', 1);
				
				if (settings.pagination) {				
					menuhighlight(count);	
				}

				return count;
				
			},
			fade = function(str){
						
				// Remove previous class		
				$this.removeClass('show-' + count);
				
				if (str === undefined) {
					count++;
				} else if (str === 'previous') {
					count = count -1;
				}
				
				// Add new class
				$this.addClass('show-' + lookUp(count));
				
				// Reset interval to stop fading straight
				// after choosing a slide
				window.clearInterval(interval);
				interval = window.setInterval(fade, settings.delay);
				
			};
			
		// Extend our plugin
		var settings = $.extend({
			delay: 5000,
			navigation: null,
			pagination: null
		}, options);
		
		
		// Apply background
		$.each(items, function(i){
		
			// Set our background-image relevant to our data-attr
			// Add identifier class "item--[identifier]"
			$(this)
				.css('background-image', 'url(' + $(this).attr("data-bkg") + ')')
				.addClass('item--' + i);
			
			// Then push each to our array
			images.push(this);
			
		});
		
		// Create Navigation
		if (settings.navigation) {
		
			navigation = document.createElement('div');
			
			$(navigation)
				.addClass(settings.navigation.parent)
				.html('\
					<a href="#" class="' + settings.navigation.parent + '__item ' + settings.navigation.prev + '">Previous</a>\
					<a href="#" class="' + settings.navigation.parent + '__item ' + settings.navigation.next + '">Next</a>\
				');
			
			// If user wants to append to a different element
			(settings.navigation.append) ? $('.' + settings.navigation.append).append(navigation) : $this.append(navigation);
		}
		
		// Create Pagination
		if (settings.pagination) {
		
			var html = '',
				highlight;
				
			pagination = document.createElement('ol');
			
			// Create an li element for each instance
			$.each(images, function(i){
			
				html += '<li><a href="#" class="' + settings.pagination.parent + '__item' + '" data-id="' + i + '">' + i + '</a></li>';
				
			});	
			
			$(pagination)
				.addClass(settings.pagination.parent)
				.html(html);
						
			// If user wants to append to a different element
			(settings.pagination.append) ? $('.' + settings.pagination.append).append(pagination) : $this.append(pagination);
			
		}
		
		// Fade-in inital image
		$this.addClass('show-' + lookUp(count));
		
		// EVENTS
		
		// Auto fade
		interval = window.setInterval(fade, settings.delay);

		$(navigation).on('click', 'a', function(e){
			
			var targ = $(e.target);
			
			(targ.hasClass(settings.navigation.prev)) ? fade('previous') : fade();

			e.preventDefault();
		});
		
		$(pagination).on('click', 'a', function(e){
			
			var targ = $(e.target);
			
			count = parseInt(targ.attr('data-id'), 10) -1; // we know our fade function increments
			
			fade();

			e.preventDefault();
		});
	
	};

})(jQuery);