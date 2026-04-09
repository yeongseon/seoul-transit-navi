"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "../hooks/use-debounce";
import { searchSuggest } from "../lib/api";
import type { SearchSuggestion } from "../../../shared/types";
import { useTranslation } from "../i18n/client";

interface StationAutocompleteProps {
  id: string;
  name: string;
  placeholder?: string;
  value?: { id: string; name: string } | null;
  onChange?: (station: { id: string; name: string } | null) => void;
}

export function StationAutocomplete({
  id,
  name,
  placeholder,
  value,
  onChange,
}: StationAutocompleteProps) {
  const { t, locale } = useTranslation();
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isComposing, setIsComposing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectCounterRef = useRef(0);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (value?.name && value.name !== query) {
      setQuery(value.name);
    }
  }, [value, query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    
    if (isComposing) return;
    
    let isMounted = true;
    
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const data = await searchSuggest(debouncedQuery, locale);
        if (isMounted) {
          setResults(data);
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch {
        if (isMounted) {
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchSuggestions();
    
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, isComposing, locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resolveLocaleName = useCallback(async (suggestion: SearchSuggestion): Promise<string> => {
    if (locale === "ja") return suggestion.name;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
      const res = await fetch(`${apiUrl}/api/stations/${encodeURIComponent(suggestion.id)}`);
      if (!res.ok) return suggestion.name;
      const { data } = await res.json();
      return data?.nameKo ?? suggestion.name;
    } catch {
      return suggestion.name;
    }
  }, [locale]);

  const handleSelect = useCallback(async (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    const thisSelection = ++selectCounterRef.current;
    const displayName = await resolveLocaleName(suggestion);
    if (selectCounterRef.current !== thisSelection) return;
    setQuery(displayName);
    if (onChange) {
      onChange({ id: suggestion.id, name: displayName });
    }
  }, [onChange, resolveLocaleName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && results.length > 0) {
        setIsOpen(true);
      } else if (isOpen) {
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    } else if (e.key === "Enter") {
      if (isOpen && selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={query}
          onChange={(e) => {
            selectCounterRef.current++;
            setQuery(e.target.value);
            if (!isOpen && e.target.value.trim().length > 0) {
              setIsOpen(true);
            }
            if (onChange && value?.name) {
              onChange(null);
            }
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t("components.stationPlaceholder")}
          autoComplete="off"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
        >
          <ul className="m-0 p-0 list-none">
            {results.map((suggestion, index) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left cursor-pointer px-4 py-2 transition ${
                    index === selectedIndex ? "bg-sky-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">
                      {suggestion.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {suggestion.subtitle}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
