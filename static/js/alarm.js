/**
 * jQuery Plugin für Alerts
 */
(function() {
	$.fn.addAlert = function(type, msg, timeout, closeable) {
		return this.each(function() {
			var target = $(this);
			alerts.alert(target, type, msg, timeout, closeable);
		})
	};
})(jQuery);


/**
*	Provides a set of alert shortcuts, such as info, warning, success, and
*	danger.
*/
alerts = {};

/**
*	WShortcut for basic alerts. Renders an alert in domelem <target>.
*	Instantiates the Alert widget and renderes its result to the dom.	
*
*	@param target	<domelem> to prepend to alert
*	@param type		<string> danger | info | warning | success
*	@param msg		<string | domelem> the message
*	@param timeout  <integer> time in ms after the alert will automatically fade out.
*	@param closeable <boolean> to sepcify whether the the alert is closeable or not.
*/
alerts.alert = function(target, type, msg, timeout, closeable) {
	var a = Alert({
		type: type,
		closeable: closeable,
		timeout: timeout
	});
	a.set_content(msg);
	$(target).prepend(a.render());
	a.initialize();
	return a;
};


/**
*	Generates a shortcut functions for each alert type.
*	Each shortcut is available under alerts.<type> and has the following
*	signature:
*	@param target	<domelem> to prepend to alert
*	@param msg		<string | domelem> the message
*	@param timeout  <integer> time in ms after the alert will automatically fade out.
*	@param closeable <boolean> to sepcify whether the the alert is closeable or not.
*/
$.each( ['info', 'warning', 'success', 'danger'], function(i, type) {
	alerts[type] = function(target, msg, timeout, closeable) {
		alerts.alert(target, type, msg, timeout, closeable);
	};
});


/**
*	Alert component to render alerts.
*	@param opts		<object> a set of options:
*		type:		<string> danger | info | warning | success
*		closeable:	<boolean> to sepcify whether the the alert is closeable or not.
*		timeout:	<integer> time in ms after the alert will automatically fade out.
*	
*	Example usage:
*		var a = Alert({
*			type: type,
*			closeable: closeable,
*			timeout: timeout
*		});
*		a.set_content(msg);
*		$(target).prepend(a.render());
*		a.initialize();
*/
Alert = function(opts) {
	
	var self = {};
	self.options = $.extend({
		type: 'info', // danger | warning | success
		closeable: true,
		timeout: null
	}, opts || {});

	self.dom = {
		main: $( '\
			<div class="alert">\
				<div class="alerts-alert-header"></div>\
				<div class="alerts-alert-content"></div>\
			</div>\
		' ),
		closeBtn: $('<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
	};
	self.dom.content = self.dom.main.find('.alerts-alert-content');
	self.dom.header = self.dom.main.find('.alerts-alert-header');

	/**
	*	Returns the main dom elem.
	*/
	self.render = function() {
		if (self.options.closeable) {
			self.dom.header.append(self.dom.closeBtn);
			self.dom.closeBtn.click(self.close);
		}
		self.dom.main.addClass('alert-' + self.options.type);
		return self.dom.main;
	};

	/**
	*	Closes the alert. Optionally applies a fadeOut duration in ms.
	*	@param ms	<integer> fade out duration in ms
	*/
	self.close = function ( ms ) {
		if ( typeof ms != 'number' ) {
			self.dom.main.remove();
			return;
		}
		self.dom.main.fadeOut( ms, function () {
			self.dom.main.remove();
		} );
	};

	/**
	*	Takes a text node or dom element and sets it in the alert's content div.
	*/
	self.set_content = function(content) {
		self.dom.content.empty().append(content);
	};

	/**
	*	Initialization code.
	*	Call it after elem was rendered.
	*	Applies events etc.
	*/
	self.initialize = function() {
		if (self.options.timeout) {
			setTimeout(function() {
				self.close(3000);
			}, self.options.timeout );
		}
	};
	
	return self
};