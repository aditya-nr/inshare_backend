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

## Prerequisites

Before running the project, ensure you have the following software installed:

1. **Git:** Required to clone the repository.
2. **Node.js:** Required to run the application.
3. **MongoDB:** (Optional) If you want to use a local database.

### Installing Node.js

Ensure you have Node.js installed by visiting [nodejs.org](https://nodejs.org/) and following the installation instructions for your operating system.

### Installing Yarn

After installing Node.js, you can install Yarn by running the following command in your terminal:

```bash
npm install -g yarn
```

## Installation

1. Clone this repository:

```bash
git clone https://github.com/aditya-nr/inshare_backend.git
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

- `KEY` put the value

5. Install dependencies:

```bash
yarn install
```

6. Start the server:

```bash
yarn start
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please submit a pull request or open an issue on the GitHub repository.

## Contact

For any inquiries or support, you can reach out to the project maintainers:

- [Aditya N Rajan](aditya-nr.in)
