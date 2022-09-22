// This file's full path is /public/client.js
$(document).ready(function () {
  /* Global io */
  let socket = io();
  // change the text of the h1 tag to 'Connected!' when the client is connected to the server
  socket.on('user count', function (data) {
    console.log(data);
  });

  // Form submittion with new message in field with id 'm'
  $('form').submit(function () {
    let messageToSend = $('#m').val();
    // Send message to server here?
    $('#m').val('');
    return false; // Prevent form submit from refreshing page
  });
});
