# Smart Campus Companion

A complete web application for campus life management built with HTML5, CSS3, Vanilla JavaScript, PHP, and MySQL.

## ⚠️ IMPORTANT: PHP Web Server Required

**CRITICAL**: This application requires a PHP web server to run. **DO NOT** open HTML files directly in your browser (file:// protocol). PHP code will not execute and you'll see raw PHP code instead of the webpage.

### If you see PHP code when submitting forms:
- **You are opening files directly** instead of through a web server
- **Follow the setup instructions below** to run on a proper web server

## Features

- **User Authentication**: Secure registration and login with password hashing
- **Dashboard**: Welcome page with quick links and summaries
- **Timetable Management**: Add, edit, delete weekly schedule
- **Assignment Tracker**: Track assignments with due dates and completion status
- **Announcements**: View college announcements
- **Lost & Found Board**: Post and search lost/found items
- **Anonymous Doubt Forum**: Ask questions anonymously
- **Profile Management**: Update personal information and change password

## Project Structure

```
smart-campus/
│── index.html                 # Landing page
│── login.html                 # Login page
│── register.html              # Registration page
│── dashboard.html             # Main dashboard
│── timetable.html             # Timetable management
│── assignments.html           # Assignment tracker
│── announcements.html         # Announcements display
│── lostfound.html             # Lost & Found board
│── forum.html                 # Doubt forum
│── profile.html               # Profile management
│
│── css/
│   └── style.css              # Main stylesheet
│
│── js/
│   ├── main.js                # Shared utilities
│   ├── dashboard.js           # Dashboard functionality
│   ├── timetable.js           # Timetable management
│   ├── assignments.js         # Assignment tracker
│   ├── announcements.js       # Announcements display
│   ├── lostfound.js           # Lost & Found functionality
│   ├── forum.js               # Forum functionality
│   └── profile.js             # Profile management
│
│── php/
│   ├── config.php             # Database configuration
│   ├── db.php                 # Database utilities
│   ├── auth.php               # Authentication functions
│   ├── login.php              # Login handler
│   ├── register.php           # Registration handler
│   ├── logout.php             # Logout handler
│   ├── timetable.php          # Timetable API
│   ├── assignments.php        # Assignments API
│   ├── announcements.php      # Announcements API
│   ├── lostfound.php          # Lost & Found API
│   ├── forum.php              # Forum API
│   └── profile.php            # Profile API
│
│── sql/
│   └── database.sql           # Database schema and sample data
│
└── README.md                  # This file
```

## Setup Instructions

### Prerequisites
- XAMPP/WAMP or any PHP development server
- MySQL database
- Web browser

### Installation Steps

1. **Download/Clone the Project**
   ```
   Place the smart-campus folder in your web server's root directory
   (e.g., htdocs for XAMPP)
   ```

2. **Database Setup**
   - Open phpMyAdmin (usually at http://localhost/phpmyadmin)
   - Create a new database named `smart_campus`
   - Import the `sql/database.sql` file

3. **Configuration**
   - Open `php/config.php`
   - Update database credentials if needed:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'root'); // Your MySQL username
     define('DB_PASS', '');     // Your MySQL password
     define('DB_NAME', 'smart_campus');
     ```

4. **Start the Server**
   - Start Apache and MySQL in XAMPP control panel
   - Open your browser and go to: `http://localhost/smart-campus/`

### Sample Login Credentials

After importing the database, you can login with:
- **Email**: john@example.com
- **Password**: password123

## Usage

1. **Registration**: Create a new account on the register page
2. **Login**: Use your credentials to access the dashboard
3. **Dashboard**: View summaries and quick links to all features
4. **Timetable**: Add your weekly schedule
5. **Assignments**: Track your assignments and deadlines
6. **Announcements**: Read college announcements
7. **Lost & Found**: Post or search for lost/found items
8. **Forum**: Ask questions anonymously
9. **Profile**: Update your information and change password

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP 7+ (Procedural + Basic OOP)
- **Database**: MySQL
- **Security**: Password hashing, Prepared statements, Input sanitization

## Security Features

- Password hashing using `password_hash()`
- Prepared statements to prevent SQL injection
- Input sanitization and validation
- Session-based authentication
- CSRF protection (basic implementation)

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

This is an academic project for MCA 1st semester. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes only.

## Support

For issues or questions, please check the code comments or contact the developer.
