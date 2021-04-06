const router = require('express').Router();
const Chat = require('../models/chat');
const multer = require('multer');
const upload = multer();

router.route('/add').post(upload.none(),(req,res)=>{
    const {description,senderId,receiverId} = req.body;
    var newChat = new Chat({
        description,
        senderId,
        receiverId
    });

    newChat.save().then((chat)=>{
        res.json({state:true,message:"Message send.",details:chat});
    }).catch((err)=>{
        res.json({state:false,message:"Unable to send message! Try again shortly.",err:err});
    });
})

router.route('/').get((req,res)=>{
    Chat.find().then(({chats})=>{
        res.json({state:true,details:chats});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

router.route('/update/:id').put(upload.none(),(req,res)=>{
    var chatId = req.params.id;
    const {description} = req.body;
    var updateChat = {
        description,
        senderId,
        receiverId
    };
    Chat.findByIdAndUpdate(chatId,updateChat).then((update)=>{
        res.json({state:true,message:"Message edited.",details:update});
    }).catch((err)=>{
        res.json({state:false,message:"Unable to edit message!",err:err});
    });
})

router.route('/delete/:id').delete((req,res)=>{
    var chatId = req.params.id;
    Chat.findByIdAndDelete(chatId).then((chat)=>{
        res.json({state:true,message:"Message deleted.",details:chat});
    }).catch((err)=>{
        res.json({state:false,message:"Unable to delete message!",err:err});
    });
})

router.route('/:id').get((req,res)=>{
    var chatId = req.params.id;
    Chat.findById(chatId).then((chat)=>{
        res.json({state:true,details:chat});
    }).catch((err)=>{
        res.json({state:false,err:err});
    });
})

module.exports = router;