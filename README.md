Item & Purchase Management System

📌 Project Overview

The Item & Purchase Management System is a web-based application designed to manage item categories, inventory stock, purchase orders, and item availability efficiently.

The application helps users organize inventory, track available stock, and maintain purchase records through a simple interface.

✨ Features

- Item Type Management: Create and manage item categories.
- Item Management: Add items with their type, purchase date, stock quantity, and status.
- Purchase Management: Create purchase orders and add items with specified quantities.
- Stock Tracking: Monitor current stock and item availability.
- Search and Filtering: Search items and filter them by status.
- Purchase History: View previously created purchase records.

🛠️ Technologies Used

- Backend: Node.js, Express.js
- Database: MySQL
- Database Driver: mysql2
- Environment Configuration: dotenv
- Frontend: Web interface (HTML, CSS, and JavaScript, if applicable)

📂 Project Structure

item-purchase-management-system/
├── docs/
├── public/
├── routes/
├── scripts/
├── db.js
├── .env.example
├── package.json
├── package-lock.json
└── README.md

⚙️ Installation and Setup

Prerequisites

- Node.js (version 18 or later)
- MySQL Server
- npm

Step 1: Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd item-purchase-management-system

Replace "YOUR_GITHUB_REPOSITORY_URL" with your actual repository URL.

Step 2: Install Dependencies

npm install

Step 3: Configure Environment Variables

Create a ".env" file in the project root using ".env.example" as a template.

Configure the following values:

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=item_purchase_db

Replace "your_mysql_password" with your actual MySQL password.

Step 4: Start MySQL Server

Ensure that the MySQL service is running on your computer.

Step 5: Set Up the Database

npm run db:setup

Step 6: Start the Application

npm start

Open the application in your browser:

http://localhost:3000

🚀 How to Use

1. Open the Item Types page and create an item category.
2. Navigate to Items and create an item with its category and stock quantity.
3. Open Create Purchase and select items and quantities.
4. Submit the purchase order.
5. View stock availability and purchase records.

🔒 Security

- Store database credentials in the ".env" file.
- Do not commit ".env" or other files containing secrets to GitHub.
- Use ".env.example" to document the required environment variables without exposing credentials.

👨‍💻 Author

Adarsha J P

📄 License

This project was developed as a full-stack development assignment.
