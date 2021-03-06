﻿(function ($) {

    function renderBody(tbody, options, columnSettings, sortType) {
        tbody.empty();
        var data = typeof columnSettings === 'undefined' || columnSettings == null || !columnSettings.hasOwnProperty('sort') ? options.data : options.data.sort(columnSettings.sort);
        if (typeof columnSettings !== 'undefined' && typeof sortType === 'undefined' || sortType == 'up')
            data = data.reverse();
        $.each(data, function (objIndex, objValue) {
            if (!options.filter(objValue))
                return;
            var row = $('<tr>').appendTo(tbody);
            $.each(options.columns, function (colIndex, colSettings) {

                if (!colSettings.visible || !objValue.hasOwnProperty(colIndex))
                    return;

                var cellHtml;
                
                if (!colSettings.parse)
                    cellHtml = objValue[colIndex];
                else
                    cellHtml = colSettings.parse(objValue[colIndex]);

                var cell = $('<td>').append(cellHtml).appendTo(row);
                if (colSettings.style)
                    cell.attr('style', colSettings.style);
            });
        });
    }

    function renderTable(self, options) {
        var data = options.data;
        var columns = options.columns;

        if (options.hasOwnProperty('title')) {
            self.append(options.title);
        }

        if (data.length == 0)
            return;

        var tableDiv = $('<div>').appendTo(self),
            table = $('<table>').addClass('table table-hover table-bordered table-striped').appendTo(tableDiv),
            thead = $('<thead>').appendTo(table),
            headRow = $('<tr>').appendTo(thead),
            tbody = $('<tbody>').appendTo(table);

        $.each(columns, function (colIndex, colSettings) {
            if (!colSettings.visible)
                return;
            $('<th>').append(!colSettings.title ? colIndex : colSettings.title)
                .append($('<span>', { id: 'sort-span' }))
                .addClass('sort-header')
                .css('vertical-align', 'center')
                .appendTo(headRow)
                .click(function () {
                    var sortSpan = $('#sort-span', $(this));

                    var sort = sortSpan.data('sort');
                    var sortType = !sort || sort == 'up' ? 'down' : 'up';
                    $('[id=sort-span]').empty().data('sort', null);
                    sortSpan.empty().append(' ').append($('<i>').addClass('icon-large icon-sort-' + sortType));
                    sortSpan.data('sort', sortType);
                    renderBody(tbody, self.data('data'), colSettings, sortType);
                });
        });

        renderBody(tbody, options);

    }

    var defaultColumn = {
        visible: true
    };

    var defaults = {
        columns: {

        },
        sort: [],
        filter: function () {
            return true;
        }
    };

    var methods = {

        init: function (options) {

            var settings = this.data('data');
            if (!settings) {
                settings = $.extend({}, defaults, options);
                $.each(settings.columns, function (colIndex, colSettings) {
                    colSettings = $.extend({}, defaultColumn, colSettings);
                });
            }
            var self = this;
            self.data('data', settings);
            renderTable(self, settings);
            return this;
        },

        reload: function (options) {
            var settings = this.data('data');
            settings = $.extend({}, settings, options);
            var self = this;
            self.data('data', settings);
            var tbody = $('tbody', self);
            renderBody(tbody, settings);
            return this;
        },

        destroy: function () {
            this.data('data').remove();
        }
    };


    $.fn.tableGen = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            return $.error('Method "' + method + '" not found in tableGen plugin');
        }
    };


})(jQuery);
