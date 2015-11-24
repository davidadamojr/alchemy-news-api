var alchemyNews = require('./index');

alchemyNewsAPI = new alchemyNews("6b82d2add35676336df34d81534a180264418d45", {});

var taxonomy_query = {
   'taxonomy_label': 'politics',
   'return': ['url', 'title']
};


alchemyNewsAPI.getNewsByTaxonomy(taxonomy_query, function (error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});

var concept_query = {
   'concept_text': 'Android',
   'return': ['url','title']
};


alchemyNewsAPI.getNewsByConcept(concept_query, function (error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});

var keyword_query = {
    'keyword_text': 'Clinton',
    'return': ['url', 'title']
};

alchemyNewsAPI.getNewsByKeyword(keyword_query, function (error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});


var entity_query = {
    'entity_text': 'Apple',
    'entity_type': 'company',
    'return': ['url', 'title']
};

alchemyNewsAPI.getNewsByEntity(entity_query, function (error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});

/*
var relation_query = {
    'relation':{
        'subject_type': 'Company',
        'action': 'acquire',
        'object_type': 'Company'
     },
    'return': ['url', 'title']
};

alchemyNewsAPI.getNewsByRelation(relation_query, function (error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});*/


var sentiment_query = {
    'title': 'IBM',
    'sentiment_type': 'positive',
    'sentiment_score': '>0.5',
    'return': ['url', 'title']
};

alchemyNewsAPI.getNewsBySentiment(sentiment_query, function (error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log(response);
    }
});

