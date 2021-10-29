const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender, read } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, read, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      read,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.sendStatus(401)
    }

    const { recipient, user, conversationId } = req.body;

    if (!req.body.conversationId) {
      return res.json({ user, recipient });
    }

    await Message.update(
      {
        read: true
      },
      { 
        where: {        
          [Op.and]: {
            senderId: recipient.id,
            conversationId,
          },
        },
      },
    )

    const messages = await Message.findAll({
      where: {
        conversationId
      },
      order: [["id", "ASC"]],
    }).then(result => {
        const data = result.map(message => message.dataValues)

        return res.status(201).json({ messages: data, recipient, user })
      })
  } catch (error) {
    next(error);
  }
})
module.exports = router;
