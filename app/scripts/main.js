'use strict';

require('babel-polyfill');

var jQuery = require('jquery/dist/jquery.min');
import * as jqueryAndPlugins from './modules/jqueryPlugins';

(function  ($) {

    $('.js-ajaxSubmit').formValidation();

})(jQuery);

