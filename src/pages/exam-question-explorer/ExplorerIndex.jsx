import { useState } from "react";

const ExplorerIndex = () => {
    // State to hold the form data
    const [formData, setFormData] = useState({
        examType: "",
        subject: "",
        year: "",
        numQuestions: 20, // Default number of questions
    });

    // Handle input changes and update state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would pass formData to your API or prompt schema here.
        console.log("Form Submitted:", formData);
        alert(
            "Form submitted! Check console for data. This data will be used to generate questions."
        );
        // Example of how you might call a function to generate questions:
        // generateQuestions(formData);
    };

    // Generate years for the dropdown (e.g., last 15 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                    Explore Past Exam Questions
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                    Select your preferences below to generate and practice with
                    relevant past examination questions.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg"
                >
                    {/* Exam Type */}
                    <div className="mb-6">
                        <label
                            htmlFor="examType"
                            className="block text-gray-700 text-lg font-medium mb-2"
                        >
                            Exam Type
                        </label>
                        <select
                            id="examType"
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
                            {/* Add more exam types as needed */}
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="mb-6">
                        <label
                            htmlFor="subject"
                            className="block text-gray-700 text-lg font-medium mb-2"
                        >
                            Subject
                        </label>
                        <select
                            id="subject"
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
                            {/* Add more subjects as needed */}
                        </select>
                    </div>

                    {/* Year */}
                    <div className="mb-6">
                        <label
                            htmlFor="year"
                            className="block text-gray-700 text-lg font-medium mb-2"
                        >
                            Year
                        </label>
                        <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        >
                            <option value="" disabled>
                                Select a year
                            </option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            min={20}
                            max={100}
                            id="numQuestions"
                            name="numQuestions"
                            value={formData.numQuestions}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg
                       hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Generate Questions
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ExplorerIndex;
