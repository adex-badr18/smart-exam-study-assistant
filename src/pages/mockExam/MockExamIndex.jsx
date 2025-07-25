import { useState } from "react";
import { useGenerateMockExam } from "../../hooks/useGenerateMockExam";
import Spinner from "../../components/Spinner";

const MockExamIndex = () => {
    const [formData, setFormData] = useState({
        examType: "UTME",
        subject: "Mathematics",
        numQuestions: 5,
        topic: "Trigonometry",
    });

    const { mutate, isPending } = useGenerateMockExam();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    const topics = {
        Mathematics: [
            "Algebra",
            "Geometry",
            "Calculus",
            "Statistics",
            "Trigonometry",
        ],
        "English Language": [
            "Grammar",
            "Comprehension",
            "Lexis & Structure",
            "Summary",
        ],
        Physics: [
            "Mechanics",
            "Waves",
            "Electricity",
            "Heat",
            "Modern Physics",
        ],
        Chemistry: [
            "Organic Chemistry",
            "Inorganic Chemistry",
            "Physical Chemistry",
        ],
        Biology: ["Genetics", "Ecology", "Human Physiology", "Plant Biology"],
        Economics: ["Microeconomics", "Macroeconomics", "International Trade"],
        Government: [
            "Constitutional Law",
            "Public Administration",
            "International Relations",
        ],
    };

    const availableTopics = topics[formData.subject] || [];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                    Mock Examination
                </h2>

                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                    Prepare for your national exams under simulated conditions.
                    Select your preferences below.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg"
                >
                    {/* Exam Type */}
                    <div className="mb-6">
                        <label
                            htmlFor="mockExamType"
                            className="block text-gray-700 text-lg font-medium mb-2"
                        >
                            Exam Type
                        </label>
                        <select
                            id="mockExamType"
                            name="examType"
                            value={formData.examType}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        >
                            <option value="" disabled>
                                Select an exam type
                            </option>
                            <option value="WAEC">WAEC</option>
                            <option value="NECO">NECO</option>
                            <option value="UTME">UTME</option>
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="mb-6">
                        <label
                            htmlFor="mockSubject"
                            className="block text-gray-700 text-lg font-medium mb-2"
                        >
                            Subject
                        </label>
                        <select
                            id="mockSubject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        >
                            <option value="" disabled>
                                Select a subject
                            </option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="English Language">
                                English Language
                            </option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="Economics">Economics</option>
                            <option value="Government">Government</option>
                        </select>
                    </div>

                    {/* Topic (Conditional based on Subject) */}
                    {formData.subject && (
                        <div className="mb-6">
                            <label
                                htmlFor="mockTopic"
                                className="block text-gray-700 text-lg font-medium mb-2"
                            >
                                Topic (Optional)
                            </label>
                            <select
                                id="mockTopic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                            >
                                <option value="">Any Topic</option>
                                {availableTopics.map((topic) => (
                                    <option key={topic} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Number of Questions */}
                    <div className="mb-8">
                        <label
                            htmlFor="numQuestions"
                            className="block text-gray-700 text-lg font-medium mb-2"
                        >
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            min={5}
                            max={50}
                            id="numQuestions"
                            name="numQuestions"
                            value={formData.numQuestions}
                            onChange={handleChange}
                            // required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg ${
                            isPending ? "animate-pulse" : ""
                        } hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed`}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Spinner
                                secondaryText="Generating Questions..."
                                spinnerSize="w-6 h-6"
                                textClass="text-white"
                                borderClass="border-white"
                            />
                        ) : (
                            "Generate Questions"
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default MockExamIndex;
