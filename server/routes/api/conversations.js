const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const activeUsers = require("../../activeUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      if (activeUsers.hasOwnProperty(req.user.id)) {
        delete activeUsers[req.user.id]
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview

      // set unread count
      const latest = convoJSON.messages[convoJSON.messages.length - 1]
      let unreadCount = 0;

      for (let i = convoJSON.messages.length-1; i >= 0; i--) {
        if (convoJSON.messages[i].read === false && convoJSON.messages[i].senderId !== userId) {
          unreadCount += 1
        } else {
          break;
        }
      }

      // set last read message id
      let lastMessageRead = -1;
      const userMessages = convoJSON.messages.filter(message => message.senderId === userId)

      if (userMessages.length > 0) {
        const lastSentMessage = userMessages[userMessages.length - 1];
        if (lastSentMessage.read) {
          lastMessageRead = userMessages[userMessages.length - 1].id
        }
      } 

      convoJSON.latestMessageText = latest.text;
      convoJSON.lastMessageRead = lastMessageRead;
      convoJSON.unreadCount = unreadCount;

      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { recipient, user, conversationId } = req.body;

    if (!req.body) {
      return res.sendStatus(401)
    }

    if (!req.body.conversationId) {
      return res.sendStatus(204);
    }

    const convo = await Conversation.findOne(
      {where: conversationId}
    )
    if (!convo) {
      return res.sendStatus(404)
    } 

    // handle user outside of conversation updating conversation
    if (convo.user1Id !== user.id && convo.user2Id !== user.id) {
      return res.sendStatus(403);
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

    return res.sendStatus(204)
  } catch (error) {
    next(error);
  }
})
module.exports = router;
