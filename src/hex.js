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
		this.requires("2D, Canvas, VisibleProperty");
		this.visibleProperty("radius");
		this.bind("Change_radius", function() {
			this.w = this.radius * 2;
			this.h = this.radius * Math.sqrt(3);
		});
	},
	draw: function() {
		var ctx = Crafty.canvas.context;
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.globalCompositeOperation = "lighten";
		//"lighten", "lighter";
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
});

Crafty.c("HexGrid", {
	init: function(){
	},
	HexGrid: function(rows, cols, r) {
		this.rows = rows;
		this.cols = cols;
		this._cells = this._createCells(rows, cols, r);
		console.log(this._cells);
	},
	_createCells: function(rows, cols, r) {
		_cells = {};
		for (var col = 0; col < this.cols; col++) {
			for (var row = 0; row < this.rows; row++) {
				var _cell = Crafty.e("Canvas, Hexagon, Tween").attr({
					x: col * r + (row % 2) * r / 2,
					y: row * r * Math.sqrt(3) / 2,
					radius: r,
					color: this._rgb(
						(col+1)/cols * 255,
						(row+1)/rows * 255, 
						(1 - (col+row) / (cols+rows)) * 255),
				}).attr({radius: 0}).tween({radius: r}, 1000);
				_cells[this._key(col, row)] = _cell;
			}
		}
		return _cells;
	},
	_key: function(x, y) {
		return "" + x + "," + y;
	},
	_rgb: function(r, g, b) {
		r = Math.floor(r);
		g = Math.floor(g);
		b = Math.floor(b);
		return "rgb(" + r + "," + g + "," + b + ")";
	},
});
window.onload = function(){
	Crafty.init(300, 200);
	Crafty.background("#ffffff");

	Crafty.e("HexGrid").HexGrid(6, 4, 50)
};
