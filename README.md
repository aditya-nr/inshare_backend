# inshare_backend

## Overview

This is the backend for the inshare.online app, which is used for sharing files. The backend facilitates the creation of rooms where users can share files and text messages. It utilizes socket.io for real-time communication.

## Features

- Creation of rooms with unique room codes
- Joining existing rooms
- Sending text messages and files within rooms
- Automatic deletion of rooms after a specified duration
- Optional password protection for rooms
- Limiting the maximum number of participants in a room

## Installation

1. Clone this repository:

```bash
git clone https://github.com/your_username/inshare_backend.git
```

2. Navigate to the project directory:

```bash
cd inshare_backend
```

3. Create .env

```bash
cp .env.sample .env
```

4. Change env variable

- `DB_URL` put the mongodb url
- `DB_NAME` database name
- `PORT` port number
- `CORS_ORIGIN` cors origin array
- `PASSWORD_SALT` random string used for salt
- `AWS_S3_KEY_ID` aws s3 user with put and get permission
- `AWS_S3_KEY` s3 user password
- `AWS_S3_REGION` aws s3 region
- `AWS_S3_BUCKET` s3 bucket name

5. Install dependencies:

```bash
yarn install
```

6. Start the server:

```bash
yarn start
```

## Usage

Once the server is running, you can interact with the backend using Socket.IO events. Here's how to use each event and the data required for each:

- **Creating New Room:**

  - Event: `create-room`
  - Payload :
    - `name`: Name of the user creating the room.
    - `password` (optional): Password for room protection (if desired).
    - `timeOut`: Duration for which the room should be available before automatic deletion.
    - `maxCandidate`: Maximum number of participants allowed in the room, including the creator.
  - Returns:

    - `status`: Either 'OK' or 'ERROR'.
    - `roomId` (if OK): unique room ID
    - `message` (if error): Error message (if applicable).
    - `type` (if error): it can have follwing error type
      - `VALIDATION_ERROR` : if payload field has error

  - Example:

  ```javascript
  let payload = {
    name: "Aditya",
    password: "secure-password",
    timeOut: 5, //5 minutes
    maxCandidate: 2,
  };
  let res = await socket.emitWithAck("create-room", payload);
  if (res.status == "OK") {
    // res.roomId
  } else {
    // res.type , res.message
  }
  ```

