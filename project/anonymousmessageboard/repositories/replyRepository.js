const ObjectId = require('mongodb').ObjectID;
const Message = require("../models/message");

exports.createReply = async (thread_id, delete_password, text) =>
{
    const newReply = 
    {
        _id: new ObjectId(),
        text,
        created_on: new Date(),
        delete_password,
        reported: false
    };
  
    await Message.findByIdAndUpdate(thread_id,
        {
            $set: 
            { 
                bumped_on: newReply.created_on
            },
            $inc: 
            {
                replycount: 1
            },
            $push:
            {
                replies:
                {
                    $each: [newReply],
                    $sort: {created_on: -1}
                }
            }
        }
    ).lean();
}

exports.findReply = async (thread_id) =>
{
    const replys = await Message.findById(thread_id,
        {
            delete_password: 0,
            reported: 0,
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            replies: 
            { 
                delete_password: 0,
                reported: 0
            }
        }
    ).lean();

    return replys;
}

exports.deleteReply = async (thread_id, reply_id, delete_password) =>
{

    Message.findById(
      thread_id,
      (err, threadToDelete) => {
        let replay=threadToDelete.replies.find(reply => reply.delete_password == delete_password);
        console.log(replay);
        console.log(thread_id);
        console.log(reply_id);

        if (err || !threadToDelete)
          return 'thread not found'

        if (replay.delete_password != delete_password)
          return 'incorrect password'
        
        threadToDelete.findByIdAndRemove(reply_id, (err, success) => {
        if (!err && success)
        return 'success'
        })
      }
    )

}

exports.reportReply = async (thread_id, reply_id) =>
{
    await Message.findOneAndUpdate(
        {
            _id: thread_id,
            'replies._id': ObjectId(reply_id)
        },
        {
            $set:
            {
                'replies.$.reported': true
            }
        }
    ).lean();
}