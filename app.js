require("dotenv").config()
const express = require("express")

const path = require("path")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mysql = require("mysql")

const app = express() //creates the express app

const PORT = process.env.PORT || 8000 //setting up a port to listen to

//setting up database connection
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
})

connection.connect(function (error) {
  if (!!error) console.log(error)
  else console.log("Database contacts had been connected successfully")
})

//set view files
app.set("views", path.join(__dirname, "views"))
//setting up the view engine
app.set("view engine", "ejs")

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

//setting up the root route
app.get("/", (req, res) => {
  let sql = "SELECT * FROM contacts_table"
  let query = connection.query(sql, (err, rows) => {
    if (err) throw err
    res.render("user_index", {
      title: "CONTACTS REGISTRATION",
      contacts_table: rows,
    })
  })
})

//route of form to handle creation of users
app.get("/add", (req, res) => {
  res.render("contact_add", {
    title: "CONTACTS REGISTRATION",
  })
})

//handle form submission
app.post("/save", (req, res) => {
  let data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
  }
  let sql = "INSERT INTO contacts_table SET ?" //insert data from form to database
  let query = connection.query(sql, data, (err, results) => {
    if (err) throw err
    res.redirect("/")
  })
})

// get edit contact form
app.get("/edit/:id", (req, res) => {
  const id = req.params.id
  let sql = `Select * from contacts_table where id = ${id}`
  let query = connection.query(sql, (err, result) => {
    if (err) throw err
    res.render("user_edit", {
      title: "CONTACTS REGISTRATION",
      contact_table: result[0],
    })
  })
})

//update the contact form
app.post("/update", (req, res) => {
  let data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
  }
  const id = req.body.id
  let sql =
    "UPDATE contacts_table SET first_name='" +
    req.body.first_name +
    "', last_name='" +
    req.body.last_name +
    "', phone_number='" +
    req.body.phone_number +
    "', email='" +
    req.body.email +
    "' where id= " +
    id //connection to updating the database
  let query = connection.query(sql, (err, results) => {
    if (err) throw err
    res.redirect("/")
  })
})

//handle deleting of contacts
app.get("/delete/:id", (req, res) => {
  const id = req.params.id
  let sql = `DELETE from contacts_table where id = ${id}`
  let query = connection.query(sql, (err, result) => {
    if (err) throw err
    res.redirect("/")
  })
})

//starting and listening for server requests
app.listen(PORT, () => {
  console.log(`-------Server is up and running on port ${PORT} ------`)
})
