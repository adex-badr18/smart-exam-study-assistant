import React from "react";

const FeatureCard = ({ imageUrl, altText, title, description }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden hover:scale-105 hover:bg-blue-50">
            <img
                src={imageUrl}
                alt={altText}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src =
                        "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Available"; // Fallback image
                }}
            />
            <div className="p-6">
                <h3 className="text-xl text-blue-600 font-semibold mb-2">
                    {title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
