const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  let testThreadId = "";
  let testThreadId2 = "";
  let testReplyId = "";
  suite("API Routing for Thread Test", () => {
    test("Creating two new threads", done => {
      chai
        .request(server)
        .post("/api/threads/test")
        .send({
          board: "test",
          text: "test text",
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });

      chai
        .request(server)
        .post("/api/threads/test")
        .send({
          board: "test",
          text: "test text",
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
      done();
    });

    test("Viewing the ten most recent threads with three replies each", done => {
      chai
        .request(server)
        .get("/api/threads/test")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isBelow(res.body.length, 11);
          assert.isBelow(res.body[0].replies.length, 4);
          assert.isArray(res.body);
          testThreadId = res.body[0]._id;
          testThreadId2 = res.body[1]._id;
          done();
        });
    });

    test("Deleting a thread with the incorrect password", done => {
      chai
        .request(server)
        .delete("/api/threads/test")
        .send({
          delete_password: "invalid password",
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "incorrect password");
          done();
        });
    });

    test("Deleting a thread with the correct password", done => {
      chai
        .request(server)
        .delete("/api/threads/test")
        .send({
          delete_password: "valid password",
          thread_id: testThreadId2
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          done();
        });
    });

    test("Reporting a thread", done => {
      chai
        .request(server)
        .put("/api/threads/test")
        .send({
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
          done();
        });
    });
  });

  suite("API Routing for Reply Test", () => {
    test("Creating a new reply", done => {
      chai
        .request(server)
        .post("/api/replies/test")
        .send({
          thread_id: testThreadId,
          text: "test text",
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);

          done();
        });
    });

    test("Viewing a single thread with all replies", done => {
      chai
        .request(server)
        .get("/api/replies/test")
        .query({
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          testReplyId = res.body.replies[0]._id;

          done();
        });
    });

    test("Reporting a reply", done => {
      chai
        .request(server)
        .put("/api/replies/test")
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");

          done();
        });
    });

    test("Deleting a reply with the incorrect password", done => {
      chai
        .request(server)
        .delete("/api/replies/test")
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: "invalid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "incorrect password");

          done();
        });
    });

    test("Deleting a reply with the correct password", done => {
      chai
        .request(server)
        .delete("/api/replies/test")
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");

          done();
        });
    });
  });
});