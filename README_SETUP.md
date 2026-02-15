# Project Setup Guide

This project consists of two parts:
1.  **Client**: An Angular application.
2.  **Server**: A Node.js/Express application.

## Prerequisites
-   Node.js installed.
-   MongoDB installed and running (or a cloud MongoDB connection string).

## 1. Setting up the Server

The server runs on port 3000 and connects to MongoDB.

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory based on `.env.example`. You can copy it:
    -   **Windows (Command Prompt):** `copy .env.example .env`
    -   **PowerShell:** `Copy-Item .env.example .env`
    -   **Linux/Mac:** `cp .env.example .env`
4.  Open the `.env` file and update the `DATABASE_URL` with your MongoDB connection string.
    Example: `DATABASE_URL="mongodb://localhost:27017/ecommerce"`
5.  Start the server:
    ```bash
    npm run dev
    ```
    (This runs `nodemon app.mjs`. If you don't have nodemon installed globally, this script should work if it's a dev dependency, which it is).

## 2. Setting up the Client

The client runs on port 4200 (default for Angular) and talks to the server on port 3000.

1.  Open a **new terminal** (keep the server running).
2.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the Angular development server:
    ```bash
    npm start
    ```
    or
    ```bash
    ng serve
    ```
5.  Open your browser and navigate to `http://localhost:4200`.

## Troubleshooting

-   **Database Connection Error:** Ensure your MongoDB is running and the `DATABASE_URL` in `server/.env` is correct.
-   **API Error:** Ensure the server is running on port 3000. The client expects the API at `http://localhost:3000/api`.
