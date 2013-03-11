// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Eventoverse.Graphs.Canvas = (function() {

    Canvas.prototype.defaults = {
      x: {
        caption: ""
      },
      y: {
        caption: ""
      },
      interpolate: "cardinal",
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      }
    };

    function Canvas(selector, attrs) {
      this.selector = selector;
      this.attrs = attrs;
      this.elements = [];
      this.width = 1000 - this.defaults.margin.left - this.defaults.margin.right;
      this.height = 200 - this.defaults.margin.top - this.defaults.margin.bottom;
      this.x = d3.time.scale().range([0, this.width]);
      this.y = d3.scale.linear().range([this.height, 0]);
      this.svg = d3.select(this.selector).append("svg").attr("width", this.width + this.defaults.margin.left + this.defaults.margin.right).attr("height", this.height + this.defaults.margin.top + this.defaults.margin.bottom).append("g").attr("transform", "translate(" + this.defaults.margin.left + "," + this.defaults.margin.top + ")");
      this.svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", this.width).attr("height", this.height);
      this.prepareAxes();
      this;

    }

    Canvas.prototype.addElement = function(element, args) {
      this.elements.push(new element(this, args));
      return this;
    };

    Canvas.prototype.xAxis = function() {
      return d3.svg.axis().scale(this.x).orient("bottom").tickSubdivide(false).tickSize(5, 0, 5);
    };

    Canvas.prototype.yAxis = function() {
      return d3.svg.axis().scale(this.y).orient("left").ticks(10).tickSubdivide(1).tickSize(10, 5, 10);
    };

    Canvas.prototype.prepareAxes = function() {
      var renderedYAxis;
      this.axes = this.svg.append("svg:g").classed("rules", true);
      this.axes.append("g").classed("x axis", true).attr("transform", "translate(0," + this.height + ")").append("text").attr("x", this.width).attr("dy", "1.5em").style("text-anchor", "end").text(this.attrs.x.caption || this.defaults.x.caption);
      this.axes.append("g").classed("x grid", true).attr("transform", "translate(0," + this.height + ")");
      this.axes.append("g").classed("y grid", true);
      renderedYAxis = this.axes.append("g").classed("y axis", true);
      renderedYAxis.append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(this.attrs.y.caption || this.defaults.y.caption);
      return this;
    };

    Canvas.prototype.render = function(data, opts) {
      this.renderAxes(data);
      return _.each(this.elements, function(element) {
        if (opts && opts.skip === element) {
          return;
        }
        console.log("Starting rendering: ", element, data);
        element.render(data);
        return console.log("Finished rendering: ", element, data);
      });
    };

    Canvas.prototype.xFormatter = function(d) {
      return new Date(d.x);
    };

    Canvas.prototype.renderAxes = function(all_data) {
      var data, very_max, very_min;
      data = Eventoverse.Utils.mergeData(all_data);
      this.x.domain(d3.extent(data, this.xFormatter));
      very_min = d3.min(data, function(d) {
        return d.y;
      });
      very_max = d3.max(data, function(d) {
        return d.y;
      });
      this.y.domain([very_min - 1, very_max + 1]);
      this.svg.select(".x.axis").call(this.xAxis());
      this.svg.select(".y.axis").call(this.yAxis());
      this.svg.select(".x.grid").call(this.xAxis().tickSize(-this.height, 0, 0).tickFormat(""));
      this.svg.select(".y.grid").call(this.yAxis().tickSize(-this.width, 0, 0).tickFormat(""));
      return this;
    };

    return Canvas;

  })();

  this.Eventoverse.Graphs.RealTimeCanvas = (function(_super) {

    __extends(RealTimeCanvas, _super);

    RealTimeCanvas.prototype.xFormatter = function() {
      return "";
    };

    function RealTimeCanvas(selector, attrs) {
      this.selector = selector;
      this.attrs = attrs;
      RealTimeCanvas.__super__.constructor.call(this, this.selector, this.attrs);
      this.x = d3.scale.linear().domain([1, this.attrs.buffer_size - 2]).range([0, this.width]);
      this;

      this.y = d3.scale.linear().domain([0, 3]).range([this.height, 0]);
      this.attrs.paused = false;
    }

    RealTimeCanvas.prototype.render = function(data, opts) {
      this.data = data;
      this.renderAxes(data);
      return _.each(this.elements, function(element) {
        if (opts && opts.skip === element) {
          return;
        }
        console.log("Starting rendering: ", element, data);
        element.render(data);
        return console.log("Finished rendering: ", element, data);
      });
    };

    RealTimeCanvas.prototype.renderAxes = function(all_data) {
      var data;
      data = Eventoverse.Utils.mergeData(all_data);
      this.svg.select(".x.axis").call(this.xAxis());
      this.svg.select(".y.axis").call(this.yAxis());
      this.svg.select(".x.grid").call(this.xAxis().tickSize(-this.height, 0, 0).tickFormat(""));
      this.svg.select(".y.grid").call(this.yAxis().tickSize(-this.width, 0, 0).tickFormat(""));
      return this;
    };

    return RealTimeCanvas;

  })(Eventoverse.Graphs.Canvas);

  this.Eventoverse.Graphs.Controls = (function() {

    function Controls(canvas, args) {
      this.canvas = canvas;
      this.args = args;
      this.tipsy = __bind(this.tipsy, this);

      this.resume = __bind(this.resume, this);

      this.pause = __bind(this.pause, this);

    }

    Controls.prototype.render = function() {
      this.element = $("<div class='btn-group'><button class='btn pause'><i class='icon-pause'></i></button><button class='btn play'><i class='icon-play'></i></button></div>");
      $(this.canvas.selector).append(this.element);
      this.pause_button = $(this.element).find('.btn.pause');
      this.resume_button = $(this.element).find('.btn.play');
      this.pause_button.click(this.pause);
      this.resume_button.click(this.resume);
      return this.resume_button.hide();
    };

    Controls.prototype.pause = function() {
      this.tipsy(this.canvas.data);
      this.canvas.attrs.paused = true;
      this.pause_button.hide();
      return this.resume_button.show();
    };

    Controls.prototype.resume = function() {
      this.removeTipsy();
      this.canvas.attrs.paused = false;
      this.resume_button.hide();
      return this.pause_button.show();
    };

    Controls.prototype.removeTipsy = function() {
      return this.circles.remove();
    };

    Controls.prototype.tipsy = function(data) {
      var args, tipsy,
        _this = this;
      this.circles = this.canvas.svg.append('svg:g').selectAll('.data-point').data(data.values);
      this.circles.enter().append('svg:circle').attr('class', 'data-point').attr('cx', function(d, i) {
        return _this.canvas.x(i);
      }).attr('cy', function(d, i) {
        return _this.canvas.y(d.y);
      }).attr('r', function() {
        return 2;
      });
      args = this.args;
      tipsy = {
        gravity: 'w',
        html: true,
        title: function() {
          return args.tip_formatter(this.__data__);
        }
      };
      return $('svg circle').tipsy(tipsy);
    };

    return Controls;

  })();

}).call(this);
