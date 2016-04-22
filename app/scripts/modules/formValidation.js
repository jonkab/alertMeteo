/**
 * Created by raphaeldardeau on 26/02/2016.
 */
/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
'use strict';

var jQuery = require('jquery/dist/jquery.min');

(function ($, window, document, undefined) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    //https://www.polymer-project.org/samples/layout-elements/toolbar-sample.vulcanized.html

    var pluginName = 'formValidation',
        defaults = {
            nativeConstraintValidationUI: false,
            customTooltipTpl: '<p class="error error-down">{{message}}</p>',
            classNames: {
                submit: 'submit',
                loading: 'is-submiting',
                error: 'error'
            },
            errorMessages: {
                required: {
                    en: 'Please fill out this field.',
                    fr: 'Veuillez renseigner ce champs.'
                },
                pattern: {
                    en: 'Please match the requested format.',
                    fr: 'Veuillez respecter le format requis.'
                }
            }
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.$element = $(element);
        this.$submit = this.$element.find('button[type="submit"]');
        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        var metadata = this.$element.data();
        this.options = $.extend({}, defaults, options, metadata);
        //
        this._defaults = defaults;
        this._name = pluginName;

        //
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var _this = this;

            this.setLanguage();

            if (this.hasConstraintValidationAPI() && !this.options.nativeConstraintValidationUI) {
                this.disableNativeConstraintValidationUI();
                this.setCustomConstraintValidationUI();
            } else {
                this.setFallbackConstraintValidationUI();
            }

            this.$element.ajaxForm({
                beforeSubmit: function() {
                    if (_this.checkErrors()) {
                        return false;
                    }
                    _this.setLoading(_this.$element);
                },
                success: function() {
                    if (_this.$element.attr('target')) {
                        $('body').trigger(_this.$element.attr('target'));
                    }
                    _this.unsetLoading();
                },
                error: function(datas) {
                    console.error('error', datas);
                  //  _this.displayCustomEror(': '+ datas.statusText);
                    _this.displayCustomEror('Erreur : Saisie incorrect ou code postal inconnu');
                    _this.unsetLoading();
                }
            });
        },

        setLanguage: function() {
            this.userLang = navigator.language || navigator.userLanguage;
            if (typeof this.options.errorMessages.required[this.userLang] === 'undefined') {
                this.userLang = 'en';
            }
        },

        setLoading: function() {
            this.$element.addClass(this.options.classNames.loading);
            this.$element.find('.' + this.options.classNames.submit).attr('disabled', 'disabled');
        },

        unsetLoading: function() {
            this.$element.removeClass(this.options.classNames.loading);
            this.$element.find('.' + this.options.classNames.submit).removeAttr('disabled');
        },

        hasConstraintValidationAPI: function () {
            return (typeof document.createElement( 'input' ).checkValidity === 'function');
        },

        disableNativeConstraintValidationUI: function() {
            var _this = this;
            for (var i = 0; i < this.$element.length; i++) {
                this.$element[i].addEventListener('invalid', function(e) {
                    e.preventDefault();
                    var item = e.target;
                    _this.displayCustomEror(item.validationMessage, $(item));
                }, true);
            }
        },

        setCustomConstraintValidationUI: function() {
            var _this = this;
            $(_this.$element[0].elements).on('keyup', function(e) {
                var item = e.target;

                if (item.validity.valid) {
                    _this.unsetCustomEror($(item));
                } else {
                    _this.displayCustomEror(item.validationMessage, $(item),'after');
                }
            });
        },

        setFallbackConstraintValidationUI: function() {
            var _this = this;
            $(_this.$element[0].elements).on('keyup', function (e) {
                var item = e.target;
                _this.unsetCustomEror($(item));
                _this.checkErrors();
            });
        },

        checkErrors: function() { // for browsers doesn't fully support Constraint Validation
            var errorCount = 0;
            for (var i = 0; i < this.$element[0].elements.length; i++) {
                var item = this.$element[0].elements[i];
                // check required
                if ($(item).attr('required') && !$(item).val()) {
                    this.displayCustomEror(this.options.errorMessages.required[this.userLang], $(item));
                    errorCount++;
                }
                // check type=email
                var regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
                if ($(item).val() && $(item).attr('type') === 'email' && !regEmail.test($(item).val())) {
                    this.displayCustomEror(this.options.errorMessages.pattern[this.userLang], $(item));
                    errorCount++;
                }
                // check type=number
                var regNumber = /^[0-9]+$/;
                if ($(item).val() && $(item).attr('type') === 'number' && !regNumber.test($(item).val())) {
                    this.displayCustomEror(this.options.errorMessages.pattern[this.userLang], $(item),'after');
                    errorCount++;
                }
                // check pattern
                if ($(item).val() && $(item).attr('pattern')) {
                    var regPattern = new RegExp($(item).attr('pattern'));
                    if (!regPattern.test($(item).val())) {
                        this.displayCustomEror(this.options.errorMessages.pattern[this.userLang], $(item));
                        errorCount++;
                    }
                }
            }
            return errorCount ? true : false;
        },

        displayCustomEror: function(message, $item, position) {

            if (!$item) { // global error
                if (!this.$element.children('.' + this.options.classNames.error).length) {
                    if((position!=='undefined') && (position ==='after')){
                        this.$element.append(this.options.customTooltipTpl.replace('{{message}}', message));
                        $item.addClass('errorInput');
                        this.$submit.addClass('errorButton');
                    }
                    else{
                        this.$element.prepend(this.options.customTooltipTpl.replace('{{message}}', message));
                    }

                } else {
                    this.$element.children('.' + this.options.classNames.error).replaceWith(this.options.customTooltipTpl.replace('{{message}}', message));
                }
            } else { // single error
                if (!$item.prev('.' + this.options.classNames.error).length) {
                    if((position!=='undefined') && (position ==='after')){
                        this.$element.find('.' + this.options.classNames.error).remove();

                        $item.after(this.options.customTooltipTpl.replace('{{message}}', message));
                        $item.addClass('errorInput');
                        this.$submit.addClass('errorButton');
                    }
                    else {
                        $item.before(this.options.customTooltipTpl.replace('{{message}}', message));
                    }

                } else {
                    $item.prev('.' + this.options.classNames.error).replaceWith(this.options.customTooltipTpl.replace('{{message}}', message));
                }
            }
        },


        unsetCustomEror: function($item) {

            if (!$item) { // global error
                this.$element.find('.' + this.options.classNames.error).remove();
            } else { // single error
                $item.prev('.' + this.options.classNames.error).remove();
                $item.next('.' + this.options.classNames.error).remove();
                this.$element.find('.' + this.options.classNames.error).remove();
                $item.removeClass('errorInput');
                this.$submit.removeClass('errorButton');
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
