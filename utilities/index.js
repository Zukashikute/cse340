const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const accountMessage = require("../models/message-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
   try {
      let data = await invModel.getClassifications();
      let list = "<ul>";
      list += '<li><a href="/" title="Home page">Home</a></li>';
      data.rows.forEach((row) => {
         list += "<li>";
         list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
         list += "</li>";
      });
      list += "</ul>";
      return list;
   } catch (error) {
      // Handle the error here
      console.error("Error in getNav:", error);
      // You can choose to throw the error or return a default value or an empty string
      throw error;
   }
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
   let grid
   if (data.length > 0) {
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => {
         grid += '<li>'
         grid += '<div class="vehicleListImage">'
         grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
         grid += '</div>'
         grid += '<hr />'
         grid += '<div class="namePrice">'
         grid += '<h2>'
         grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
         grid += '</h2>'
         grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
         grid += '</div>'
         grid += '</li>'
      })
      grid += '</ul>'
   } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
   }
   return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildDetailView = async (data) => {
   let detail
   if (data.length > 0) {
      detail = '<div class="vehicleContainer">'
      data.forEach(vehicle => {
         detail += `
                   <div>
                     <img src="${vehicle.inv_image}" alt="${vehicle.inv_model}" />
                   </div>
                   <div>
                     <p> ${vehicle.inv_make} ${vehicle.inv_model} Details </p>
                     <p> Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)} </p>
                     <p> Description: <span> ${vehicle.inv_description} </span> </p>
                     <p> Color: <span> ${vehicle.inv_color} </span> </p>
                     <p> Miles: <span> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} </span> </p>
                   </div>
                   `
      })
      detail += '</div>'
   } else {
      detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
   }
   return detail
}

/* **************************************
* Build classification options field - add inventory form.
* ************************************ */
Util.buildOptions = async (optionSelected) => {
   let data = await invModel.getClassifications()
   let options = `
                  <select name="classification_id" id="classificationList" required>
                     <option selected disabled hidden>
                        Choose a classification
                     </option>`
   data.rows.forEach(row => {
      options += `<option value="${row.classification_id}" ${row.classification_id === Number(optionSelected) ? 'selected' : ''}> ${row.classification_name} </option>`
   })
   options += `</select>`
   return options
}

/* **************************************
* Build Inbox messages table
* ************************************ */
Util.buildInboxTable = async function (data) {

   let table
   if (data.length > 0) {
      table = '<table id="inboxTable">'
      table += '<tr>'
      table += '<th> Received </th>'
      table += '<th> Subject </th>'
      table += '<th> From </th>'
      table += '<th> Read </th>'
      table += '</tr>'
      data.forEach(row => {
         if (row.message_archived === false) {
            table += '<tr>'
            const time = row.message_created
            table += `<td> ${time.toLocaleString('en-US', { timeZone: 'UTC' })} </td>`
            table += `<td><a href="/message/messageView/${row.message_id}">${row.message_subject}</a></td>`
            table += `<td> ${row.account_firstname} ${row.account_lastname}</td>`
            table += `<td> ${row.message_read} </td>`
            table += '</tr>'
         }
      })
      table += '</table>'

   } else {
      table = '<h3 id="noMessages">You do not have messages </h3>'
   }
   return table
}

/* **************************************
* Build Unread Messages number
* ************************************ */
Util.buildUnreadMessages = async function (data) {
   let number
   let count = 0
   data.forEach(row => {
      if (row.message_read === false) {
         count++
         number = `<li> You have ${count} unread messages. </li>`
      }
   })

   return number;
}

/* **************************************
* Build Archived Messages number
* ************************************ */
Util.buildArchivedMessagesNumber = async function (data) {
   let archived
   let count = 0
   data.forEach(row => {
      if (row.message_archived === true) {
         count++
         archived = `<li><a href="/message/archived/">View ${count} Archived Message(s)</a></li>`
      }
   })
   return archived;
}

/* **************************************
* Build Archived messages table
* ************************************ */
Util.buildArchivedTable = async function (data) {

   let table
   if (data.length > 0) {
      table = `<table id="inboxTable">
               <thead>
               <tr>
               <th> Received </th>
               <th> Subject </th>
               <th> From </th>
               <th> Read </th>
               </tr>
               </thead>
               <tbody>`
      data.forEach(row => {
         if (row.message_archived === true) {
            table += `<tr>`
            const time = row.message_created
            table += `<td> ${time.toLocaleString('en-US', { timeZone: 'UTC' })} </td>`
            table += `<td><a href="/message/messageView/${row.message_id}">${row.message_subject}</a></td>`
            table += `<td> ${row.account_firstname} ${row.account_lastname}</td>`
            table += `<td> ${row.message_read} </td>`
            table += '</tr>'
         }
      })
      table += `</tbody>
               </table>`

   } else {
      table = '<h3 id="noMessages">You do not have messages </h3>'
   }
   return table
}

/* **************************************
* Build account name options
* ************************************ */
Util.buildAccountOptions = async function (id) {
   let data = await accountMessage.getAllAccountData()
   let options
   options = '<select name="message_to" id="message_to" required>'
   options += '<option value="" selected disabled hidden> Select a recipient </option>'
   data.rows.forEach(row => {
      if (id != row.account_id) {
         options += `<option value="${row.account_id}"> ${row.account_firstname} ${row.account_lastname} </option>`
      }
   })
   options += '</select>'
   return options
}

/* **************************************
* Build message view 
* ************************************ */
Util.buildMessageView = async function (data) {
   let messageView
   if (data.length > 0) {
      messageView = '<div id="messageview">'
      data.forEach(row => {
         messageView += `<p><strong>Subject: </strong><span>${row.message_subject}</span></p>`
         messageView += `<p><strong>From: </strong><span>${row.account_firstname} ${row.account_lastname}</span></p>`
         messageView += `<p><strong>Message: </strong></p>`
         messageView += `<p id="messageB">${row.message_body}</p>`
      })
      messageView += '</div>'
   }
   return messageView
}

/* **************************************
* Build reply input form
* ************************************ */
Util.replyForm = async function (data) {
   let reply
   if (data.length > 0) {
      data.forEach(row => {
         let substr = 'RE:'
         reply = `<div class="inputField">
                     <label for="messageTo">To</label>
                     <input type="text" name="to" id="messageTo" value="${row.account_firstname} ${row.account_lastname}" readonly>
                     <input type="hidden" name="message_to" id="message_to" value="${row.message_from}">
                  </div>
                  <div class="inputField">
                     <label for="message_subject">
                     Subject
                     </label>`
         if (row.message_subject.indexOf(substr) >= 0) {
            reply += `<input type="text" name="message_subject" id="message_subject" value="${row.message_subject}" readonly>`
         } else {
            reply += `<input type="text" name="message_subject" id="message_subject" value="${substr} ${row.message_subject}" readonly>`
         }
         reply += '</div>'
      })
   }
   return reply
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
   if (req.cookies.jwt) {
      jwt.verify(
         req.cookies.jwt,
         process.env.ACCESS_TOKEN_SECRET,
         function (err, accountData) {
            if (err) {
               req.flash("Please log in")
               res.clearCookie("jwt")
               return res.redirect("/account/login")
            }
            res.locals.accountData = accountData
            res.locals.loggedin = 1
            next()
         })
   } else {
      next()
   }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
   if (res.locals.loggedin) {
      next()
   } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
   }
}

Util.checkPermission = (req, res, next) => {
   const type = res.locals.accountData.account_type
   if (type == "Client") {
      return res.redirect("/account/")
   } else {
      next()
   }
}

module.exports = Util