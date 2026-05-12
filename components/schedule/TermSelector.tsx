"use client";

import { Tables } from "@/types/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { seasonColors, seasonIcons } from "@/constants";

interface TermSelectorProps {
  terms: Tables<"terms">[];
  selectedTermId: number;
  setSelectedTermId: (termId: number) => void;
}

export function TermSelector({
  terms,
  selectedTermId,
  setSelectedTermId,
}: TermSelectorProps) {
  const selectedTerm = terms.find((term) => term.id === selectedTermId);

  // The Select component requires a string value, so we convert the number to a string
  const selectedTermIdString = selectedTermId.toString();

  function handleTermChange(termId: string) {
    setSelectedTermId(parseInt(termId));
  }

  return (
    <Select value={selectedTermIdString} onValueChange={handleTermChange}>
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
        {terms.map((term: Tables<"terms">) => {
          const IconComponent = seasonIcons[term.season];
          const colorClass = seasonColors[term.season];

          return (
            <SelectItem
              key={term.id}
              value={term.id.toString()}
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

