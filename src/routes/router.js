import { createBrowserRouter } from "react-router";

import RootLayout from "../pages/RootLayout";
import Home from "../pages/Home";

import ExplorerIndex from "../pages/exam-question-explorer/ExplorerIndex";
import ExplorerLayout from "../pages/exam-question-explorer/ExplorerLayout";
import GeneratedQuestions from "../pages/exam-question-explorer/GeneratedQuestions";

import MockExamLayout from "../pages/mockExam/MockExamLayout";
import MockExamIndex from "../pages/mockExam/MockExamIndex";
import ExamPage from "../pages/mockExam/ExamPage";
import ExplanationPage from "../pages/mockExam/ExplanationPage";
import ResultDashboard from "../pages/mockExam/ResultDashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            {
                path: "exam-question-explorer",
                Component: ExplorerLayout,
                children: [
                    { index: true, Component: ExplorerIndex },
                    {
                        path: "generated-questions",
                        Component: GeneratedQuestions,
                    },
                ],
            },
            {
                path: "mock-exam",
                Component: MockExamLayout,
                children: [
                    { index: true, Component: MockExamIndex },
                    { path: "exam", Component: ExamPage },
                    { path: "explanation", Component: ExplanationPage },
                    { path: "result", Component: ResultDashboard },
                ],
            },
        ],
    },
]);

export default router;
