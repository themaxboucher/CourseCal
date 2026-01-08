"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { seasonColors, seasonIcons } from "@/constants";

interface TermSelectorProps {
  terms: Term[];
  selectedTermId: string;
  onTermChange: (termId: string) => void;
}

export function TermSelector({
  terms,
  selectedTermId,
  onTermChange,
}: TermSelectorProps) {
  const selectedTerm = terms.find((term) => term.$id === selectedTermId);

  return (
    <Select value={selectedTermId} onValueChange={onTermChange}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a term">
          {selectedTerm && (
            <div className="flex items-center gap-2">
              {(() => {
                const IconComponent = seasonIcons[selectedTerm.season];
                const colorClass = seasonColors[selectedTerm.season];
                return (
                  <>
                    <IconComponent className={`h-4 w-4 ${colorClass}`} />
                    {selectedTerm.season} {selectedTerm.year}
                  </>
                );
              })()}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {terms.map((term: Term) => {
          const IconComponent = seasonIcons[term.season];
          const colorClass = seasonColors[term.season];

          return (
            <SelectItem
              key={term.$id}
              value={term.$id || ""}
              className="capitalize"
            >
              <div className="flex items-center gap-2">
                <IconComponent className={`h-4 w-4 ${colorClass}`} />
                {term.season} {term.year}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

