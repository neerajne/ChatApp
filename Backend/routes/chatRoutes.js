const express = require('express');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const { accessChat ,fetchChats , createGroupChat ,renameGroupChat , addToGroup ,removeFromGroup}= require('../controllers/chatControllers.js')

router.route('/').post(protect, accessChat)  //ROUTE FOR CREATING ONE ON ONE CHAT AND FOR ACCESSING ONE ON ONE CHAT THAT ALREADY EXISTS
router.route('/').get(protect , fetchChats) //FETCHING ALL OF THE CHATS FOR THE PARTICULAR USER THAT IS LOGGED IN
router.route('/group').post(protect ,createGroupChat) //FOR CREATING THE GROUP CHAT
router.route('/rename').put(protect ,renameGroupChat)//TO RENAME A GROUPCHAT
router.route("/groupAdd").put(protect, addToGroup);//TO ADD USER TO A GROUP
router.route('/groupRemove').put(protect, removeFromGroup);//TO REMOVE A USER FROM THE GROUP

module.exports = router ;