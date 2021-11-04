const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

Conversation.findConversationNewSchema = async function (user1Id, user2Id) {
  await Conversation.findAll({
    include: [{
      model: Users,
      as: 'users',
      required: true,
      through: {
        where: {
          [Op.or]: {
            usersId: user1Id,
            usersId: user2Id,
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
