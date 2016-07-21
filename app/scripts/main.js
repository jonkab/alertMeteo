'use strict';

if (!window.babelPolyfill) {
    window.babelPolyfill = require('babel-polyfill');
}

var jQuery = require('jquery/dist/jquery.min');
import * as jqueryAndPlugins from './modules/jqueryPlugins';
var _ = require('lodash');
import * as utils from './modules/utils';

(function ($) {

    _.mixin({
        'findByValues': function (collection, property, values) {
            return _.filter(collection, function (item) {
                return _.includes(values, item[property]);
            });
        }
    });

    var displayMessageError = function (msg) {
        $form.find('.error').remove();
        $form.prepend('<p class="error error-down">' + msg + '</p>');
    };

    var $form = $('.js-ajaxSubmit');
    var $submitButton = $form.find('.searchAlert');
    //$submitButton.prop('disabled', true);
    // $submitButton.prop('disabled', false);
    var $form = $('.js-ajaxSubmit');

    var ajaxSettings = {
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        cache: false
    };

    var urlTranscoMock = 'mock/inseeCp.json';

    var urlTransco = window.location.href.replace(".html", ".zipcode.json");

    var urlPredict = 'http://wiki-predict.com/axa_particulier/accueil.html?insee=';

    var getInsee = function (cp) {
        ajaxSettings.data = { zipCodeToTranslate: cp };

        return utils.Ajax.getDatas(urlTransco, ajaxSettings);
    };

    var getInseeMock = function (cp) {
        ajaxSettings.data = { zipCodeToTranslate: cp };

        return utils.Ajax.getDatas(urlTranscoMock, ajaxSettings);
    };

    var showWeatherOnPredictMap = function (cp) {
        var p = getInsee(cp);

        p.done(function (data) {
            window.open(urlPredict + data, '_blank');
            $form.find('.error').remove();
        });

        p.fail(function (data) {
            var msgError = "Problème de connexion avec le service";
            if (data.status == 200)
                msgError = "Code insee non trouvé";

            displayMessageError(msgError);
        });
    };

    var showWeatherOnPredictMapMock = function (cp) {
        var p = getInseeMock(cp);

        p.done(function (data) {
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

        p.fail(function (data) {
            var msgError = "Problème de connexion avec le service";
            if (data.status == 200)
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
        //showWeatherOnPredictMapMock(cp);
    });

})(jQuery);