- **Join Existing Room:**

  - Event: `join-room`
  - Payload :
    - `roomId`: The unique code of the room to join.
    - `name`: Name of the user joining the room.
    - `password` (if applicable): Password to access the room (if it's password-protected).
  - Returns:

    - `status`: Either 'OK' or 'ERROR'
    - `timeOut` (if OK) : time at which the room will be deleted.
    - `message` (if error): Error message (if applicable).
    - `type` (if error): it can have follwing error type
      - `VALIDATION_ERROR` : if payload field has error
      - `INVALID_ROOMID` : if room is invalid
      - `PASSWORD_REQUIRED` : if room is password protected and payload does't contain password field
      - `INVALID_PASSWORD` : if password is incorrect
      - `POLICY_VIOLATE` : if room policy does't meet by the event

  - Example:

  ```javascript
  let payload = {
    name: "Aditya",
    roomId: "1234",
  };
  let res = await socket.emitWithAck("join-room", payload);
  if (res.status == "OK") {
    // res.timeOut
  } else {
    // res.type , res.message
  }
  ```

- **Sending Message:**

  - Event: `message`
  - Payload Required:

    - `type`: Type of message (`'TEXT'` for text message, `'MEDIA'` for media/file).
    - `message` (optional): The text message to send (required if `type` is `'TEXT'`).
    - `s3_key` (optional): `key` returned by `get-upload-url` event. (required if `type` is `'MEDIA'`).
    - `filename` (optional): Filename of the media/file (required if `type` is `'MEDIA'`).
    - `size`: (Bytes) Size of the media/file.

  - Returns:
    - `status`: Either 'OK' or 'ERROR'
    - `message` (if error): Error message (if applicable).
    - `type` (if error): it can have follwing error type
      - `VALIDATION_ERROR` : if payload field has error
      - `POLICY_VIOLATE` : if room policy does't meet by the event
  - Example:

  ```javascript
  let payload = {
    type: "TEXT",
    message: "Hello World!",
  };
  let res = await socket.emitWithAck("message", payload);
  if (res.status == "OK") {
    // message sent successfully
  } else {
    // res.type , res.message
  }
  ```

- **Get Upload URL:**

  - Event: `get-upload-url`
  - Data Required:
    - `type`: type of media/file. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
    - `size` : size of the media/file
  - Returns:

    - `status`: Either 'OK' or 'ERROR'
    - `url` (if OK) : url for uploading the file.
    - `key` (if OK) : name by which file is saved on server.
    - `message` (if error): Error message (if applicable).
    - `type` (if error): it can have follwing error type
      - `VALIDATION_ERROR` : if payload field has error
      - `POLICY_VIOLATE` : if room policy does't meet by the event

  - Example:

  ```javascript
  let payload = {
    type: "image/jpeg", //
    size: 235235,
  };
  let res = await socket.emitWithAck("get-upload-url", payload);
  if (res.status == "OK") {
    // res.key -> send this key with event message (type:'MEDIA')
    // res.url -> upload file to this url
  } else {
    // res.type , res.message
  }
  ```

- **Receiving Message:**

  - Event: `message`
  - Data :

    - `_id` : unique id of message
    - `type`: Type of message (`'TEXT'` for text message, `'MEDIA'` for media/file).
    - `message` (optional): The text message to send (required if `type` is `'TEXT'`).
    - `s3_key` (optional): Using this key you can download the media.
    - `filename` (optional): Filename of the media/file (required if `type` is `'MEDIA'`).
    - `size`: (Bytes) Size of the media/file.

  - Example:

  ```javascript
  socket.on("message", (data) => {
    console.log(data);
    // display data
  });
  ```

- **Listening for Notification:**

  - Event: `notification`
  - Data :

    - `message` : message .

  - Example:

  ```javascript
  socket.on("notification", (message) => {
    console.log(message);
  });
  ```

- **Listening for Room TimeOut:**

  - Event: `timeout`

  - Example:

  ```javascript
  socket.on("timeout", () => {
    // exit form the room
  });
  ```

## Summary

| Event Name     | Description                               | Payload                                                                                                                                                                                                                                                | Response                                                                                                                              |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| create-room    | Create a new room with unique room codes  | - `name`: Name of the user creating the room.<br>- `password` (optional): Password for room protection.<br>- `timeOut`: Duration for room availability.<br>- `maxCandidate`: Maximum participants allowed.                                             | - `status`: 'OK' or 'ERROR'<br>- `roomId` (if OK): Unique room ID<br>- `message` (if ERROR): Error message                            |
| join-room      | Join an existing room                     | - `roomId`: Unique code of the room to join.<br>- `name`: Name of the user joining the room.<br>- `password` (if applicable): Password to access the room.                                                                                             | - `status`: 'OK' or 'ERROR'<br>- `timeOut` (if OK): Room deletion time<br>- `message` (if ERROR): Error message                       |
| message        | Send a text message or file within a room | - `type`: Type of message (`'TEXT'` for text, `'MEDIA'` for file).<br>- `message` (optional): Text message to send.<br>- `s3_key` (optional): Key for media/file.<br>- `filename` (optional): Filename of media/file.<br>- `size`: Size of media/file. | - `status`: 'OK' or 'ERROR'<br>- `message` (if ERROR): Error message                                                                  |
| get-upload-url | Retrieve URL for uploading a file         | - `type`: Type of media/file.<br>- `size`: Size of media/file.                                                                                                                                                                                         | - `status`: 'OK' or 'ERROR'<br>- `url` (if OK): URL for file upload<br>- `key` (if OK): Key <br>- `message` (if ERROR): Error message |
| notification   | Receive notifications within a room       | - None                                                                                                                                                                                                                                                 | - `message` : Notification message.                                                                                                   |
| timeout        | Notify clients when a room times out      | - None                                                                                                                                                                                                                                                 | - None                                                                                                                                |

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please submit a pull request or open an issue on the GitHub repository.

## Contact

For any inquiries or support, you can reach out to the project maintainers:

- [Aditya N Rajan](aditya-nr.in)
