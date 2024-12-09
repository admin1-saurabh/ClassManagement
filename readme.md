
# ClassManagement

This project is a web application with a React frontend using Vite and a Django backend. Below, you'll find instructions for running both parts locally.



## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14+ recommended)
- [Python](https://www.python.org/downloads/) (v3.8+ recommended)
- [pip](https://pip.pypa.io/en/stable/installation/) (Python package manager)




## Project Setup

### Step 1: Clone the repository

Clone the project repository to your local machine using the following command:

```bash
git clone https://github.com/admin1-saurabh/ClassManagement.git
cd ClassManagement
```

### Step 2: Set up the Frontend (React + Vite)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at [http://localhost:5173](http://localhost:5173).

### Step 3: Set up the Backend (Django)



1. Navigate to the backend directory:

   ```bash
   cd ../backend
   ```

2. Create and activate a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # For Linux/macOS
   venv\Scripts\activate     # For Windows
   ```

3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   Create a `.env` file in the backend directory and add the following:

   ```env
   POSTGRE_SQL_ENDPOINT=your-secret-key
   
   ```

   Replace `your-secret-key` with a secure Django secret key.



6. Run the Django development server:

   ```bash
   python manage.py runserver
   ```

   The backend will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

- frontend/: Contains the React application with Vite as the build tool.
- backend/: Contains the Django application with its respective configurations and code.

## How the Frontend and Backend Work Together

- The frontend React application interacts with the backend Django API by making HTTP requests to the `http://localhost:8000` endpoint.
- Ensure that the backend server is running before starting the frontend development server.

## Troubleshooting

- If you encounter CORS issues: Ensure the `django-cors-headers` package is installed and configured in `settings.py` of the Django project.
- If npm runs into dependency issues: Run `npm install` again to ensure all packages are installed correctly.
- Database errors: Make sure the database service is set up and running if you have specific database configurations.

## Additional Information

- Frontend development: Visit [Vite Documentation](https://vitejs.dev/guide/) for more details on Vite usage and customization.
- Backend development: Visit [Django Documentation](https://docs.djangoproject.com/en/stable/) for Django-specific configurations and guidance.

---

This README provides a comprehensive guide for setting up and running both the frontend and backend components of your project locally.