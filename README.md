# TalentFlow - Recruitment Management System

TalentFlow is a modern recruitment management platform built with React, Vite, and Tailwind CSS. It provides a comprehensive solution for managing job postings, candidate applications, and the recruitment workflow with separate dashboards for recruiters and candidates.

## Table of Contents

- [Features](#features)
- [Default Login Credentials](#default-login-credentials)
- [Setup](#setup)
- [Architecture](#architecture)
- [Technical Decisions](#technical-decisions)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)

## Features

### For Recruiters
- Job posting management (create, edit, archive, delete)
- Drag-and-drop job reordering
- Candidate tracking through different stages (Applied, Screen, Tech, Offer, Hired, Rejected)
- Assessment builder for creating job-specific evaluations
- Kanban board for candidate workflow management
- Real-time candidate notes with team mentions

### For Candidates
- Job browsing and application
- Assessment completion
- Application tracking

### For Both
- Responsive design with dark mode as default (light mode toggle available)
- Authentication system with pre-configured demo accounts
- Real-time notifications

## Default Login Credentials

For demonstration purposes, the application comes with pre-configured user accounts:

### Recruiter Account
- **Email**: recruiter@talentflow.com
- **Password**: recruiter123

### Candidate Account
- **Email**: candidate@talentflow.com
- **Password**: candidate123

Note: These credentials are only available when using the MirageJS mock server, which is enabled by default even in production builds to ensure the application works without a real backend.

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview the production build:
```bash
npm run preview
```

### Environment Variables
No environment variables are required for the basic setup. The application uses MirageJS for mocking the backend during both development and production.

## Architecture

### Frontend
- **Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: React Context API with custom hooks
- **Styling**: Tailwind CSS v4 with custom configurations
- **UI Components**: Custom component library with Radix UI primitives
- **Animations**: Framer Motion

### Backend (Mock)
- **Mocking Library**: MirageJS
- **Database**: IndexedDB (via Dexie.js) with localForage
- **Data Models**:
  - Users (Recruiters and Candidates)
  - Jobs
  - Candidates
  - Assessments

### Project Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── carousel.jsx
│   │   ├── toast.jsx
│   │   └── toaster.jsx
│   ├── AboutSection.jsx
│   ├── AddJobForm.jsx
│   ├── CandidateDashBoard.jsx
│   ├── ContactSection.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── Home.jsx
│   ├── JobCard.jsx
│   ├── Landing.jsx
│   ├── MetricCard.jsx
│   ├── Navbar.jsx
│   ├── NotFound.jsx
│   ├── ProjectsSection.jsx
│   ├── RecruiterDashboard.jsx
│   ├── Sidebar.jsx
│   ├── StarBackground.jsx
│   ├── ThemeToggle.jsx
│   ├── loginForm.jsx
│   └── loginRecruiter.jsx
├── data/                   # Static data files
│   └── companies.json
├── hooks/                  # Custom React hooks
│   └── use-toast.js
├── lib/                    # Utility functions and database setup
│   ├── db.js
│   └── utils.js
├── mirage/                 # MirageJS mock server
│   └── server.js
├── pages/                  # Page components
│   ├── AssessmentBuilder.jsx
│   ├── AssessmentPage.jsx
│   ├── KanbanBoard.jsx
│   ├── ViewJob.jsx
│   └── candidates.jsx
├── App.jsx                 # Main app component
├── index.css               # Global styles
└── main.jsx                # Entry point
```

### Key Components
1. **RecruiterDashboard** - Main dashboard for recruiters to manage jobs
2. **CandidateDashboard** - Dashboard for candidates to browse jobs
3. **KanbanBoard** - Visual workflow management for candidates
4. **AssessmentBuilder** - Tool for creating job assessments
5. **ViewJob** - Detailed job view with application functionality

### Data Flow
1. MirageJS intercepts all API requests
2. Data is persisted in IndexedDB via Dexie.js
3. Components fetch data through axios HTTP requests
4. State is managed locally within components using React hooks

## Technical Decisions

### 1. Choice of Vite over Create React App
- **Reason**: Faster development server startup and hot module replacement
- **Benefit**: Improved developer experience with instant feedback

### 2. Tailwind CSS v4
- **Reason**: Utility-first CSS framework with just-in-time compilation
- **Benefit**: Rapid UI development without context switching between files

### 3. MirageJS for Mocking
- **Reason**: Comprehensive mocking capabilities without a real backend
- **Benefit**: Full frontend development possible before backend completion
- **Note**: Enabled for both development and production to ensure deployed versions work without a real backend

### 4. IndexedDB with Dexie.js
- **Reason**: Client-side database for offline capability and performance
- **Benefit**: Data persistence without server dependency during development

### 5. Component-Based Architecture
- **Reason**: Reusability and maintainability
- **Benefit**: Easier to test, debug, and extend functionality

### 6. React Router v7
- **Reason**: Latest version with improved APIs
- **Benefit**: Better routing capabilities and future-proofing

### 7. Dark Mode as Default
- **Reason**: Modern UI preference and reduced eye strain
- **Benefit**: Better user experience with light mode toggle available

## Known Issues

### 1. Performance with Large Datasets
- **Issue**: Rendering 1000+ candidates can cause UI lag
- **Workaround**: Pagination is implemented but could be optimized further

### 2. Assessment Builder Limitations
- **Issue**: Assessment builder lacks advanced question types
- **Workaround**: Currently supports basic question formats only

### 3. Drag-and-Drop on Mobile
- **Issue**: Touch events for drag-and-drop may not work smoothly on all mobile devices
- **Workaround**: Desktop experience is fully functional

### 4. Data Persistence
- **Issue**: Data is stored in IndexedDB but may be cleared by browser maintenance
- **Workaround**: Export functionality could be added for data backup

### 5. Authentication Security
- **Issue**: Authentication is client-side only with no real security
- **Workaround**: Suitable for demo purposes but requires backend implementation for production

### 6. 500 Internal Server Errors
- **Issue**: Occasional 500 errors when accessing assessment endpoints
- **Solution**: The application uses MirageJS for mocking API calls. If you encounter this error:
  1. Check browser console for specific error messages
  2. Ensure the MirageJS server is properly initialized in `main.jsx`
  3. Verify that the assessment data structure matches what the components expect
  4. Clear browser cache and refresh the page
  5. The recent updates to the codebase should resolve most of these issues

### 7. 404 Login Errors
- **Issue**: Login requests return 404 errors indicating MirageJS is not intercepting requests
- **Solution**: This typically happens when MirageJS is not properly initialized or when there's a configuration issue:
  1. Check browser console for "Initializing MirageJS server..." and "MirageJS server initialized" messages
  2. Verify that requests are being made to `/api/login` (with the correct namespace)
  3. Ensure the MirageJS server configuration in `mirage/server.js` has the correct route definitions
  4. The recent updates should resolve this issue by removing incorrect passthrough configuration

## Deployment Notes

### Authentication in Production
The application uses MirageJS for authentication, which is enabled in both development and production environments. This ensures that the login functionality works correctly when deployed without requiring a real backend.

### Dark Mode Default
Dark mode is set as the default theme for all users. Users can toggle to light mode using the theme toggle button in the top right corner, and their preference will be saved in localStorage. The dark mode is implemented using CSS classes that are toggled on the root HTML element.

### Build Issues
If you encounter build errors related to Tailwind CSS utilities:
1. Ensure you're using Tailwind CSS v4 or later
2. Check that custom utilities are properly defined using the `@utility` directive
3. Avoid using `@apply` with unknown classes like `dark` which is not a standard Tailwind utility

## Future Improvements

### 1. Real Backend Integration
- Replace MirageJS with a real backend API
- Implement proper authentication with JWT tokens
- Add user roles and permissions

### 2. Advanced Analytics
- Add recruitment metrics and reporting
- Implement data visualization for hiring trends

### 3. Enhanced Assessment Features
- Add support for coding assessments
- Implement timed assessments
- Add plagiarism detection

### 4. Notification System
- Implement real-time notifications
- Add email/SMS notifications

### 5. Mobile Optimization
- Improve touch interactions
- Implement responsive design for all screen sizes

### 6. Accessibility Improvements
- Add screen reader support
- Implement keyboard navigation
- Ensure WCAG compliance

### 7. Performance Optimization
- Implement virtual scrolling for large datasets
- Add caching mechanisms
- Optimize bundle size

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.#
