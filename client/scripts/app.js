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
  currUser: window.location.search.split("=")[1],
  filterRooms: false,
  currRoom: 'All Messages',
  allRooms: [],
  

  init: function() {
    this.fetch();
    
    setInterval(this.fetch.bind(this), 1000);
    
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

  // _generateChatline: function(message) {
  //   var tweet = `<div class='tweet' data-messageid="${message.objectId}" data-roomname="${message.roomname}"  data-username="${_.escape(message.username)}">
  //     <div class='username' data-username="${_.escape(message.username)}">${_.escape(message.username)}</div>
  //     <div class='text'>${_.escape(message.text)}</div>
  //     <div class='time' data-time="${message.createdAt}">${message.createdAt}</div>
  //     </div>`;
  //   $('#chats').append(tweet);
  // },
  
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: 'order=-createdAt&limit=100',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: fetch', data);
        app.clearMessages();  
        data.results.forEach(function (message) {
          app.renderMessage(message);
        });
        FriendsList.forEach(function(friend) {
          // app.handleUsernameClick(friend);
          app._renderFriendsList(friend);
        });
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch', data);
      }
    });
    
  },
  
  renderMessage: function (message) {
    var messageRoom = _.escape(message.roomname);
    console.log(messageRoom, app.filterRooms, app.currRoom);
    
    app.addRoom(messageRoom);
    message.username = message.username || "(Anonymous Mouse)";
    message.roomname = message.roomname || "All Messages";
    var messageclasses = message.username === app.currUser ? "tweet ownmessage" : "tweet";
    
    // if(message.username === app.currUser && ) {
    //   var tweet = `<div class='tweet' data-messageid="${message.objectId}" data-roomname="${message.roomname}"  data-username="${_.escape(message.username)}">
    //     <span class='text'>${_.escape(message.text)}</span>
    //     </div>`;
    //   $('#chats').append(tweet);
    var totalMessage = `<div class='${messageclasses}' data-messageid="${message.objectId}" data-roomname="${message.roomname}"  data-username="${_.escape(message.username)}">`;
    var roomSpan = `<span class='room' data-roomname="${_.escape(message.roomname)}">${_.escape(message.roomname)}</span>`;
    var userSpan = `<span class='username' data-username="${_.escape(message.username)}">@${_.escape(message.username)}: </span>`;
    var messageSpan =`<div class='text'>${_.escape(message.text)}</div>`;
    var messageClose = `</div>`;
      
    if (app.filterRooms && app.currRoom === messageRoom) {
      //no room info
      if (message.username === app.currUser) {
        userSpan = '';
        roomSpan = '';
      }
      var tweet = totalMessage + userSpan + messageSpan + messageClose;
      $('#chats').append(tweet);
      
    } else if (!app.filterRooms || app.currRoom === 'All Messages') {
      if (message.username === app.currUser) {
        userSpan = ''; 
        roomSpan = '';
      }
      //all info
      var tweet = totalMessage + roomSpan + userSpan + messageSpan + messageClose;
      $('#chats').append(tweet);
    }
  },
  
  clearMessages: function () {
    $('#chats').children().remove();
  },
  
  renderRoom: function (roomName) {
    app.filterRooms = true;
    app.currRoom = roomName;
    if (app.currRoom !== 'All Messages') {
      $('.currentRoom').text(app.currRoom);
    } else {
      $('.currentRoom').text('');
    }
    app.fetch();
  },
  
  handleUsernameClick: function (tgtUserName) {
    
    // console.log('got clicked!', tgtUserName);
    console.log(tgtUserName);
    // $('.tweet').each(function(index, element) {
    //   if ($(this).data('username') === tgtUserName) {
    //     $(this).toggleClass('friend');
    //   }
    // });
    app._renderFriendsList(tgtUserName);
    
    if (FriendsList.includes(tgtUserName)) {
      for (var i = 0; i < FriendsList.length; i++) {
        if (FriendsList[i] === tgtUserName) {
          FriendsList.splice(i, 1);
        }
      }
    } else {
      FriendsList.push(tgtUserName);
    }
    //console.log('myFriends', FriendsList);
  },

  _renderFriendsList: function(tgtUserName) {
    $('.tweet').each(function(index, element) {
      if ($(this).data('username') === tgtUserName) {
        $(this).toggleClass('friend');
      }
    });    
  },
  
  handleSubmit: function() {
    var msg = new Message(app.currUser, _.escape($('#message').val()), app.currRoom);
    app.send(msg);
    $('#message').val('');    
  },
  
  addRoom: function (roomName) {
    if (!app.allRooms.includes(roomName)) {
      app.allRooms.push(roomName);
      $('#roomSelect').append(`<option id="${roomName}">${roomName}</option>`);
    }
  },
  
};





var Message = function(username, text, roomname) {
  this.username = _.escape(username);
  this.text = _.escape(text);
  this.roomname = _.escape(roomname) || 'lobby';
};

var FriendsList = [];







$(document).ready( function () {
  
  
  $('#textBox').append(`<input id="message" type="text" autofocus placeholder="Enter message...">
  <button id="send" class="submit">GO!!!</button>`);

  $('#currUser').append(' ', app.currUser);
  
  $('#roomContainer').append(`
    <select id="roomSelect">
      <option id="createRoom">Create New Room</option>
      <option id="default" Selected>All Messages</option>
    </select>
    <button id=roomSubmit>GO!</button>
    <input id="roomInputText" class="roomInput" placeholder="Enter Room Name">
    <button id="roomInputButton" class="roomInput">GO!</button>`);
  
  $(document).on('click', '#roomSubmit', function (evt) {
    console.log('handled');
    if ($('#roomSelect').val() === $('#createRoom').text()) {
      $('.roomInput').toggle('display');
    }
    
    var selectedRoom = _.escape($('#roomSelect').val());
    if(selectedRoom !== 'Create New Room') {
      app.renderRoom(selectedRoom);
    }
  });
  
  $(document).on('click', '#roomInputButton', function (evt) {
    var newRoom = $('#roomInputText').val();
    app.addRoom(newRoom);
    app.renderRoom(newRoom);
    $('.roomInput').toggle('display');
    $('#roomInputText').val('');
  });

  app.init();

  $(document).on('click', '.username', function(evt) {
    // console.log('got clicked!');
    var tgtUserName = $(this).closest('.username').data('username');
    app.handleUsernameClick(_.escape(tgtUserName));
  });
  
  // $(document).submit('#send', function(evt) {
  //   console.log('submit');
  // });
  
  $(document).on('click', '#send', function(evt) {
    app.handleSubmit();  
  });
  
  $(document).on('keypress', '#message', function (evt) {
    var key = evt.which;
    if (key === 13) {
      console.log('sent!');
      app.handleSubmit();
    }
  });
});
