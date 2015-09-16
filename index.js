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
        protocol: "https"
    };

    settings = extend(settings, opts);

    this.config = {
        api_url: settings.api_url,
        protocol: settings.protocol
    };

    this.options = {
        apikey: api_key,
        outputMode: settings.format
    };

    return this;
};

/**
* Generates the URL object to be passed to the HTTP request for a specific 
* API method call
* @param {Object} query The query object
* @return {Object} The URL object for this request
*/
AlchemyAPI.prototype._generateNiceUrl = function (query, options, method) {
    var result = url.parse(url.format({
        protocol: this.config.protocol,
        hostname: this.config.api_url,
        pathname: '/calls' + '/' + method,
        method: 'GET',
        query: options
    });

    // redirection issue fix here if it comes up

    return result;
};

/**
* Function to do a HTTP request with the current query
* @param {Object} request_query The current query object
* @param {Function} cb the callback function for the returned data
* @return {void}
*/
AlchemyAPI.prototype._doRequest = function (request_query, cb) {
    // Pass the requested URl as an object to the get request
    var http_protocol = (request_query.nice.protocol === 'https:') ? https : http;
    
    var req = http_protocol.request(request_query.nice, function (res) {
        var data = [];
        res
         .on('data', function (chunk) { data.push(chunk); })
         .on('end', function () {
             var urldata = data.join('').trim();

             var result;
             try {
                 result = JSON.parse(urldata);
             } catch (exp) {
                 result = {'status_code': 500, 'status_text': 'JSON Parse Failed'};    
             }

             cb(null, result);
         })
         .on('error', function (err) {
             cb(new Error ("response.error: " + err), null);
         });  
    });

    req.on("error", function (err) {
        cb(new Error("request.error: " + err), null);
    }

    req.end();
};

/**
* Function to check if a passed string is a valid URL
* @param {String} str The URL string to be checked
* @return {Boolean}
*/
AlchemyAPI.prototype._urlCheck = function (str) {
    var parsed = url.parse(str);
    return (!!parsed.hostname && !!parsed.protocol && str.indexOf(' ') < 0);
};

/**
* Function to return API key usage information
* @param {Object} options Options to be passed to AlchemyAPI (no options are currently supported)
* @param cb
*/
AlchemyAPI.prototype.apiKeyInfo = function (options, cb) {
    var opts = extend(this.options, opts);
    var query = {
        data: "",
        post: {},
        apimethod: "info/GetAPIKeyInfo",
        headers: {
            "content-length": 0
        }
    };
    query.nice = this._generateNiceUrl(null, opts, query.apimethod);
    query.nice.method = "GET";
    query.nice.headers = query.headers;
    this._doRequest(query, cb);
};

/**
* Function to search news by topoic e.g. baseball, mobile phones, etc.
* @param 
*/
AlchemyAPI.prototype.getNewsByTaxonomy = function (options) {

};

// export as main entry point in this module
module.exports = AlchemyAPI;
