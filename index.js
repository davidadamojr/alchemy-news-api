/**
* alchemy-news-api - A node module for calling the AlchemyData News API
* See http://docs.alchemyapi.com/docs/introduction/ for details about 
* the API requests and responses.
* Copyright (c) 2015 David Adamo Jr.
* MIT License
*/

'use strict';

var url = require('url');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var extend = require('./extend');
// var imageType = require('image-type');

var AlchemyNewsAPI = function (api_key, opts) {
    var settings = {
        format: "json",
        api_url: "gateway-a.watsonplatform.net",
        protocol: "https"
    };

    settings = extend(settings, opts);

    this.config = {
        api_url: settings.api_url,
        protocol: settings.protocol
    };

    this.options = {
        apikey: api_key,
        outputMode: settings.format,
        start: "now-60d",
        end: "now"
    };

    return this;
};

/**
* Generates the URL object to be passed to the HTTP request for a specific 
* API method call
* @param {Object} query The query object
* @return {Object} The URL object for this request
*/
AlchemyNewsAPI.prototype._generateNiceUrl = function (query, options, method) {
    var result = url.parse(url.format({
        protocol: this.config.protocol,
        hostname: this.config.api_url,
        pathname: '/calls' + '/' + method,
        method: 'GET',
        query: options
    }));

    return result;
};

/**
* Function to return request parameters based on the AlchemyAPI REST interface
* @param {Object} The options to be passed to the AlchemyAPI method
* return {Object}
*/
AlchemyNewsAPI.prototype._getQuery = function (opts) {

    // if statements for each type of query
    // determine type of query by checking if the opts object has certain properties e.g. relation, label, etc.
    
    var options = {};

    // handle query parameters
    
    if (opts.hasOwnProperty('taxonomy_label')) {
        options["q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label"] = opts["taxonomy_label"];
    }

    if (opts.hasOwnProperty('concept_text')) {
        options["q.enriched.url.concepts.concept.text"] = opts["concept_text"];
    }

    if (opts.hasOwnProperty('keyword_text')) {
        options["q.enriched.url.enrichedTitle.keywords.keyword.text"] = opts["keyword_text"];
    }

    if (opts.hasOwnProperty('entity_text') && opts.hasOwnProperty('entity_type')) {
        options['q.enriched.url.enrichedTitle.entities.entity.text'] = opts['entity_text'];
        options['q.enriched.url.enrichedTitle.entities.entity.type'] = opts['entity_type'];
    }

    if (opts.hasOwnProperty('relation')) {
        var relation = opts.relation;
        var relationStr = "|subject.entities.entity.type=" + relation.subject_type + ", acton.verb.text=" + relation.action 
                   + ", object.entities.entity.type=" + relation.object_type + "|";
        options['q.enriched.url.enrichedTitle.relations.relation'] = relationStr;
    }

    if (opts.hasOwnProperty('title')) { 
        options['q.enriched.url.title'] = opts['title'];
        if (opts.hasOwnProperty('sentiment_type') && opts.hasOwnProperty('sentiment_score')) {
            options['q.enriched.url.enrichedTitle.docSentiment.type'] = opts['sentiment_type'];
            options['q.enriched.url.enrichedTitle.docSentiment.score'] = opts['sentiment_score'];
        }
    }

    // build the return parameter
    var return_parameters = opts['return'].map(function (element) {
        var return_query;
        if (element == 'title') {
            return_query = "enriched.url.title";
        } else if (element == 'url') {
            return_query = "enriched.url.url";
        }

        return return_query;
    });
    var return_string = return_parameters.join(',');
    options['return'] = return_string;


    if (opts.hasOwnProperty('apikey')) {
        options['apikey'] = opts['apikey'];
    } else {
        options['apikey'] = this.options['apikey']; // use default setting
    }

    if (opts.hasOwnProperty('outputMode')) {
        options['outputMode'] = opts['outputMode'];
    } else {
        options['outputMode'] = this.options['outputMode'];
    }

    if (opts.hasOwnProperty('start')) {
        options['start'] = opts['start'];
    } else {
        options['start'] = this.options['start'];
    }

    if (opts.hasOwnProperty('end')) {
        options['end'] = opts['end'];
    } else {
        options['end'] = this.options['end'];
    }

    var query = {};

    var httpMethod = "GET";
    query.apimethod = "data/GetNews";
    query.nice = this._generateNiceUrl(null, options, query.apimethod);
    // console.log(query.nice);
    query.nice.method = httpMethod;

    return query; 
};

