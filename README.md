# ExamPrep AI: Intelligent Exam Preparation Platform

## Project Overview

ExamPrep AI is an interactive web application designed to help students prepare for national examinations by providing AI-generated practice questions and mock exam simulations. Leveraging the power of Google's Gemini AI, the platform offers a dynamic learning experience, allowing users to explore past exam questions, take timed mock tests, and receive detailed performance analytics and explanations.

## Features

### 1. Exam Question Explorer

* **Customizable Question Generation:** Generate practice questions based on specific exam types (WAEC, NECO, UTME), subjects (Mathematics, English Language, Physics, etc.), and years.

* **AI-Powered Content:** Utilizes Google Gemini API to generate accurate and relevant questions, options, and explanations.

* **Detailed Explanations:** Access comprehensive, step-by-step explanations for each question, including LaTeX rendering for mathematical and scientific notation.

* **Image Placeholders:** Questions requiring diagrams or images include placeholder URLs and descriptive alt text, indicating where visual aids would be integrated in a production environment.

### 2. Mock Exam Simulation

* **Timed Sessions:** Experience realistic exam conditions with a global countdown timer for the entire examination.

* **Cumulative Time Tracking:** Tracks and records the cumulative time spent on each individual question, even if skipped and revisited.

* **Interactive UI:** Navigate seamlessly between questions using "Previous" and "Next" buttons.

* **Question Navigation Grid:** A visual grid of question numbers allows direct jumps to any question, with clear differentiation between answered and unanswered questions.

* **Clear Answer Option:** Students can deselect their chosen answer for any question.

* **Auto-Submission:** The exam automatically submits when the total time runs out.

* **Confirmation Modal:** A confirmation prompt appears before manual exam submission to prevent accidental exits.

### 3. Performance Analytics & Review

* **Comprehensive Results Dashboard:** Displays overall score, accuracy, total time spent, and counts of correct, incorrect, and unanswered questions.

* **Visual Data Representation:** Utilizes a Pie Chart (powered by Recharts) to visually represent the distribution of answered questions (correct, incorrect, unanswered).

* **AI-Generated Strengths & Weaknesses (Planned):** Future integration will provide personalized insights into a student's strong and weak areas based on their performance.

* **Detailed Question Review:** Review each question from the exam, seeing your selected answer, the correct answer, and the full explanation.

* **AI-Powered Explanations (Planned):** Future integration will allow on-demand, AI-generated explanations for any question during review.

### 4. User Interface & Experience

* **Responsive Design:** Optimized for seamless viewing and interaction across various devices (mobile, tablet, desktop) using Tailwind CSS.

* **LaTeX Rendering:** Integrates `better-react-mathjax` to ensure beautiful and accurate rendering of complex mathematical and scientific expressions.

* **Toast Notifications:** Provides subtle, non-intrusive feedback for user actions (e.g., "Questions generated successfully!").

## Technologies Used

