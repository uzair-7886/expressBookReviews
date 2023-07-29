const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // console.log(req.body)
  const {username, password} = req.body;
  if (username && password) {
    if (users[username]) {
      return res.status(400).json({message: "User already exists"});
    }
    users[username] = password;
    return res.status(200).json({message: "User created"});
  }
  else{
    return res.status(400).json({message: "username and password required"});
  }
  // return res.status(400).json({message: "Invalid username or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "main route"});
  return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn
  if(books[isbn]){
    return res.status(200).json(books[isbn])
  }
  else{
    return res.status(404).json({message: "Book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const author=req.params.author
  let book_list=[]
  for(let i in books){
    if(books[i].author==author){
      book_list.push(books[i])
    }
  }
  if(book_list.length>0){
    return res.status(200).json(book_list)
  }
  else{
    return res.status(404).json({message: "Book not found"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const title=req.params.title
  let book_list=[]
  for(let i in books){
    if(books[i].title==title){
      book_list.push(books[i])
    }
  }
  if(book_list.length>0){
    return res.status(200).json(book_list)
  }
  else{
    return res.status(404).json({message: "Book not found"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn=req.params.isbn
  if(books[isbn]){
    if(books[isbn].reviews){
      
      return res.status(200).json(books[isbn].reviews)
    }
    else{
      return res.status(404).json({message: "No reviews yet"})
    }
  }
});

module.exports.general = public_users;
