var fixedHeader = (function () {
	'use strict';

	var oldScrollTop = $(window).scrollTop(),
			newScrollTop;

	// cache DOM
	var $table = $('table'),
			$tableFixed = $table.clone();

	// bind events
	$(window).on('resize', onResizeListener);
	$(window).on('scroll', onScrollListener);

	function onResizeListener() {
		$tableFixed.css({left: $table.offset().left});

		$tableFixed.find('th').each(function (index) {
				var newWidth = $table
												.find('th')
												.eq(index)
												.outerWidth();

				$(this).css({
										'min-width': newWidth,
										'max-width': newWidth
									});
				});
	}

	function onScrollListener() {
		newScrollTop = $(window).scrollTop();

		// Check if the scroll horizontal or vertical
		if (oldScrollTop === newScrollTop) {
			// horizontall scrolling
			$tableFixed.css({left: $table.offset().left - $(window).scrollLeft()});
		} else {
				// vertical scrolling
				oldScrollTop = newScrollTop;

				var offset = newScrollTop,
						tableOffsetTop = $table.offset().top,
						tableOffsetBottom = tableOffsetTop + $table.height() - $table.find('thead').height();

				if (offset < tableOffsetTop || offset > tableOffsetBottom) {
					$tableFixed.hide();
				} else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && $tableFixed.is(':hidden')) {
					$tableFixed.show();
				}
		}
	}

	function init() {
		$tableFixed.find('tbody')
								.remove()
								.end()
								.addClass('timetable_fixed')
								.css({left: $table.offset().left})
								.insertBefore($table);
		onResizeListener();
	}

	var api = {
		init: init
	};

	return api;
})(),
filteredRows = (function () {
	'use strict';

	// cache DOM
	var $tbody = $('tbody'),
		$allRows = $tbody.find('tr'),
		$landingRows = $allRows.filter('.landing, .landing + .flight-details'),
		$takeoffRows = $allRows.filter('.takeoff, .takeoff + .flight-details'),
		$message = $('.message'),
		$takeoffCheck = $('#takeoff-check'),
		$landingCheck = $('#landing-check');

	// bind events
	$('#takeoff-check').on('change', onTakeoffChange);
	$('#landing-check').on('change', onLandingChange);

	function onTakeoffChange() {
		if ($takeoffCheck.is(':checked')) {
			$message.hide();
			$('tbody > tr').length ? $tbody.append($allRows) : $tbody.append($takeoffRows);
		} else {
			$takeoffRows.remove();

			if ($landingCheck.is(':not(:checked)')) {
				$message.show();
			}
		}
	}

	function onLandingChange() {
		if ($landingCheck.is(':checked')) {
			$message.hide();
			$('tbody > tr').length ? $tbody.append($allRows) : $tbody.append($landingRows);
		} else {
			$landingRows.remove();

			if ($takeoffCheck.is(':not(:checked)')) {
				$message.show();
			}
		}
	}

	function init() {
		if ($takeoffCheck.is(':not(:checked)') && $landingCheck.is(':not(:checked)')) {
			$allRows.remove();
			$message.show();
		} else if ($takeoffCheck.is(':not(:checked)')) {
				$takeoffRows.remove();
		} else if ($landingCheck.is(':not(:checked)')) {
				$landingRows.remove();
		}
	}

	var api = {
		init: init
	};

	return api;
})();

$(document).ready(function () {
	fixedHeader.init();
	filteredRows.init();
});
