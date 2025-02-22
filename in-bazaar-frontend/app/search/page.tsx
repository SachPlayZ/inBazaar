"use client";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";

const SearchResultCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useOutsideClick(cardRef, () => setIsExpanded(false));

  return (
    <div
      ref={cardRef}
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "transition-all duration-300 ease-in-out rounded-lg p-4 m-2 cursor-pointer border border-white/20 shadow-lg",
        // When expanded, use bg-white; otherwise, glassmorphic bg
        isExpanded ? "bg-white" : "bg-white/30 backdrop-blur-md",
        isExpanded ? "w-full" : "w-11/12"
      )}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {isExpanded && <p className="mt-2">{content}</p>}
    </div>
  );
};

const SearchPage = () => {
  const results = [
    { title: "Result 1", content: "This is the content for result 1." },
    { title: "Result 2", content: "This is the content for result 2." },
    { title: "Result 3", content: "This is the content for result 3." },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold my-8">Search Results</h1>
      <div className="flex flex-col items-center w-full">
        {results.map((result, index) => (
          <SearchResultCard
            key={index}
            title={result.title}
            content={result.content}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