/**
* Function to do a HTTP request with the current query
* @param {Object} request_query The current query object
* @param {Function} cb the callback function for the returned data
* @return {void}
*/
AlchemyNewsAPI.prototype._doRequest = function (request_query, cb) {
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
    });

    req.end();
};

/**
* Function to check if a passed string is a valid URL
* @param {String} str The URL string to be checked
* @return {Boolean}
*/
AlchemyNewsAPI.prototype._urlCheck = function (str) {
    var parsed = url.parse(str);
    return (!!parsed.hostname && !!parsed.protocol && str.indexOf(' ') < 0);
};


/**
* Function to check if a request has all the required parameters
* @param {Object} options Options to be passed to AlchemyAPI
* @return {Boolean} returns true if the options object has all required paramters, else otherwise
*/
AlchemyNewsAPI.prototype._isOptionsValid = function (options) {
    if (!options.hasOwnProperty('return')) {
        // return parameter is mandatory in all requests
        return false;
    }

    if (options.hasOwnProperty('taxonomy_label') || options.hasOwnProperty('concept_text') || options.hasOwnProperty('keyword_text') 
    || options.hasOwnProperty('relation')) {
        return true;
    } else if (options.hasOwnProperty('entity_text') && options.hasOwnProperty('entity_type')) {
        return true;
    } else if (options.hasOwnProperty('sentiment_type') && options.hasOwnProperty('sentiment_score') &&  options.hasOwnProperty('title')) {
        return true;
    } else {
       return false; // options object does not have enough required parameters for a successfully query
    }
};

/**
* Function to return API key usage information
* @param {Object} options Options to be passed to AlchemyAPI (no options are currently supported)
* @param cb
*/
AlchemyNewsAPI.prototype.apiKeyInfo = function (options, cb) {
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
* Function to search news by topic e.g. baseball, mobile phones, etc.
* @param {Object} options Options to be passed to AlchemyAPI (start, end, outputMode, count, 
* taxonomy_label, return_fields) 
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNewsByTaxonomy = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request parameters'};
        cb(errorObj, null);
    }

};

/**
* Function to search news by concept e.g. iPad, Android, etc.
* @param {Object} options Options to be passed to AlchemyAPI (start, end, outputMode, count, concept_text, return fields)
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNewsByConcept = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request paramters'};
        cb(errorObj, null);
    }
};

/**
* Function to search news articles by keywords e.g. clinton
* @param {Object} options Options to be passed to AlchemyAPI (start, end, outputMode, keyword, etc)
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNewsByKeyword = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request parameters'};
        cb(errorObj, null);
    }
};

/**
* Function to search news articles by named entities e.g. Apple
* @param {Object} options Options to be passed to AlchemyAPI
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNewsByEntity = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request parameters'};
        cb(errorObj, null);
    }
};

/**
* Function to search news articles by Subject-Action-Object relations from article title and body
* @param {Object} options Options to be passed to alchemyAPI
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNewsByRelation = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request parameters'};
        cb(errorObj, null);
    }
};

/**
* Function to search news articles based on sentiment 
* @param {Object} options Options to be passed to alchemyAPI
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNewsBySentiment = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request parameters'};
        cb(errorObj, null);
    }
};

/**
* Function to retrieve news articles using a custom query
* @param {Object} options Options to be passed alchemyAPI
* @param cb callback function
*/
AlchemyNewsAPI.prototype.getNews = function (options, cb) {
    if (this._isOptionsValid) {
        var query = this._getQuery(options);
        this._doRequest(query, cb);
    } else {
        var errorObj = {type: 'error', message: 'Incomplete request paramters'};
        cb(errorObj, null);
    }
};

// export as main entry point in this module
module.exports = AlchemyNewsAPI;