* **Frontend:**

    * [React](https://react.dev/) (with Hooks)

    * [Tailwind CSS](https://tailwindcss.com/)

    * [React Router DOM](https://reactrouter.com/en/main)

    * [TanStack Query](https://tanstack.com/query/latest) (for data fetching and state management)

    * [Recharts](https://recharts.org/en-US/) (for charting)

    * [better-react-mathjax](https://www.npmjs.com/package/better-react-mathjax) (for LaTeX rendering)

    * [Vite](https://vitejs.dev/) (as the build tool)

* **AI Integration:**

    * [Google Gemini API](https://ai.google.dev/models/gemini) (via `@google/generative-ai` SDK)

* **Environment Management:**

    * `.env` files for API keys and sensitive information.

## Installation

To set up and run this project locally, follow these steps:

### Prerequisites

* Node.js (LTS version recommended)

* npm or Yarn

### Steps

1.  **Clone the Repository (Hypothetical):**
    ```bash
    git clone [https://github.com/your-username/exam-prep-ai.git](https://github.com/your-username/exam-prep-ai.git)
    cd exam-prep-ai
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set Up Environment Variables:**
    * Create a file named `.env` in the root directory of your project (the same level as `package.json`).
    * Obtain a Google Gemini API Key from the [Google AI Studio](https://ai.google.dev/gemini-api/docs/get-started/web).
    * Add your API key to the `.env` file:
        ```
        VITE_GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
        ```
        Replace `YOUR_ACTUAL_GEMINI_API_KEY` with the key you obtained.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically open in your browser at `http://localhost:5173`.

## Usage

1.  **Home Page:** Upon launching the application, you'll see the main landing page with an overview of the "Exam Question Explorer" and "Mock Exam" features.

2.  **Exam Question Explorer:**
    * Scroll down to the "Explore Past Exam Questions" section.
    * Select your desired exam type, subject, year, and number of questions.
    * Click "Generate Questions" to view and review questions with explanations.

3.  **Mock Exam:**
    * Scroll down to the "Mock Exam Feature" section.
    * Select your exam type, subject, number of questions, and an optional specific topic.
    * Click "Start Mock Exam" to begin a timed session.
    * Navigate between questions, select answers, and use the question grid for quick jumps.
    * Submit the exam manually or wait for the timer to expire for auto-submission.

4.  **View Results:**
    * After completing a mock exam, you will be redirected to the results page.
    * Review your score, accuracy, time spent, and a breakdown of correct/incorrect/unanswered questions.
    * Examine each question with your answer, the correct answer, and the explanation.
    * (Future: Utilize AI-powered insights for strengths and weaknesses, and on-demand explanations.)
    * Click "Start New Mock Exam" to return to the mock exam form.

## Project Structure (Key Files)

.
├── public/
├── src/
│   ├── api/
│   │   ├── geminiApi.js             # API calls for Exam Explorer questions
│   │   ├── mockExamApi.js           # API calls for Mock Exam questions (including topicTag)
│   │   └── strengthsWeaknessesApi.js # NEW: API calls for AI strengths/weaknesses
│   ├── components/
│   │   ├── ExamQuestionExplorerForm.jsx # Form for explorer
│   │   ├── FeatureStepsCardGrid.jsx # Reusable component for step cards
│   │   ├── MockExamForm.jsx         # Form for mock exam
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── ReviewQuestionCard.jsx   # NEW: Optimized component for review questions
│   │   └── Toast.jsx                # Toast notification system
│   ├── hooks/
│   │   ├── useGenerateMockExam.js   # TanStack Query hook for mock exam generation
│   │   ├── useGenerateQuestions.js  # TanStack Query hook for explorer generation
│   │   └── useStrengthsWeaknesses.js # NEW: TanStack Query hook for strengths/weaknesses
│   ├── pages/
│   │   ├── QuestionsPage.jsx        # Display page for explorer questions
│   │   ├── MockExamPage.jsx         # Interactive mock exam page (with timer)
│   │   └── MockExamResultsPage.jsx  # NEW: Results and review page
│   ├── App.js                       # Main application component, handles routing
│   └── main.jsx                     # Entry point for React application
├── .env                             # Environment variables (e.g., VITE_GEMINI_API_KEY)
├── package.json                     # Project dependencies and scripts
└── vite.config.js                   # Vite configuration

## Future Enhancements

* **Full AI Integration:** Implement actual API calls for AI-generated strengths/weaknesses and on-demand question explanations.

* **User Authentication:** Implement user login/registration to personalize experiences and save progress.

* **Data Persistence:** Integrate a backend (e.g., Node.js with PostgreSQL/MongoDB as per your learning goals) and Firestore for saving user exam history, performance trends, and custom settings.

* **More Content:** Expand the range of exam types, subjects, and topics.

* **Adaptive Learning Paths:** Suggest personalized study plans based on identified weaknesses.

* **Performance Tracking:** Visualize long-term performance trends and progress.

* **Gamification:** Add elements like badges, leaderboards, or progress bars to enhance engagement.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

## License

This project is open-sourced under the MIT License. (You can replace this with your preferred license).