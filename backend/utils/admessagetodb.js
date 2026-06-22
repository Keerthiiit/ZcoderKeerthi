const Message = require('../models/messagesmodel');

const addmessages= async (id, handle, text) => {


  const newMessage = {
    id: id,
    user: handle,
    text: text
  }

  await Message.create(newMessage);

  
};

module.exports = addmessages