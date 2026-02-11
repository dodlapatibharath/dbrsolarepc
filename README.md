# dbrsolarepc

A modern multi-page solar EPC website for DBR Solar EPC Pvt Ltd, now with customer login/sign-up connected to a database.

## Pages
- `index.html`: Home page with hero, service overview, savings calculator, process timeline and rotating testimonials.
- `about.html`: Company mission, values and differentiators.
- `products.html`: Service catalogue with residential, C&I, ground-mount and AMC offerings.
- `projects.html`: Project portfolio categories and delivery model.
- `careers.html`: Hiring page with open role categories and application instructions.
- `contact.html`: Contact details and enquiry form.
- `signup.html`: Customer account creation page.
- `login.html`: Customer login page.

## Tech
- HTML5
- CSS3 (glassmorphism + gradients + responsive layout)
- Vanilla JavaScript (navigation state, animated counters, calculator, rotating testimonials, contact-form response)
- Node.js + Express backend APIs for authentication
- PostgreSQL database integration using `pg`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by copying `.env.example` to `.env` and setting your values:
   ```bash
   cp .env.example .env
   ```
3. Ensure your PostgreSQL database is running and reachable using `DATABASE_URL`.
4. Start the app:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`.

## Authentication API
- `POST /api/auth/signup`
  - Body: `{ "fullName": "...", "email": "...", "phone": "...", "password": "..." }`
- `POST /api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`

The `customers` table is auto-created on server startup. You can also apply `db/schema.sql` manually.
