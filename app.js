//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
require('./db/mongoose');
const Item = require("./modules/item");
const List = require("./modules/lists");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

const item1 = new Item({
  name: "Wellcome to yout todolist!"
})

const item2 = new Item({
  name: "Hit the + button to add a new item."
})

const item3 = new Item({
  name: "<= Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];


app.get("/", async function (req, res) {

  // const day = date.getDate();
  const item = await Item.find({});
  try {
    if (item.length === 0) {
      await Item.insertMany(defaultItems, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("success!!");
        }
      });
      res.redirect('/');
    } else {
      res.render("list", { listTitle: "Today", newListItems: item });
    }
  } catch (error) {
    console.log("Error!!!")
  }
});

app.post("/", async (req, res) => {
const listName = req.body.list;

  const item = new Item({
    name: req.body.newItem
  })

  try {
    if(listName === "Today"){
      await item.save();
      res.status(201).redirect('/');
    } else {
      const listItems = await List.findOne({name: listName});
      listItems.items.push(item);
      await listItems.save();
      res.redirect(`/${listName}`);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/delete', async (req, res) => {
  const checkItemId = req.body.check;
  const listName = req.body.listName;
  if(listName === "Today") {
    await Item.findByIdAndRemove({ _id: checkItemId }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Succesfully deleted checked item!");
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkItemId}}}, err => {
      if(!err) {
        res.redirect(`/${listName}`);
      }
    });
    
  }
})

app.get("/:customListName", async (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  const existList = await List.findOne({ name: customListName });

  if (!existList) {
    const list = new List({
      name: customListName,
      items: defaultItems
    });
    await list.save();
    res.redirect(`/${customListName}`);
  } else {
    res.render('list', { listTitle: existList.name, newListItems: existList.items });
    console.log(existList);
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("Server started on port", port);
});
