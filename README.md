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

- **Create Room:**

  - Event: `create-room`
  - Data Required:
    - `name`: Name of the user creating the room.
    - `password` (optional): Password for room protection (if desired).
    - `duration`: Duration for which the room should be available before automatic deletion.
    - `maxParticipants`: Maximum number of participants allowed in the room, including the creator.
  - Emit as follows:
    ```javascript
    let res = await socket.emitWithAck("create-room", payload);
    ```
    - Returns:
      - `status`: Either 'OK' or 'ERROR'.
      - `message` (if error): Error message (if applicable).

- **Join Room:**

  - Event: `join-room`
  - Data Required:
    - `roomCode`: The unique code of the room to join.
    - `name`: Name of the user joining the room.
    - `password` (if applicable): Password to access the room (if it's password-protected).
  - Emit as follows:
    ```javascript
    let res = await socket.emitWithAck("join-room", payload);
    ```
    - Returns:
      - `status`: Either 'OK' or 'ERROR'.
      - `message` (if error): Error message (if applicable).

- **Send Message:**

  - Event: `send`
  - Data Required:
    - `type`: Type of message (`'TEXT'` for text message, `'MEDIA'` for media/file).
    - `message` (optional): The text message to send (required if `type` is `'TEXT'`).
    - `key` (optional): Name by which the media/file is saved on the server (required if `type` is `'MEDIA'`).
    - `filename` (optional): Original filename of the media/file (required if `type` is `'MEDIA'`).
    - `size`: Size of the media/file.
  - Emit as follows:
    ```javascript
    let res = await socket.emitWithAck("send", payload);
    ```
    - Returns:
      - `status`: Either 'OK' or 'ERROR'.
      - `message` (if error): Error message (if applicable).

- **Get Upload URL:**
  - Event: `upload-url`
  - Data Required: None
  - Emit as follows:
    ```javascript
    let res = await socket.emitWithAck("upload-url");
    ```
    - Returns:
      - `status`: Either 'OK' or 'ERROR'.
      - `message` (if error): Error message (if applicable).

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please submit a pull request or open an issue on the GitHub repository.

## Contact

For any inquiries or support, you can reach out to the project maintainers:

- [Aditya N Rajan](aditya-nr.in)
