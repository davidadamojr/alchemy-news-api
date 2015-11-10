var should = require('chai').should();
var AlchemyNewsAPI = require('../index');
var alchemyNewsAPI = new AlchemyNewsAPI("nokey", {});

describe("testing query builder", function () {
    it('builds an alchemy-news-api taxonomy query object', function () {
        
    });

    it('builds an alchemy-news-api concept query object', function () {

    });

    it('builds an alchemy-news-api keyword query object', function () {

    });

    it('builds an alchemy-news-api entity query object', function () {

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

    it('query objects that have not have the necessary properties are invalid', function () {
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
