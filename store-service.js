const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        try {
            const itemsPath = path.join(__dirname, 'data/items.json');
            const categoriesPath = path.join(__dirname, 'data/categories.json');

            fs.readFile(itemsPath, 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read items.json file");
                } else {
                    items = JSON.parse(data);
                    resolve("Success to read items.json file");
                }
            });

            fs.readFile(categoriesPath, 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read categories.json file");
                } else {
                    categories = JSON.parse(data);
                    resolve("Success to read categories.json file");
                }
            });
        } catch (e) {
            reject("Unable to read JSON files");
        }
    });
};

module.exports.getAllItems = function () {
    return new Promise((resolve, reject) => {
        if (items.length === 0) {
            reject("No items returned");
        } else {
            resolve(items.slice());
        }
    });
};

module.exports.getPublishedItems = function () {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published === true);

        if (publishedItems.length === 0) {
            reject("No published items returned");
        } else {
            resolve(publishedItems.slice());
        }
    });
};

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("No categories returned");
        } else {
            resolve(categories.slice());
        }
    });
};
