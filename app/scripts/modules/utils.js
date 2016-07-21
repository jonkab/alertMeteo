'use strict';

var $ = require('jquery/dist/jquery.min');

export var Ajax = {
    getDatas: function (url, opts) {
        var _this = this;

        if (url) {
            return $.ajax(url, opts).then(_this.success, _this.fail);
        }
    },

    success: function (content) {
        return content;
    },

    fail: function (jqXHR, textStatus) {
        if (jqXHR.status === 307) {
            return;
        }

        console.warn('An error has occurred in utils ajax call');
        console.warn(jqXHR);
        return jqXHR;
    }
};


export function truncate(str, length) {
    var trunc = str;
    if (trunc && trunc.length > length) {
        /* Truncate the content of the P, then go back to the end of the previous word. */
        trunc = trunc.substring(0, length);
        trunc = trunc.replace(/\w+$/, '');
        return trunc + "...";
    } else {
        return trunc;
    }
};


