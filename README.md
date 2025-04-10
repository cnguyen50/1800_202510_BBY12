
# Project Name

## Overview

Managing medical information can be challenging, particularly for the elderly and their caregivers. HealthHub, a client-side JavaScript web application, helps manage medication details, doctor contact information, appointments, and emergency contacts. The goal is to make the task of tracking important health information simple through a single app with a clean and intuitive user interface. 

Developed for the COMP1800 course, applying User-Centred Design practices, agile project management processes, and Firebase backend services.

---

## Features

- A dashboard with quick access to emergency contacts, doctor appointments, medication details and medical service cards, allowing care receivers to quickly find important health information when needed.
- Responsive design for desktop and mobile.
- Individual pages to display and add/edit medical information.

---

## Technologies Used

- **Frontend**: HTML, CSS, Bootstrap 5, JavaScript
- **Backend**: Firebase (Hosting, Authentication)
- **Database**: Firestore
- **API**: Firebase SDK APIs

---

## Usage

1. Visit the deployed app: `https://bby12-a52bd.web.app/`.
2. Click the HealthHub logo (top-left) to log in
3. Use these test credentials: 
     - Email: `demo01@gmail.com`
     - Password: `demo01`
4. Explore these features:
     - View medical information dashboard
     - Manage emergency contacts
     - Add/edit appointments
     - Add/edit doctors
     - Add/edit medications
     - Upload medical documents

### Important Notes
- This is a **demo account** with sample data
- Do not enter real personal health information

---

## Project Structure

```
1800_202510_BBY12/
├── fonts/
├── images/
├── pages/
├── scripts/
│   ├── main.js
│   ├── authentication.js
│   ├── firebaseAPI_Team12.js
├── styles/
├── text/
├── firebase.json
│── index.html
├── README.md
└── .gitignore
```

---

## Contributors
- **Calvin Nguyen** - BCIT CST Student that loves food!!!!!!!
- **Leen Seydoun** - BCIT Student that loves cats! Has one cat at home
- **Veronica Sheng** - BCIT CST Student that loves traveling!!!! 

---

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for front-end design
- [Firebase Documentation](https://firebase.google.com/docs) for backend implementation
- Our COMP1800 instructor for project feedback and support

---

## Limitations and Future Work
### Limitations

- Currently, the app only supports viewing existing emergency contacts for the test account (no add/edit functionality).
- Appointment management lacks reminders and calendar integration.

### Future Work

- Enhanced Contacts: add/edit/delete emergency contacts.
- Push notifications for upcoming appointments and medications.
- Interactive calendar view with drag-and-drop scheduling.
- PDF export functionality for sharing with providers. 

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
