'use strict';

if(!window.babelPolyfill)
{
    window.babelPolyfill= require('babel-polyfill');
}



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

var displayMessageError = function(msg){
    $form.prepend('<p class="error error-down">'+msg+'</p>');
};

 var $form = $('.js-ajaxSubmit');
    var $submitButton= $form.find('.searchAlert');
    //$submitButton.prop('disabled', true);
   // $submitButton.prop('disabled', false);
    var $form = $('.js-ajaxSubmit');

    var ajaxSettings = {
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false

    };

    //var urlTranscoMock = '/content/freecomponent/alerte-meteo/inseeCp.json';
    var urlTranscoMock = 'mock/inseeCp.json';

    var urlTransco = location.hostname +'/bin/translateZipCode?zipCodeToTranslate=';

    var urlPredict = 'http://wiki-predict.com/axa_particulier/accueil.html?insee=';

    var getInsee = function(cp) {
        var url = urlTransco + cp;
        return utils.Ajax.getDatas(url, ajaxSettings).promise();
    };
    var getInseeMock = function() {
        var url = urlTranscoMock;
        return utils.Ajax.getDatas(url, ajaxSettings).promise();
    };
    var showWeatherOnPredictMap = function(cp) {
        getInsee(cp).done(function (data) {
            window.open(urlPredict + data, '_blank');
            $form.find('.error').remove();
        });
        getInsee(cp).fail(function (data) {
            var msgError = "Problème de connexion avec le service";
            if(data.status==200)
                msgError = "Code insee non trouvé";

            displayMessageError(msgError);
        });
    };
    var showWeatherOnPredictMapMock = function(cp) {
        getInseeMock().done(function (data) {
            var result = _.findByValues(data, 'cp', [cp]);
            if (result.length > 0) {
                var insee = result[0].insee;
                window.open(urlPredict + insee, '_blank');
               // $form.find('.error').remove();
            } else {
                var msgError = "Code insee non trouvé pour ce code postal";
                displayMessageError(msgError);
                console.log("insee not found for this cp");
            }
        });
        getInseeMock().fail(function (data) {
            var msgError = "Problème de connexion avec le service";
            if(data.status==200)
                msgError = "Code insee non trouvé";
            displayMessageError(msgError);
        });
    };

    $form.formValidation();

    $form.on('submit', function (e) {
        e.preventDefault();

        //if(AXAGenericConfig.InseeTranscodingURL)
        //{
        //    urlTransco=AXAGenericConfig.InseeTranscodingURL;
        //}
        var cp = $form.find('input[name="location"]').val();
        showWeatherOnPredictMap(cp);
       // showWeatherOnPredictMapMock(cp);
    });

})(jQuery);

