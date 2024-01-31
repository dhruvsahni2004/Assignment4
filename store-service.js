const fs = require('fs');

var items = [];
var categories = [];

module.exports.initialize = function()
{
    return new Promise(function(resolve, reject)
    {
        try
        {
            fs.readFile('./data/items.json', function(err, data)
            {
                if(err) throw err;
                items = JSON.parse(data);
            });
            fs.readFile('./data/categories.json', function(err,data)
            {
                if(err) throw err;
                categories = JSON.parse(data);                
            });
        } catch(e) {
            reject("unable to read json file");
        }
        resolve("success to read json file");
    });
};


module.exports.getAllItems = function () {
    return new Promise(function (resolve, reject) {
      if (items.length === 0) {
        reject("No items returned");
      } else {
        resolve(items.slice());
      }
    });
  };
  

  module.exports.getPublishedItems = function () {
    return new Promise(function (resolve, reject) {
      const publishedItems = items.filter(item => item.published === true);
  
      if (publishedItems.length === 0) {
        reject("No published items returned");
      } else {
        resolve(publishedItems.slice()); 
      }
    });
  };
  
  module.exports.getCategories = function () {
    return new Promise(function (resolve, reject) {
      if (categories.length === 0) {
        reject("No categories returned");
      } else {
        resolve(categories.slice());
      }
    });
  };

