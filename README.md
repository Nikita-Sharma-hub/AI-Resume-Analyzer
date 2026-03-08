# AI Resume Analyzer

A modern MERN stack application that analyzes resumes using AI to provide match scores, strengths, weaknesses, and improvement suggestions.

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** (latest version)
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB Atlas** for database
- **JWT** for authentication
- **Multer** for file uploads
- **ES6 Modules** throughout

## Features

- ✅ Resume upload and analysis
- ✅ AI-powered scoring and feedback
- ✅ File type validation (PDF, DOC, DOCX, TXT)
- ✅ Responsive design with Tailwind v4
- ✅ Loading and error states
- ✅ CORS configuration
- ✅ JWT authentication
- ✅ Modern UI components

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd AI-Resume-Analyzer

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Setup

#### Backend Environment
Create `.env` file in `server/` directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment
Create `.env` file in `client/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start the Application

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Resume Management
- `POST /api/resume/upload` - Upload resume (protected)
- `POST /api/resume/analyze` - Analyze resume (protected)
- `GET /api/resume/my` - Get user's resumes (protected)
- `DELETE /api/resume/:id` - Delete resume (protected)

## Response Structure

### Resume Analysis Response
```json
{
  "message": "Resume analyzed successfully",
  "score": 85,
  "strengths": ["Strong technical foundation", "Good project experience"],
  "weaknesses": ["Missing quantifiable achievements"],
  "improvementSuggestions": ["Add measurable achievements with numbers"],
  "extractedSkills": ["JavaScript", "React", "Node.js"],
  "role": "Full Stack Developer",
  "summary": "Overall score of 85%...",
  "seniorityHint": "Mid-level"
}
```

## File Upload Requirements

- **Supported formats**: PDF, DOC, DOCX, TXT
- **Maximum file size**: 5MB
- **File storage**: Local uploads directory

## Development Notes

### Tailwind CSS v4
This project uses Tailwind CSS v4 with the new import syntax:
```css
@import "tailwindcss";
```

### ES6 Modules
Both frontend and backend use ES6 modules (`"type": "module"` in package.json).

### Error Handling
- Comprehensive error handling middleware
- File upload validation
- CORS configuration
- Proper HTTP status codes

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Build Commands
```bash
# Build frontend for production
cd client
npm run build

# Start production server
cd ../server
npm start
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` matches your frontend URL
2. **MongoDB Connection**: Check your MongoDB URI and network access
3. **File Upload Issues**: Ensure uploads directory exists and has proper permissions
4. **JWT Errors**: Verify JWT_SECRET is set and tokens are properly sent

### Console Warnings
The application has been optimized to eliminate common console warnings:
- No unused imports
- Proper React key props
- No deprecated APIs
- Clean component unmounting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
