const Message = require("../models/message");

exports.createThread = async (board, text, delete_password) =>
{
    const created = new Date();

    await Message.create({
        board,
        text,
        delete_password,
        bumped_on: created,
        created_on: created
    });
}

exports.findThread = async (board) =>
{
    const threadFound = await Message.find(board,
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
    ).sort({bumped_on: -1}).limit(10).lean();

    return threadFound;
}

exports.deleteThread = async (thread_id, delete_password) =>
{
    const deleteThread = await Message.findOneAndDelete(
        {
            _id: thread_id,
            delete_password: delete_password
        }
    ).lean();

    return deleteThread ? "success" : "incorrect password";
}

exports.reportThread = async (thread_id) =>
{
    await Message.findOneAndUpdate(
        {
            _id: thread_id
        }, 
        {
            $set:
            {
                reported: true
            }
        }
    ).lean();
}