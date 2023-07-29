const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if(users[username]){
    return true
  }else{
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(users[username]==password){
    return true
  }else{
    return false
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  // console.log(users)
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const isbn=req.params.isbn
  const review=req.body.review
  if(isbn && review){
    if(books[isbn]){
      books[isbn].reviews[req.session.authorization.username]=review
      return res.status(200).json({message: "Review added"})
    }
    else{
      return res.status(404).json({message: "Book not found"})
    }
  }
});

//delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn
  if(isbn){
    if(books[isbn]){
      if(books[isbn].reviews[req.session.authorization.username]){
        delete books[isbn].reviews[req.session.authorization.username]
        return res.status(200).json({message: "Review deleted"})
      }
      else{
        return res.status(404).json({message: "Review not found"})
      }
    }
    else{
      return res.status(404).json({message: "Book not found"})
    }
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
