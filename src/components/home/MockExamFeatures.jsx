import FeatureCard from "./FeatureCard";
import step1Img from "../../assets/mockPref.png";
import step2Img from "../../assets/mockQuestions.png";
import step3Img from "../../assets/resultDashboard.png";

const MockExamFeatures = () => {
    const mockExamSteps = [
        {
            id: 1,
            title: "Step 1: Setup Your Mock Exam",
            description:
                "Configure your mock exam by selecting the exam type, subject, desired number of questions, and specific topics to focus on.",
            imageUrl:
                step1Img ||
                "https://placehold.co/600x400/FFDDC1/000000?text=Step+1:+Setup+Mock+Exam", // Placeholder image for Mock Exam Step 1
            altText: "Student setting up mock exam preferences on a computer",
        },
        {
            id: 2,
            title: "Step 2: Take the Exam",
            description:
                "Experience real exam conditions by answering each question under a simulated countdown timer, designed to build your time management skills.",
            imageUrl:
                step2Img ||
                "https://placehold.co/600x400/D4EDDA/000000?text=Step+2:+Take+Exam", // Placeholder image for Mock Exam Step 2
            altText: "Student taking a timed mock exam on a laptop",
        },
        {
            id: 3,
            title: " Step 3: Result and Explanation",
            description:
                "Upon submission, instantly review your score, analyze your accuracy, and gain insights from detailed explanations for every answer.",
            imageUrl:
                step3Img ||
                "https://placehold.co/600x400/C1DFF0/000000?text=Step+3:+View+Results", // Placeholder image for Mock Exam Step 3
            altText: "Exam results and AI explanations displayed on a screen",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl text-gray-800 font-bold text-center mb-12">
                    Mock Exam Feature
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockExamSteps.map((step) => (
                        <FeatureCard
                            key={step.id}
                            imageUrl={step.imageUrl}
                            altText={step.altText}
                            title={step.title}
                            description={step.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MockExamFeatures;
