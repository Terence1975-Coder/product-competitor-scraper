import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CompanyScraper() {
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, location }),
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Scraping error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Company Web Scraper</h1>

      <div className="grid gap-4 mb-6">
        <Input
          placeholder="Enter a company URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          placeholder="Enter location (e.g. London, UK)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button onClick={handleScrape} disabled={loading}>
          {loading ? "Researching..." : <><Search className="mr-2 h-4 w-4" /> Begin Research</>}
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4 shadow-md">
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">{result.name}</h2>
              <p className="mb-2 text-sm text-gray-700">{result.description}</p>
              <div className="flex items-center justify-between">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {result.url}
                </a>
                <Button size="sm" onClick={() => handleCopy(result.url)}>Copy</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
