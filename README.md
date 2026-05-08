# ProConnect

A LinkedIn-style full stack web app where users can create profiles, connect with others, and share posts.

Built mainly to practice real-world full-stack development with proper backend structure and React frontend.

---

## Live Demo
Visit ProConnect : https://proconnect-frontend-2o1l.onrender.com

---

## What this project does

* User authentication (signup/login/logout)
* Create and edit profile
* Send and manage connections
* Create posts, like and comment
* Basic notifications
* Image uploads using Cloudinary

Not a complete LinkedIn clone, but covers most core features.

---

## Tech stack used

**Frontend**

* React
* Context API (Auth + User state)
* Tailwind CSS

**Backend**

* Node.js
* Express

**Database**

* MongoDB

**Other**

* JWT authentication
* Cloudinary (for images)

---

## Project structure

```bash
backend/
  config/
  controllers/
  middlewares/
  models/
  routes/
  public/
  index.js

frontend/
  public/
  src/
    assets/
    components/
      ConnectionButton.jsx
      EditProfile.jsx
      Nav.jsx
      Post.jsx
    context/
      AuthContext.jsx
      UserContext.jsx
    pages/
      Home.jsx
      Login.jsx
      Network.jsx
      Notification.jsx
      Profile.jsx
      Signup.jsx
    App.jsx
    main.jsx
```

---

## How to run locally

Clone the repo:

```bash
git clone https://github.com/yourusername/proconnect.git
cd proconnect
```

Install dependencies:

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the project:

```bash
# backend
npm run dev

# frontend
npm run dev
```

---

## Current status

Still improving the project. Core features are working, but UI and some edge cases can be improved. Planning to add more features and clean up the code.

---

## Notes

* Built this as a hands-on full-stack project
* Focused more on backend structure (controllers, routes, middleware)
* Frontend uses Context API for state management

---

## Future improvements

* Real-time messaging
* Better notifications system
* UI/UX improvements
* Deployment

---

## Author

Built by me as part of learning and improving full-stack development.
