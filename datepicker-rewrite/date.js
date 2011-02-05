/*
 * jQuery Date
 *
 * Copyright 2010 Marc Grabanski
 * Licensed under the MIT license
 *
 *
 * Depends:
 *	jquery.glob.js
 */
(function( $, undefined ) {
	
if (typeof($.global.culture) == "undefined") {
	$.global.culture = $.global.cultures["default"];
}

$.date = function ( datestring, formatstring ) {
	var calendar = $.global.culture.calendar,
		format = formatstring ? formatstring : calendar.patterns.d,
		date = datestring ? $.global.parseDate(datestring, format) : new Date();
	return {
		refresh: function() {
			calendar = $.global.culture.calendar;
			format = formatstring || calendar.patterns.d;
			return this;
		},
		setFormat: function( formatstring ) {
			if (formatstring) {
				format = formatstring;
			}	
			return this;
		},
		setDay: function( day ) {
			date = new Date(date.getFullYear(), date.getMonth(), day);
			return this;
		},
		adjust: function( period, offset ) {
			var day = period == "D" ? date.getDate() + offset : date.getDate(), 
				month = period == "M" ? date.getMonth() + offset : date.getMonth(), 
				year = period == "Y" ? date.getFullYear() + offset : date.getFullYear();
			date = new Date(year, month, day);
			return this;
		},
		daysInMonth: function(year, month){
			year = year || date.getFullYear();
			month = month || date.getMonth();
			return 32 - new Date(year, month, 32).getDate();
		},
		monthname: function() {
			return calendar.months.names[date.getMonth()];
		},
		year: function() {
			return date.getFullYear();
		},
		weekdays: function() {
			// TODO take firstDay into account
			var result = [];
			for (var dow = 0; dow < 7; dow++) {
				var day = (dow + calendar.firstDay) % 7;
				result.push({
					shortname: calendar.days.namesShort[day],
					fullname: calendar.days.names[day],
				});
			}
			return result;
		},
		days: function() {
			var result = [],
				daysInMonth = this.daysInMonth(),
				firstDayOfMonth = new Date(this.year(), date.getMonth(), 1).getDay(),
				leadDays = (firstDayOfMonth - calendar.firstDay + 7) % 7,
				rows = Math.ceil((leadDays + daysInMonth) / 7),
				printDate = new Date(this.year(), date.getMonth(), 1 - leadDays);
			for (var row = 0; row < rows; row++) {
				var week = result[result.length] = {
					days: []
				};
				for (var day = 0; day < 7; day++) {
					week.days.push(printDate.getDate());
					// use adjust("D", 1)?
					printDate.setDate(printDate.getDate() + 1);
				}
			}
			return result;
		},
		date: function() {
			return date;
		},
		format: function( formatstring ) {
			return $.global.format(date, formatstring ? formatstring : format);
		},
		calendar: function( newcalendar ) {
			if (newcalendar) {
				calendar = newcalendar;
				return this;
			}
			return calendar;
		}
	}
}

}( jQuery ));