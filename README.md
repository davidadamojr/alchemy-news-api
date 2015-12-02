# An Alchemy News API Library for Node.js

This module provides calls to the [Alchemy News API](http://www.alchemyapi.com/api/newsapi) for [Nodejs](http://nodejs.org). It is based on [AlchemyAPI for Nodejs](https://github.com/framingeinstein/node-alchemy). For more information on the API requests and responses, visit the [AlchemyData News API docs](http://docs.alchemyapi.com/). To use this module, you will need to obtain a key from [Alchemy](http://www.alchemyapi.com/api/register.html).

## Installation

You can install this through npm: npm install alchemy-news-api

You can install via git by cloning: `git clone https://github.com/davidadamojr/alchemy-news-api.git /path/to/alchemy-news-api`

## Usage

        var AlchemyNewsAPI = require('alchemy-news-api');
        var alchemyNewsAPI = new alchemyNews('<YOUR API KEY>');
        var taxonomyQuery = {
            'taxonomy_label': 'politics',
            'return': ['url', 'title']
        };
        alchemyNewsAPI.getNewsByTaxonomy(taxonomyQuery, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log(response);

                // do something with response
            }
        });

## Tests

To run tests type `mocha`

## Alchemy News API Features

## Taxonomy 

Retrieve categorized news content by searching for news on topics that you care about e.g. baseball, mobile phones, etc.

        var AlchemyNewsAPI = require('alchemy-news-api');
        var alchemyNewsAPI = new alchemyNews('<YOUR API KEY>');
        var taxonomyQuery = {
            'taxonomy_label': 'baseball',
            'return': ['url', 'title']
        };
        alchemyNewsAPI.getNewsByTaxonomy(taxonomyQuery, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                // do something with response

                console.log(response);
            }
        });

## Concepts

Retrieve news content containing abstract concepts.

        var AlchemyNewsAPI = require('alchemy-news-api');
        var alchemyNewsAPI = new alchemyNews('<YOUR API KEY>');
        var conceptQuery = {
            'concept_text': 'Android',
            'return': ['url', 'title']
        };
        alchemyNewsAPI.getNewsByConcept(conceptQuery, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                // do something with response

                console.log(response);
            }
        });

## Keywords

Retrieve news content containing specified keywords. Keywords are terms explicitly mentioned in the article that are determined to be highly relevant to the subject matter of the news article.

        var AlchemyNewsAPI = require('alchemy-news-api');
        var alchemyNewsAPI = new alchemyNews('<YOUR API KEY>');
        var keywordQuery = {
            'keyword_text': 'Clinton',
            'return': ['url', 'title']
        };
        alchemyNewsAPI.getNewsByKeyword(keywordQuery, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                // do something with response

                console.log(response);
            }
        });

## Entities

Retrieve news articles using named entities. Named entities are proper nouns such as people, cities, companies, products, etc.

        var AlchemyNewsAPI = require('alchemy-news-api');
        var alchemyNewsAPI = new alchemyNews('<YOUR API KEY>');
        var entityQuery = {
            'entity_text': 'Apple',
            'entity_type': 'company',
            'return': ['url', 'title']
        };
        alchemyNewsAPI.getNewsByEntity(entityQuery, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                // do something with response

                console.log(response);
            }
        });

## Sentiment Analysis

Retrieve news articles based on sentiment. Articles have positive, negative or neutral sentiment.

        var AlchemyNewsAPI = require('alchemy-news-api');
        var alchemyNewsAPI = new alchemyNews('<YOUR API KEY>');
        var sentimentQuery = {
            'title': 'IBM',
            'sentiment_type': 'positive',
            'sentiment_score': '>0.5',
            'return': ['url', 'title']
        };
        alchemyNewsAPI.getNewsBySentiment(sentimentQuery, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                // do something with response

                console.log(response);
            }
        });
        

## Contributions

This Nodejs library does not implement all the capabilities of the Alchemy News API. So there is still a lot that can be added. Contributions and improvements are welcome.
