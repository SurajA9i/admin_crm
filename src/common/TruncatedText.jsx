import { useState } from "react";

const TruncatedText = ({ text, wordLimit = 15 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null; // Handle empty or undefined text

    const words = text.split(" ");
    const isLong = words.length > wordLimit;
    const truncatedText = words.slice(0, wordLimit).join(" ");

    return (
        <div
            style={{
                whiteSpace: isExpanded ? "normal" : "nowrap",  // Wrap text when expanded
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordWrap: "break-word",  // Ensures proper wrapping
                display: "block",        // Forces multi-line when expanded
                maxWidth: "100%"         // Ensures it fits within the table cell
            }}
        >
            {isExpanded ? text : `${truncatedText}... `}
            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        border: "none",
                        background: "none",
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                        display: "inline"
                    }}
                >
                    {isExpanded ? "View Less" : "View More"}
                </button>
            )}
        </div>
    );
};

export default TruncatedText;
