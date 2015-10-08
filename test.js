var alchemyNews = require('./index');

alchemyNewsAPI = new alchemyNews("6b82d2add35676336df34d81534a180264418d45", {});

// alchemyNewsAPI.getNewsByTaxonomy({'title': 'My Life'}, function(){});

alchemyNewsAPI.apiKeyInfo({}, function(error, response){
   console.log(response);

});


