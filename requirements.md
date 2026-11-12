![Lexicon Logo](https://lexicongruppen.se/media/wi5hphtd/lexicon-logo.svg)

# Flight Reservation UI - Project Test

This project is based on an existing Spring Boot backend that manages flights and bookings.

Your task is to build a frontend user interface for the Flight Reservation System by consuming the provided REST API.

## Project Goal

Create a clean and usable flight booking interface where a user can:

- View all flights
- View only available flights
- Book a flight
- Search for bookings by email
- Cancel an existing booking

## Frontend Requirements

Build the UI using:

- React
- TypeScript
- React Router
- `lucide-react`
- Functional components
- React hooks

## Assignment Requirements

Your solution must include the following features.

### 1. Flights View

Create a component that fetches and displays all flights from the API.

### 2. Available Flights View

Allow the user to see only flights that are currently available for booking.

### 3. Booking Flow

Make it possible for the user to book a flight from the UI.

The booking form should collect:

- Passenger name
- Passenger email

After a successful booking, the user should receive clear feedback in the interface.

### 4. (OPTIONAL) Booking Lookup

Provide a way for the user to enter an email address and view all bookings connected to that email.

### 5.  (OPTIONAL) Cancel Booking

Allow the user to cancel a booking by using:

- Flight ID
- Passenger email

## API Endpoints

Use the backend API to power the interface.

- `GET /api/flights` - get all flights
- `GET /api/flights/available` - get available flights
- `POST /api/flights/{flightId}/book` - book a flight
- `GET /api/flights/bookings?email={email}` - get bookings by email
- `DELETE /api/flights/{flightId}/cancel?email={email}` - cancel a booking

## Getting Started

1. Run the backend application
2. Open the API documentation at `http://localhost:8080/swagger-ui.html`
3. Review the available endpoints
4. Build the frontend UI
5. Connect your components to the API

---

# 🧱 Project Setup Requirements

Required steps:

1. Create a **new Git repository** for your project.
2. Include a `README.md` in your project repository description.

---

## 🌿 Git Workflow Requirements

Your repository must demonstrate proper Git usage.

### Required Git Practices

- Use **frequent, small commits**
- Write **clear commit messages** describing:
    - what you changed
    - why you changed it
- Create at least **one separate branch**
- Merge your branch back to `main` when the feature is complete

---

## 📋 Submission

Before the deadline you should invite your teacher as a collaborator to your _private_ GitHub repository.
Make sure that the *Assignment Requirements* is fulfilled to the best of your ability.

### 🤝 One-to-One Meeting Presentation

Be prepared to present your work in roughly 10–15 minutes:

1.  **The Big Picture (1-2 mins):** Briefly explain the project.
2.  **Live Demo (5 mins):** Demonstrate the "Happy Path" (working features) and how to navigate through the UI.
3.  **Code Walkthrough (5 mins):** Highlight a piece of code you are proud of and explain *why* you built it that way.
4.  **Q&A:** Be ready to discuss potential improvements or technical challenges you faced.

> **Pro Tip:** Make the IDE and UI ready before the meeting.
