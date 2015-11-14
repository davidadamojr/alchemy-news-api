var should = require('chai').should();
var expect = require('chai').expect;
var AlchemyNewsAPI = require('../index');
var alchemyNewsAPI = new AlchemyNewsAPI("nokey", {});

describe("testing query builder", function () {
    it('builds an alchemy-news-api taxonomy query object', function () {
        var taxonomyQuery = {
            'taxonomy_label': 'politics',
            'return': ['url', 'title']
        }; 
        var queryObj = {
            'apikey': 'nokey',
            'start': 'now-60d',
            'end': 'now',
            'outputMode': 'json',
            'q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label': 'politics',
            'return': 'enriched.url.title,enriched.url.url'
        };
        expect(alchemyNewsAPI._getQuery(taxonomy_query)).to.deep.equal(queryObj);
    });

    it('builds an alchemy-news-api concept query object', function () {
        var conceptQuery = {
            'concept_text': 'Android',
            'return': ['url', 'title']
        };
        var queryObj = {
            'apikey': 'nokey',
            'start': 'now-60d',
            'end': 'now',
            'outputMode': 'json',
            'q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label': 'politics',
            'return': 'enriched.url.title,enriched.url.url'
        };
        expect(alchemyNewsAPI._getQuery(conceptQuery)).to.deep.equal(queryObj);
    });

    it('builds an alchemy-news-api keyword query object', function () {
        var keywordQuery = {
            'keyword_text': 'Clinton',
            'return': ['url', 'title']
        };
        var queryObj = {
            'apikey': 'nokey',
            'start': 'now-60d',
            'end': 'now',
            'outputMode': 'json',
            'q.enriched.url.enrichedTitle.keywords.keyword.text': 'Clinton',
            'return': 'enriched.url.title,enriched.url.url'
        };
        expect(alchemyNewsAPI._getQuery(keywordQuery)).to.deep.equal(queryObj);
    });

    it('builds an alchemy-news-api entity query object', function () {
        var entityQuery = {
            'entity_text': 'Apple',
            'entity_type': 'company',
            'return': ['url', 'title']
        };
        var queryObj = {
            'q.enriched.url.enrichedTitle.entities.entity.text': 'Apple',
            'q.enriched.url.enrichedTitle.entities.entity.type': 'company',
            'return': 'enriched.url.title,enriched.url.url',
            'apikey': 'nokey',
            'start': 'now-60d',
            'end': 'now',
            'outputMOde': 'json'
        };
        expect(alchemyNewsAPI._getQuery(entityQuery)).to.deep.equal(queryObj);
    });

    it('builds an alchemy-news-api title query', function () {
        var titleQuery = {
            'title': 'IBM',
            'return': 'enriched.url.title,enriched.url.url'
        };
        var queryObj = {
            'apikey': 'nokey',
            'start': 'now-60d',
            'end': 'now',
            'outputMode': 'json',
            'q.enriched.url.enrichedTitle.keywords.keyword.text': 'Clinton',
            'return': 'enriched.url.title,enriched.url.url'
        };
        expect(alchemyNewsAPI._getQuery(titleQuery)).to.deep.equal(queryObj);
    });

    it('builds an alchemy-news-api sentiment query', function () {
        var sentimentQuery = {
            'title': 'IBM',
            'sentiment_type': 'positive',
            'sentiment_score': '>0.5',
            'return': ['url', 'title']
        };
        var queryObj = {
            'apikey': 'nokey',
            'start': 'now-60d',
            'end': 'now',
            'outputMode': 'json',
            'q.enriched.url.enrichedTitle.docSentiment.type': 'positive',
            'q.enriched.url.enrichedTitle.docSentiment.score': '>0.5',
            'return': 'enriched.url.title,enriched.url.url'
        };
        expect(alchemyNewsAPI._getQuery(sentimentQuery).to.deep.equal(queryObj);
    });

    it('builds an alchemy-news-api query with user-defined properties for default parameters', function () {
        var fullQuery = {
            'title': 'IBM',
            'apikey': 'newkey',
            'start': 'now-20d',
            'end': 'now-10d',
            'outputMode': 'xml'
            'return': ['url', 'title']
        };
        var queryObj = {
            'apikey': 'newkey',
            'start': 'now-20d',
            'end': 'now-10d',
            'outputMode': 'xml',
            'title': 'IBM',
            'return': 'enriched.url.title,enriched.url.url'
        };
        expect(alchemyNewsAPI._getQuery(fullQuery).to.deep.equal(queryObj);
    });    
});

describe("testing options validator", function () {
    it('query objects without return parameters are invalid', function () {
        var queryObject = {
            'taxonomy_label': 'politics',
            'concept_text': 'Android'
        };
        alchemyNewsAPI._isOptionsValid(queryObject).should.equal(false);
    });

    it('query objects must have a taxonomy_label, concept_text, keyword_text or relation property', function () {
        var queryObject = {
            'taxonomy_label': 'politics',
            'concept_text': 'Android',
            'keyword_text': 'Clinton',
            'relation': {
                'subject_type': 'Company',
                'action': 'acquire',
                'object_type': 'Company'
            },
            'return': ['url', 'title']
        };
        alchemyNewsAPI._isOptionsValid(queryObject).should.equal(true);
    });

    it('query objects that do not have the necessary properties are invalid', function () {
        var queryObject = {
            'return': ['url', 'title'],
            'made_up_property': 'Shish Kebab'
        };
        alchemyNewsAPI._isOptionsValid(queryObject).should.equal(false);
    });

    it('a valid object for an entity query must have both entity_text and entity_type', function () {
        var queryObject = {
           'entity_text': 'Apple',
           'entity_type': 'company',
           'return': ['url', 'title']
        };
        alchemyNewsAPI._isOptionsValid(queryObject).should.equal(true);
    });

    it('a vlid object for a sentiment query must have both sentitment and title', function () {
        var queryObject = {
            'title': 'IBM',
            'sentiment_type': 'positive',
            'sentiment_score': '>0.5',
            'return': ['url', 'title']
        };
        alchemyNewsAPI._isOptionsValid(queryObject).should.equal(true);
    });
});

describe('#unescape', function () {
    it('converts &amp; into &', function () {
        unescape('&amp;').should.equal('&');
    });

    it("converts &#39; into '", function () {
        unescape('&#39;').should.equal("'");
    });

    it('converts &lt; into <', function () {
        unescape('&lt;').should.equal('<');
    });

    it('converts &gt; into >', function () {
        unescape('&gt;').should.equal('>');
    });
});
