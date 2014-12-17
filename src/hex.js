var Utils = {
	randInt: function(max) {
		return Math.floor(Math.random() * max);
	},
	randomChoice: function(seq) {
		return seq[Utils.randInt(seq.length)];
	},
	rgb: function(r, g, b) {
		r = Math.floor(r);
		g = Math.floor(g);
		b = Math.floor(b);
		return "rgb(" + r + "," + g + "," + b + ")";
	},
};

Crafty.c("VisibleProperty", {
	init: function() {
		this._gProps = {};
	},
	visibleProperty: function(name) {
		Object.defineProperty(this, name, {
			set: function(value) {
				if (this._gProps[name] === value) {
					return;
				};
				this._gProps[name] = value;
				var _obj = {};
				_obj[name] = value;
				this.trigger("Change_" + name);
				this.trigger("Invalidate");
			},
			get: function() {
				return this._gProps[name];
			},
		});
	},
});

Crafty.c("Hexagon", {
	init: function() {
		this.requires("2D, Canvas, VisibleProperty, Tween, Delay");
		this.visibleProperty("radius");
		this.bind("Change_radius", function() {
			this.w = this.radius * 2;
			this.h = this.radius * Math.sqrt(3);
		});
		this._isTweening = false;
	},
	draw: function() {
		var ctx = Crafty.canvas.context;
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.globalAlpha = 0.5;
		//ctx.globalCompositeOperation = "lighter";
		//"lighten", "lighter", "multiply", "screen", "difference";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y + this.h / 2);
		ctx.lineTo(this.x + this.w / 4, this.y);
		ctx.lineTo(this.x + this.w * 3 / 4, this.y);
		ctx.lineTo(this.x + this.w, this.y + this.h / 2);
		ctx.lineTo(this.x + this.w * 3 / 4, this.y + this.h);
		ctx.lineTo(this.x + this.w / 4, this.y + this.h);
		ctx.lineTo(this.x, this.y + this.h / 2);  
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	},
	tweenColor: function(color) {
		if (this._isTweening) {
			return this;
		};
		this._isTweening = true;
		var dt = 1000;
		var oldAttrs = {x: this.x, y: this.y, radius: this.radius};
		var intermediateAttrs = {
			x: this.x + this.radius,
			y: this.y + this.radius * Math.sqrt(3) / 2,
			radius: 0,
		};
		this.tween(intermediateAttrs, dt).delay(function() {
			this.attr("color", color).tween(oldAttrs, dt);
		}, dt, 0);
		this.delay(function() {this._isTweening = false;}, 2*dt, 0);
		return this;
	},
});

Crafty.c("HexGrid", {
	init: function(){
		this._cells = {};
	},
	HexGrid: function(cols, rows, r) {
		this.rows = rows;
		this.cols = cols;
		this._cells = this._createCells(rows, cols, r);
		this._cells = this._createCells(rows, cols, r);
		return this;
	},
	_createCells: function(rows, cols, r) {
		_cells = {};
		for (var col = 0; col < this.cols; col++) {
			for (var row = 0; row < this.rows; row++) {
				var _cell = Crafty.e("Canvas, Hexagon, Tween").attr({
					x: col * r + (row % 2) * r / 2,
					y: row * r * Math.sqrt(3) / 2,
					radius: r,
					color: "rgba(0, 0, 0, 0)",
				});
				_cells[this._key(col, row)] = _cell;
			}
		}
		return _cells;
	},
	_key: function(x, y) {
		return "" + x + "," + y;
	},
	getKeys: function() {
		return Object.keys(this._cells);
	},
	at: function(x, y) {
		var key = x;
		if (y !== undefined) {
			key = this._key(x, y);
		};
		return this._cells[key];
	},
});

Crafty.c("RandomFlipper", {
	init: function() {
		this.requires("Delay");
	},
	RandomFlipper: function(grid, dt) {
		this.dt = dt;
		this.grid = grid;
		this.delay(this.flipRandomCell, this.dt, -1);
		return this;
	},
	flipRandomCell: function() {
		var key = Utils.randomChoice(this.grid.getKeys());
		var color = this.randomColor();
		this.grid.at(key).tweenColor(color);
		return this;
	},
	randomColor: function() {
		var colors = [
			"rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)",
			"rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)",
			"#ff0000", "#00ff00", "#0000ff",
			"#00ffff", "#ff00ff", "#ffff00",
		]
		return Utils.randomChoice(colors);
	},
});

window.onload = function(){
	Crafty.init(800, 450);
	Crafty.background("rgba(0, 0, 0, 0)");

	var grid = Crafty.e("HexGrid").HexGrid(14, 9, 50);
	var rf = Crafty.e("RandomFlipper").RandomFlipper(grid, 100);
};
