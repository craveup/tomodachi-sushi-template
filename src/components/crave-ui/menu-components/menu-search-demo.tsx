"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function MenuSearchDemo() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search for dishes, cuisines, or ingredients..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-md px-8 border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {searchQuery && (
        <div className="mt-4 p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Searching for:{" "}
            <span className="font-medium text-foreground">
              &quot;{searchQuery}&quot;
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
