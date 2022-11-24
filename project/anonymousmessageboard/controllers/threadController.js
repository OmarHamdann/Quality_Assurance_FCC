const mongoose = require("mongoose");
const Message = require("../models/message");

const threadRepository = require('../repositories/threadRepository');

exports.postThread = async (req, res) => {
  try
  {
    const { board } = req.params;
    const { text, delete_password } = req.body;

    await threadRepository.createThread(board, text, delete_password);

    return res.redirect(`/b/${board}`);
  }
  catch (err)
  {
    return console.log(err);
  }
};

exports.getThread = async (req, res) => {
  try
  {
    const { board } = req.params;
    const search = board ? { board: board } : {};
    
    const threadArray = await threadRepository.findThread(search);

    return res.json(threadArray);
  }
  catch (err)
  {
    return console.log(err);
  }
};

exports.deleteThread = async (req, res) => {
  try
  {
    const { thread_id, delete_password } = req.body
    
    const result = await threadRepository.deleteThread(thread_id, delete_password);

    return res.send(result);
  } 
  catch (err)
  {
    return console.log(err);
  }
};

exports.putThread = async (req, res) => {
  try
  {
    const { thread_id } = req.body;
    
    await threadRepository.reportThread(thread_id);
    
    return res.send("reported");
  }
  catch (err)
  {
    return console.log(err);
  }
};