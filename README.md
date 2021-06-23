# Chat Module

## Overview
Chat module is a web application to chat with other people in realtime.
This project uses an API with Web Sockets. It is located [here](https://github.com/pavel-piatetskii/chat-module-ws-api)


## Video demo
https://user-images.githubusercontent.com/69732643/122708644-77bbb780-d211-11eb-80d7-6899c00aa997.mp4


## Main Features

### Login screen
!["chat-module - login screen"](https://github.com/pavel-piatetskii/chat-module/blob/master/docs/login.png)

On entering the page, a ueser sees the login input field. Maximum length of login is 8 characters (to be changed in later updates).

#### Login exists
!["chat-module - login exists"](https://github.com/pavel-piatetskii/chat-module/blob/master/docs/login-exists.png)

If a name they enter already exists, the message about it will be shown.


### Application
!["chat-module - application window"](https://github.com/pavel-piatetskii/chat-module/blob/master/docs/application.png)

The application window is split into 3 sections: Users, Chat feed and Rooms. 

**"Users in this room"** section displays only those users who are currently present in the same room with you (Main room on the screenshot). If a user switches to another room, they disappear from this section and appear in the same section of another room. 

**Chat feed** section (labeled "Main room" on the screenshot) displays all messages for a room you are currently in (even those which were sent before you logged in) and allows you to write a message as well. Label on the top shows a name of the room you are currently in.

**Rooms** section shows a list of room available. Also, if a new message appears in the room you are not currently in, you see a flashing yellow dot on this room icon. List of the room can be easily changed on the API-side.


### Exchange with the API
!["chat-module - application window"](https://github.com/pavel-piatetskii/chat-module/blob/master/docs/api-exchange.png)

All updates for the application states comes from API in form of JSON. Even if a user sends a message, it firstly goes to the server and only after a response from it received, the message appears in the feed. This is done to avoid desyncronization with the server.


## Dependencies
 - express 4.17.1;
 - node-sass 5.0.0;
 - react 17.0.1.
