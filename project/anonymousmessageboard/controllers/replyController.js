const replyRepository = require('../repositories/replyRepository');

exports.postReply = async (req, res) =>
{
  try
  {
    const { board } = req.params;
    const { thread_id, delete_password, text } = req.body;

    await replyRepository.createReply(thread_id, delete_password, text);
    
    return res.redirect(`/b/${board}/${thread_id}`);
  }
  catch (err)
  {
    return console.log(err);
  }
};

exports.getReply = async (req, res) =>
{
  try
  {
     const { thread_id } = req.query;
    
     const replys = await replyRepository.findReply(thread_id);
    
    return res.json(replys);
  }
  catch (err)
  {
    return console.log(err);
  }
};

exports.deleteReply = async (req, res) => {
  try
  {
    const { thread_id, reply_id, delete_password } = req.body;
    
    const result = await replyRepository.deleteReply(thread_id, reply_id, delete_password);
    
    return res.send(result);
  }
  catch (err)
  {
    return console.log(err);
  }
};

exports.putReply = async (req, res) => {
  try
  {
    const { thread_id, reply_id } = req.body;

    await replyRepository.reportReply(thread_id, reply_id);

    res.send('reported');
  }
  catch (err)
  {
    return console.log(err);
  }
};