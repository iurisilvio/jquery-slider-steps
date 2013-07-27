(function($) {
    var binarySearch = function(values, find) {
        var low = 0, high = values.length - 1, i, comparison;
        while (low <= high) {
            i = Math.floor((low + high) / 2);
            if (values[i] < find) { low = i + 1; continue; };
            if (values[i] > find) { high = i - 1; continue; };
            break;
        }
        return i;
    },
    approximate = function(includeLeft, includeRight, value, values, index) {
        var _start = Math.max(index - 1, 0),
            _end = Math.min(values.length, index + 1),
            diff = null, nearest = null;
        for (var i = _start; i < _end; i++) {
            if ((includeLeft && values[i] <= value) || (includeRight && values[i] >= value)) {
                var newDiff = Math.abs(value - values[i]);
                if (diff == null || newDiff < diff) {
                    nearest = values[i];
                    diff = newDiff;
                }
            }
        }
        return nearest;
    },
    findNearest = function(includeLeft, includeRight, value, values) {
        var index = binarySearch(values, value),
            nearest = approximate(includeLeft, includeRight, value, values, index);
        return nearest;
    };

    var slider = $.ui.slider,
        ui_trimAlignValue = slider.prototype._trimAlignValue,
        ui_valueMin = slider.prototype._valueMin,
        ui_valueMax = slider.prototype._valueMax;

    slider.prototype._trimAlignValue = function(val) {
        if (!this.options.steps) {
            return ui_trimAlignValue.call(this, val);
        }
        val = findNearest(true, true, val, this.options.steps);
        return parseFloat(val.toFixed(5));
    };

    slider.prototype._valueMin = function() {
        if (!this.options.steps) {
            return ui_valueMin.call(this)
        }
        return this.options.steps[0];
    };

    slider.prototype._valueMax = function() {
        if (!this.options.steps) {
            return ui_valueMax.call(this)
        }
        return this.options.steps[this.options.steps.length - 1]
    };
})(jQuery);
