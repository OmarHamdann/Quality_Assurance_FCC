'use strict';
const threadController = require('../controllers/threadController')
const replyController = require('../controllers/replyController')

module.exports = function (app) {
   app
    .route("/api/threads/:board")
      .post(threadController.postThread)
      .get(threadController.getThread)
      .delete(threadController.deleteThread)
      .put(threadController.putThread);

  app
    .route("/api/replies/:board")
      .post(replyController.postReply)
      .get(replyController.getReply)
      .delete(replyController.deleteReply)
      .put(replyController.putReply);
};
