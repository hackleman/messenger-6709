const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const Users = require("./Users");

const Conversation = db.define("conversation", {});

// example API call to handle old schema

Conversation.findConversation = async function (user1Id, user2Id) {
  await Conversation.findAll({
    include: [{
      model: Users,
      required: true,
      through: {
        where: {
          [Op.or]: {
            userId: user1Id,
            userId: user2Id,
          },
        }
      }
    }]
  }).then(data => {
    if (
      (data.users.length) === 2 &&
      (data.users[0].id === user1Id && data.users[1].id === user2Id) ||
      (data.users[1].id === user1Id && data.users[0].id === user2Id)) {

        return data
    } else {
      return null
    }
  }).catch(e => {
    console.log(e)
  })
};

module.exports = Conversation;
