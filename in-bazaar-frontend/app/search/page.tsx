"use client";

import { useRef, useState, useEffect } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  url: string;
  measuringUnit: string;
  seller: {
    shopName: string;
  };
  Category: {
    type: string;
  } | null;
}

const SearchResultCard = ({ result }: { result: SearchResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useOutsideClick(cardRef, () => setIsExpanded(false));

  return (
    <div
      ref={cardRef}
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "transition-all duration-300 ease-in-out rounded-lg p-4 m-2 cursor-pointer border border-white/20 shadow-lg",
        isExpanded ? "bg-white" : "bg-white/30 backdrop-blur-md",
        isExpanded ? "w-full" : "w-11/12"
      )}
    >
      <div className="flex gap-4">
        <Image
          src={result.url}
          alt={result.name}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{result.name}</h2>
          <p className="text-sm text-muted-foreground">
            {result.Category?.type || "Uncategorized"} •{" "}
            {result.seller.shopName}
          </p>
          <p className="font-medium">
            ₹{result.price} per {result.measuringUnit}
          </p>
          {isExpanded && (
            <p className="mt-2 text-muted-foreground">{result.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query?.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BACKEND_URL}/product/search/${encodeURIComponent(query.trim())}`
        );
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query?.trim()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Enter a search term to begin</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold my-8">Search Results for "{query}"</h1>
      {results.length === 0 ? (
        <p className="text-muted-foreground">No results found</p>
      ) : (
        <div className="flex flex-col items-center w-full">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
