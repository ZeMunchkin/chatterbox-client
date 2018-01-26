// YOUR CODE HERE:

// http://parse.sfs.hackreactor.com/chatterbox/classes/messages

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message', data);
//   }
// });

var app = {
  
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  
  err: undefined,

  init: function() {
    
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      // headers: { 'Access-Control-Allow-Origin': '*'},//'Access-Control-Allow-Origin': 'http://parse.sfs.hackreactor.com',
      //   // 'Access-Control-Allow-Credentials': true},
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
        app.err = data;
      }
    });
  },
  
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      // data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: fetch', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch', data);
      }
    });
    
  },
  
};


var Message = function(username, text, roomname) {
  this.username = username;
  this.text = text;
  this.roomname = roomname;
};

