import FeatureCard from "./FeatureCard";

const ExplorerFeatures = () => {
    const steps = [
        {
            id: 1,
            title: "Step 1: Select Your Preferences",
            description:
                "Easily choose your desired exam type, subject, year, and the number of questions using our intuitive form.",
            imageUrl:
                "https://placehold.co/600x400/AEC6CF/000000?text=Step+1:+Preferences", // Placeholder image for Step 1
            altText: "Student selecting exam preferences on a form",
        },
        {
            id: 2,
            title: "Step 2: Generate Questions",
            description:
                "Our intelligent system will instantly generate accurate and relevant questions tailored to your selections.",
            imageUrl:
                "https://placehold.co/600x400/87CEEB/000000?text=Step+2:+Generate", // Placeholder image for Step 2
            altText: "Computer screen showing generated exam questions",
        },
        {
            id: 3,
            title: "Step 3: Review and Learn",
            description:
                "Dive deep into each question, reveal correct answers, and access detailed explanations to enhance your understanding.",
            imageUrl:
                "https://placehold.co/600x400/ADD8E6/000000?text=Step+3:+Review+Learn", // Placeholder image for Step 3
            altText: "Student reviewing questions and explanations",
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl text-gray-800 font-bold text-center mb-12">
                    How Our Exam Question Explorer Works
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step) => (
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

export default ExplorerFeatures;
