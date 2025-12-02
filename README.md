E-Commerce Backend (MERN Stack)

This is a MERN stack-based e-commerce backend that provides secure user authentication, product management, and order processing with additional features:

Nodemailer for email verification

Twilio for mobile OTP verification

Redis for caching and session management

🚀 Features

✅ User authentication (JWT-based login & registration)
✅ Product management (CRUD operations)
✅ Cart and order management
✅ Payment gateway integration (e.g., Stripe, Razorpay)
✅ Admin dashboard API for managing users & orders
✅ Email verification using Nodemailer
✅ Mobile OTP verification via Twilio
✅ Secure password hashing with Bcrypt.js
✅ Redis for session management and caching

🏗️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT (JSON Web Token)

Email Service: Nodemailer with SMTP

SMS Service: Twilio

Cache & Storage: Redis

Image Upload: Cloudinary/S3

Payment Processing: Stripe/Razorpay

🔧 Installation & Setup

Prerequisites

Node.js and npm installed

MongoDB running locally or using a cloud database like MongoDB Atlas

Redis installed and running

Steps to Set Up

Clone the repository:

git clone https://github.com/yourusername/ecommerce-backend.git
cd ecommerce-backend

Install dependencies:

npm install

Create a .env file and configure environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key

Run the server:

# Run Redis server (if not running already)
redis-server

# Start Backend
npm run dev

The server will start at http://localhost:5000/

🔥 API Endpoints

Authentication (/api/auth)

POST /api/auth/email/send-otp - Send OTP to email

POST /api/auth/email/register - Register user via email

POST /api/auth/email-password/login - Login using email & password

POST /api/auth/email-forgot/send-otp - Send OTP for password reset

POST /api/auth/email-forgot/verify-otp - Verify OTP for password reset

POST /api/auth/sms/send-otp - Send OTP to mobile

POST /api/auth/sms/login - Login using mobile OTP

GET /api/auth/allusers - Get all users (Admin only)

Products (/api/products)

GET /api/products - Fetch all products

POST /api/products - Create a new product (Admin only)

PUT /api/products/:id - Update product details (Admin only)

DELETE /api/products/:id - Delete a product (Admin only)

Orders (/api/orders)

POST /api/orders - Place a new order

GET /api/orders/:userId - Get user orders

PUT /api/orders/:id - Update order status (Admin only)

🚀 Deployment

You can deploy the backend on:

Heroku

Vercel

Render

AWS EC2/VPS

MongoDB Atlas (for cloud storage)

Redis Cloud (or local server)

📌 License

This project is open-source and available under the MIT License.

🔥 Developed by [Your Name] | Happy Coding! 😊

