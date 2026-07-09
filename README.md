# Customer Lead CRM System

A production-quality CRM system built with **Spring Boot 3** and **Angular 17**.

## Tech Stack
- **Backend**: Java 21, Spring Boot 3.5.x, MySQL 8, Maven, MapStruct, Lombok.
- **Frontend**: Angular 17, Bootstrap 5, Angular Material, Chart.js.

## Modules
1. **Authentication**: Session-based auth with Role-based access (ADMIN, EXECUTIVE).
2. **Dashboard**: Real-time analytics, monthly trends, and status distribution charts.
3. **Lead Management**: Full CRUD with server-side pagination and advanced filtering.
4. **Follow-ups & Notes**: Interaction timeline and internal notes for every lead.
5. **Reminders**: Alerts for Today, Overdue, and Upcoming follow-ups.
6. **Export**: Export leads data to **Excel** and **PDF**.

## Setup Instructions

### Prerequisites
- **Java 21**
- **Node.js 18+**
- **MySQL 8**
- **Maven**

### Backend Setup
1. Create a MySQL database named `crm_db`.
2. Update `backend/src/main/resources/application.properties` with your database credentials.
3. Run the application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. The database schema and data will be automatically initialized from `schema.sql` and `data.sql`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Open `http://localhost:4200` in your browser.

### Credentials
- **Admin**: `admin` / `admin123`
- **Executive**: `executive` / `exec123`

## Database Schema
The SQL script is available in `backend/src/main/resources/schema.sql`.

## Testing APIs
A Thunder Client collection is provided in the project root as `CRM_APIs.json`.
