/**
* alchemy-news-api - A node module for calling the AlchemyData News API
* See http://docs.alchemyapi.com/docs/introduction/ for details about 
* the API requests and responses.
* Copyright (c) 2014 David Adamo Jr.
* MIT License
*/

var url = require('url');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var extend = require('./extend');
var imageType = require('image-type');

var AlchemyNewsAPI = function (api_key, opts) {
    var settings = {
        format: "json",
        api_url: "access.alchemyapi.com",
        protocol: "http"
    };

    settings = extend(settings, opts);

    this.config = {
        api_url: settings.api_url,
        protocol: settings.protocol
    };

    this.options = {
        
    };
};
