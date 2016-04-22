'use strict';

require('babel-polyfill');

var jQuery = require('jquery/dist/jquery.min');
import * as jqueryAndPlugins from './modules/jqueryPlugins';
var _ = require('lodash');
import * as utils from './modules/utils';

(function  ($) {


_.mixin({
    'findByValues': function(collection, property, values) {
        return _.filter(collection, function(item) {
            return _.includes(values, item[property]);
        });
    }
});



var $form = $('.js-ajaxSubmit');
    $form.formValidation();
    $form.on('submit', function(e) {
        e.preventDefault();
         var cp = $form.find('input[name="location"]').val();
        var ajaxSettings = {
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'text json',
            cache: false

        };
        utils.Ajax.getDatas('mock/inseeCp.json',ajaxSettings).promise().done(function(data){
            let result = _.findByValues(data,'cp',[cp]);

            if(result.length>0){
                let insee = (result[0].insee);
                let urlPredict ='http://wiki-predict.com/axa_particulier/accueil.html?insee='+insee;
                window.open(urlPredict,'_blank');

            }
            else
            {
                //cp not found
                console.log(data.statusText);
            }


        });
    });

})(jQuery);

