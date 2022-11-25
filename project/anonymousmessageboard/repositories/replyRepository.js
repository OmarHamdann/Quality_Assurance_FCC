const ObjectId = require("mongodb").ObjectID;
const Message = require("../models/message");

exports.createReply = async (thread_id, delete_password, text) => {
  const newReply = {
    _id: new ObjectId(),
    text,
    created_on: new Date(),
    delete_password,
    reported: false,
  };

  await Message.findByIdAndUpdate(thread_id, {
    $set: {
      bumped_on: newReply.created_on,
    },
    $inc: {
      replycount: 1,
    },
    $push: {
      replies: {
        $each: [newReply],
        $sort: { created_on: -1 },
      },
    },
  }).lean();
};

exports.findReply = async (thread_id) => {
  const replys = await Message.findById(thread_id, {
    delete_password: 0,
    reported: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    replies: {
      delete_password: 0,
      reported: 0,
    },
  }).lean();

  return replys;
};

exports.deleteReply = async (thread_id, reply_id, delete_password) => {
//   let replies = [];
//   let replycount = 0;
//   let result = "success";

//    await Message.findById(thread_id, (err, threadToDelete) => {
//     if (err || !threadToDelete) {
//       console.log(err);
//       result= "thread not found";
//       return;
//     }

//     let replay = threadToDelete.replies.find((reply) => reply._id == reply_id);

//     if (replay.delete_password != delete_password) {
//       result= "incorrect password";
//       return;
//     }
//     replies = threadToDelete.replies.filter((reply) => reply._id != reply_id);
//     replycount = replies.length;

//     Message.findByIdAndUpdate(
//       thread_id,
//       {
//         $set: {
//           replies: replies,
//           replycount: replycount,
//         },
//       },
//       (err, data) => {
//         if (err) {
//           console.log(err);
//           result= "could not delete";
//             return;
//         }
//         result= "success";
//         return;
//       }
//     );
//   }).clone();
//   return result;
const deleteReply = await Message.findOneAndUpdate(
    {
        _id: ObjectId(thread_id),
        'replies._id': ObjectId(reply_id),
        'replies.delete_password': delete_password
    },
    {
        $set:
        {
            "replies.$.text": '[deleted]'
        }
    }
).lean();

return deleteReply ? "success" : "incorrect password";

};

exports.reportReply = async (thread_id, reply_id) => {
  await Message.findOneAndUpdate(
    {
      _id: thread_id,
      "replies._id": ObjectId(reply_id),
    },
    {
      $set: {
        "replies.$.reported": true,
      },
    }
  ).lean();
};
