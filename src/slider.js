;(function () {

	var pluginName = 'jqslider';

	function Plugin (element, options) {
		"use strict";

		// setup
		this.setup(element, options || {});

		// prepare data
		this.prepareData();


		// draw elements
		var $container = $('<div/>');

		$container.append(this.renderMarks());
		$container.append(this.renderHandler());

		if (this.name){
			$container.append(this.renderInput());
		}

		this.$element.append($container);


		// movements helpers
		var manageMovements = $.proxy (function (event){
			var X = event.pageX - this.$element.offset().left;

			X = X < 0 ? 0 : X;
			X = X > this.width ? this.width : X;

			this.$handler.css({	left: X });	
		}, this);

		var stopMovements = $.proxy (function (event){
			$('body').removeClass('jqslider-dragging');

			$(window).unbind('mousemove', manageMovements);
			$(window).unbind('mouseup', stopMovements);

			this.setValue (this.getValue (this.$handler.position ().left));

		}, this);


		// attach events 
		$container.on('mousedown', '.handler', function (event) {
			$('body').addClass('jqslider-dragging');

			$(window).bind('mousemove', manageMovements);
			$(window).bind('mouseup', stopMovements);
			
		}).on('click', '>ul>li', $.proxy(function (event) {
			this.setValue (this.getValue ($(event.target).position ().left));
			return false;
		}, this));
	};

	Plugin.prototype.setup = function (element, options){
		this.$element = $(element).addClass('jqslider');
		this.width = this.$element.innerWidth();
		this.data = options.data || [];
		this.value = options.value || 0;
		this.name = options.name;

		// callback
		this.onChange = options.onChange;
	};

	Plugin.prototype.prepareData = function (){
		this.data.sort(function(a, b){
			return a.value - b.value;
		});

		this.maxValue = this.data [this.data.length - 1].value;		
	};

	Plugin.prototype.renderMarks = function(){
		var $marks = $('<ul/>'),
			marks = '';

		for (var i=0;i<this.data.length;i++){
			marks += '<li style="left:' + 
					 Math.floor(this.width * this.data [i].value / this.maxValue) + 'px;" ' +
					 'data-label="' + (this.data [i].label || '') + '"/>';
		}

		return $marks.html(marks);
	};

	Plugin.prototype.renderHandler = function (){
		return this.$handler = $('<div class="handler" style="left:' + (this.width * this.value / this.maxValue) + 'px;"/>');
	};

	Plugin.prototype.renderInput = function (){
		return this.$input = $('<input type="hidden" name="' + this.name + '"value="' + this.value + '"/>');
	};


	Plugin.prototype.getValue = function (offset){
		var width = this.width,
			data = this.data,
			value = Math.round(this.maxValue * offset / width);

		var items = $.grep(data, function(item, index){
			var inInterval = false;

			if (value == item.value){
				return true;
			} else {
				inInterval = value > item.value && value < data [index + 1].value 
						  || value < item.value && value > data [index - 1].value;
			}

			return inInterval; 
		});

		// exact position
		if (items.length == 1){
			return items [0].value;
		} 

		// choose the closest by round
		return items [ Math.round( (items [0].value - value) / (items [0].value - items [1].value) ) ].value;
	};

	Plugin.prototype.setValue = function (value){
		this.value = value;
		this.$handler.css({ left: this.width * value / this.maxValue});

		if (this.$input){
			this.$input.val(value).trigger('change');
		}

		if (typeof this.onChange == 'function'){
			this.onChange.call(this.$element [0], value);
		}

	};


	$.fn [pluginName] = function (options)  {
		return this.each (function (){
			if (!$.data (this, pluginName)) {
				$.data (this, pluginName, new Plugin (this, options));
			}
		});
	};

})();