const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'znxKIV45jqXY', {
    host: 'ep-dawn-art-a5q7zccz-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});
const Item = sequelize.define('Item', {
  body: {
      type: Sequelize.TEXT
  },
  title: {
      type: Sequelize.STRING
  },
  postDate: {
      type: Sequelize.DATE
  },
  featureImage: {
      type: Sequelize.STRING
  },
  published: {
      type: Sequelize.BOOLEAN
  },
  price: {
      type: Sequelize.DOUBLE
  }
});

const Category = sequelize.define('Category', {
  category: {
      type: Sequelize.STRING
  }
});

Item.belongsTo(Category, { foreignKey: 'category' });

// Export the models
module.exports = {
    Item,
    Category
};


module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        resolve();
    })
    .catch(err => {
        console.error('Unable to sync the database:', err);
        reject('Unable to sync the database');
  });
});
};

module.exports.getAllItems = function () {
  return new Promise((resolve, reject) => {
    Item.findAll()
    .then(items => {
        if (items.length === 0) {
            reject("No items returned");
        } else {
            resolve(items); 
        }
    })
    .catch(err => {
        console.error('Error fetching items:', err);
        reject("No results returned");
    });
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
    .then(categories => {
        if (categories.length === 0) {
            reject("No categories returned");
        } else {
            resolve(categories);
        }
    })
    .catch(err => {
        console.error('Error fetching categories:', err);
        reject("No results returned");
    });
  });
};

module.exports.addItem = function(itemData) {
  return new Promise((resolve, reject) => {
    itemData.published = (itemData.published) ? true : false;

    // Ensure that any blank values ("") for properties are set to null
    for (let key in itemData) {
        if (itemData[key] === "") {
            itemData[key] = null;
        }
    }

    // Assign a value for postDate
    itemData.postDate = new Date();

    // Create the item in the database
    Item.create(itemData)
        .then(item => {
            resolve(item);
        })
        .catch(err => {
            console.error('Error adding item:', err);
            reject("Unable to create item");
        });
  });
};

module.exports.getItemsByCategory = function(category) {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: {
          category: category
      }
  })
  .then(items => {
      if (items.length === 0) {
          reject("No items returned");
      } else {
          resolve(items);
      }
  })
  .catch(err => {
      console.error('Error fetching items by category:', err);
      reject("No results returned");
  });
  });
};

module.exports.getItemsByMinDate = function(minDateStr) {
  return new Promise((resolve, reject) => {
    const { Op } = Sequelize;
    const { gte } = Op;

    Item.findAll({
        where: {
            postDate: {
                [gte]: new Date(minDateStr)
            }
        }
    })
    .then(items => {
        if (items.length === 0) {
            reject("No items returned");
        } else {
            resolve(items);
        }
    })
    .catch(err => {
        console.error('Error fetching items by min date:', err);
        reject("No results returned");
    });
  });
};
module.exports.deletePostById = function(id) {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: id
      }
    })
    .then(affectedRows => {
      if (affectedRows > 0) {
        resolve("Post deleted successfully");
      } else {
        reject("Post not found");
      }
    })
    .catch(err => {
      console.error('Error deleting post:', err);
      reject("Unable to delete post");
    });
  });
};

module.exports.getItemById = function(id) {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: {
          id: id
      }
  })
  .then(items => {
      if (items.length === 0) {
          reject("No item found");
      } else {
          resolve(items[0]);
      }
  })
  .catch(err => {
      console.error('Error fetching item by ID:', err);
      reject("No results returned");
  });
  });
};

module.exports.getPublishedItems = function () {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: {
          published: true
      }
  })
  .then(items => {
      if (items.length === 0) {
          reject("No published items returned");
      } else {
          resolve(items);
      }
  })
  .catch(err => {
      console.error('Error fetching published items:', err);
      reject("No results returned");
  });
  });
};

module.exports.getPublishedItemsByCategory = function(category) {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: {
          published: true,
          category: category
      }
  })
  .then(items => {
      if (items.length === 0) {
          reject("No published items returned for this category");
      } else {
          resolve(items);
      }
  })
  .catch(err => {
      console.error('Error fetching published items by category:', err);
      reject("No results returned");
  });
  });
};

module.exports.addCategory = function(categoryData) {
  return new Promise((resolve, reject) => {
    // Ensure that any blank values ("") for properties are set to null
    for (let key in categoryData) {
      if (categoryData[key] === "") {
        categoryData[key] = null;
      }
    }

    // Create the category in the database
    Category.create(categoryData)
      .then(category => {
        resolve(category);
      })
      .catch(err => {
        console.error('Error adding category:', err);
        reject("Unable to create category");
      });
  });
};

module.exports.deleteCategoryById = function(id) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: id
      }
    })
    .then(affectedRows => {
      if (affectedRows > 0) {
        resolve("Category deleted successfully");
      } else {
        reject("Category not found");
      }
    })
    .catch(err => {
      console.error('Error deleting category:', err);
      reject("Unable to delete category");
    });
  });
};


//const { Post } = require('./server'); // Assuming you have a Post model defined

async function deletePostById(id) {
  try {
    // Attempt to destroy the post with the given id
    const deletedPost = await Post.destroy({ where: { id } });
    
    // Check if any post was deleted
    if (deletedPost === 1) {
      // Resolve the promise if the post was successfully deleted
      return Promise.resolve('Post deleted successfully');
    } else {
      // Reject the promise if no post was deleted
      return Promise.reject('Post not found or could not be deleted');
    }
  } catch (error) {
    // Reject the promise if an error occurred during the deletion process
    return Promise.reject(error);
  }
}

module.exports = { deletePostById };
