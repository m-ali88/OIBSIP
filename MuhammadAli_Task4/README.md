# SecureGate — Login Authentication System (OIBSIP Task 4)

A client-side authentication demonstration built with HTML5, CSS3, and vanilla JavaScript.

## Approach

This project uses **Approach A: Front-end only**.

- `localStorage` stores registered user records.
- Passwords are converted to a SHA-256 hexadecimal digest using the browser Web Crypto API before storage.
- `sessionStorage` stores the active login session.
- `dashboard.html` checks the session and redirects unauthenticated visitors to the login page.
- Logout removes the session and redirects to login.

## Features

- Registration page with username, email, and password
- Minimum 8-character password requirement
- At least 1 number required in a password
- Duplicate username/email detection
- Login using username or email
- Generic invalid-credential error that does not reveal which field failed
- Protected dashboard
- Automatic redirect to login without a valid session
- Logout
- Basic empty-field and format validation
- SHA-256 password hashing (no plain-text password storage)
- Responsive design
- No external framework or build step

## Files

```text
MuhammadAli_Task4/
├── index.html
├── register.html
├── dashboard.html
├── auth.js
├── login.js
├── register.js
├── dashboard.js
├── style.css
└── README.md
```

## How to Run

Open `index.html` in a modern browser.

For the best experience, use VS Code with the Live Server extension and open the project folder.

## Test Flow

1. Open `register.html`.
2. Register with a username, email, and password such as `Password123`.
3. You should be redirected to `index.html`.
4. Log in using the username or email.
5. You should reach the protected dashboard.
6. Try opening `dashboard.html` after logging out — it should redirect to login.
7. Try registering the same username/email — a duplicate-account error should appear.
8. Try a password shorter than 8 characters or without a number — validation should fail.

## Important Security Note

This is an **educational client-side authentication demo**, not production authentication.

SHA-256 is included to satisfy the task's client-side hashing requirement, but a real authentication system should hash passwords on a trusted server using a password-specific algorithm such as Argon2 or bcrypt, use secure HTTPS cookies, and keep credentials out of browser-controlled storage. Client-side `localStorage` authentication can be modified by the user and must not be treated as a secure access-control boundary.

## References

- MDN — Web Storage API / `localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
- MDN — `sessionStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
- MDN — Web Crypto API `SubtleCrypto.digest()`: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
- MDN — HTTP cookies and sessions: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
- MDN — Form validation: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation

## OIBSIP Submission

Repository: Add your GitHub repository URL here.

Live Demo: Add your GitHub Pages URL here.

Task folder: `MuhammadAli_Task4`
