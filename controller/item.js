const User = require("../model/user.js");
const Item = require("../model/item.js");

function updateItems(username, newItems) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      { username: username },
      { items: newItems },
      { new: true },
      (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      }
    );
  });
}

function addItem(itemData){
  return new Promise((resolve,reject) =>{ 
    Item.create(itemData)
    .then(e => resolve(e))
    .catch(e => reject(e))
  })
}

function deleteItem(username, id) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username: username }, (err) => {
      if (err) reject(err);
    });
    let newItems = user.items.filter((e) => {
      return e._id != id;
    });
    User.findOneAndUpdate(
      { username: username },
      { items: newItems },
      { new: true }
    ).populate('items').exec((err, doc) => {
      if (err) reject(err);
      else resolve(doc);
    });
  });
}

module.exports = {
  updateItems,
  deleteItem,
  addItem
};
