/*!
 * custom pager controls - beta testing
  initialize custom pager script BEFORE initializing tablesorter/tablesorter pager
  custom pager looks like this:
  1 | 2 … 5 | 6 | 7 … 99 | 100
    _       _   _        _     adjacentSpacer
        _           _          distanceSpacer
  _____               ________ ends (2 default)
          _________            aroundCurrent (1 default)

 */
/*jshint browser:true, jquery:true, unused:false, loopfunc:true */
/*global jQuery: false */

;(function($){
"use strict";

$.tablesorter = $.tablesorter || {};

$.tablesorter.customPagerControls = function(settings) {
	var defaults = {
		table          : 'table',
		pager          : '.pager',
		pageSize       : '.left a',
		currentPage    : '.right a',
		ends           : 2,                        // number of pages to show of either end
		aroundCurrent  : 1,                        // number of pages surrounding the current page
		link           : '<a href="#">{page}</a>', // page element; use {page} to include the page number
		currentClass   : 'current',                // current page class name
		adjacentSpacer : ' | ',                    // spacer for page numbers next to each other
		distanceSpacer : ' &#133; ',               // spacer for page numbers away from each other (ellipsis)
		addKeyboard    : true                      // add left/right keyboard arrows to change current page
	},
	options = $.extend({}, defaults, settings),
	$table = $(options.table);

	$table
		.on('pagerInitialized pagerComplete', function (e, c) {
			var indx, pages = $('<div/>'), pageArray = [],
			cur = c.page + 1;

			// left end
			for (indx = 1; indx <= options.ends; indx++)
				pageArray.push(indx);

			// aroundCurrent
			for (indx = Math.max(indx, cur - options.aroundCurrent);
			     indx <= Math.min(c.filteredPages,
			                      cur + options.aroundCurrent + 1);
			     indx++)
				pageArray.push(indx);

			// right end
			for (indx = Math.max(indx, c.filteredPages - options.ends + 1);
			     indx <= c.filteredPages;
			     indx++)
				pageArray.push(indx);

			if (pageArray.length) {
				$.each(pageArray, function(indx, value){
					pages
						.append( $(options.link.replace(/\{page\}/g, value)).toggleClass(options.currentClass, value === cur).attr('data-page', value) )
						.append( '<span>' + (indx < pageArray.length - 1 && ( pageArray[ indx + 1 ] - 1 !== value ) ? options.distanceSpacer :
							( indx >= pageArray.length - 1 ? '' : options.adjacentSpacer )) + '</span>' );
				});
			}
			$(options.pager).find('.pagecount').html(pages.html());
		});

	// set up pager controls
	$(options.pager).find(options.pageSize).on('click', function () {
		$(this)
		.addClass(options.currentClass)
		.siblings()
		.removeClass(options.currentClass);
		$table.trigger('pageSize', $(this).html());
		return false;
	}).end()
	.on('click', options.currentPage, function(){
		$(this)
		.addClass(options.currentClass)
		.siblings()
		.removeClass(options.currentClass);
		$table.trigger('pageSet', $(this).attr('data-page'));
		return false;
	});

	// make right/left arrow keys work
	if (options.addKeyboard) {
		$(document).on('keydown', function(events){
			// ignore arrows inside form elements
			if (/input|select|textarea/i.test(events.target.tagName)) { return; }
			if (events.which === 37) {
				// left
				$(options.pager).find(options.currentPage).filter('.' + options.currentClass).prevAll(':not(span):first').click();
			} else if (events.which === 39) {
				// right
				$(options.pager).find(options.currentPage).filter('.' + options.currentClass).nextAll(':not(span):first').click();
			}
		});
	}
};
})(jQuery);
