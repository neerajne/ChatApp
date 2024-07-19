const express = require('express');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const { accessChat ,fetchChats , createGroupChat ,renameGroupChat , addToGroup ,removeGroup}= require('../controllers/chatControllers.js')

router.route('/').post(protect, accessChat)  //ROUTE FOR CREATIN ONE ON ONE CHAT AND FOR ACCESSING ONE ON ONE CHAT
router.route('/').get(protect , fetchChats) //FETCHING ALL OF THE CHATS FOR THE PARTICULAR USER THAT IS LOGGED IN
router.route('/group').post(protect ,createGroupChat) //FOR CREATING THE GROUP CHAT
router.route('/rename').put(protect ,renameGroupChat)//TO RENAME A GROUPCHAT
router.route("/groupAdd").put(protect, addToGroup);
router.route('/groupRemove').put(protect, removeGroup);

module.exports = router ;