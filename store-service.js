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

  module.exports.addItem = function(itemData) {
    return new Promise((resolve, reject) => {
        itemData.published = itemData.published === undefined ? false : true;

        itemData.id = items.length + 1;

        items.push(itemData);

        resolve(itemData);
    });
  };

module.exports.getItemsByCategory = function(category) {
  return new Promise(function(resolve, reject) {
      const filteredItems = items.filter(item => item.category === parseInt(category));
      if (filteredItems.length > 0) {
          resolve(filteredItems);
      } else {
          reject("No results returned");
      }
  });
};

module.exports.getItemsByMinDate = function(minDateStr) {
  return new Promise(function(resolve, reject) {
      const filteredItems = items.filter(item => new Date(item.postDate) >= new Date(minDateStr));
      if (filteredItems.length > 0) {
          resolve(filteredItems);
      } else {
          reject("No results returned");
      }
  });
};

module.exports.getItemById = function(id) {
  return new Promise(function(resolve, reject) {
      const foundItem = items.find(item => item.id === parseInt(id));
      if (foundItem) {
          resolve(foundItem);
      } else {
          reject("No result returned");
      }
  });
};
