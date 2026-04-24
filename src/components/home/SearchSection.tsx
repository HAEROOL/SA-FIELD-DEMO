"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchClans, useSearchPlayers } from "@/hooks/queries/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SearchType,
  ClanSearchResult,
  PlayerSearchResult,
} from "@/apis/types/search.type";
import Loader from "@/components/common/Loader";
import { ClanLogo } from "@/components/ui/ClanLogo";
import { searchService } from "@/apis/searchService";

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-brand-500">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
}

export default function SearchSection() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<SearchType>("player");
  const [query, setQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debouncing logic for preview
  const debouncedQuery = useDebounce(query, 500);

  const {
    data: clanResults,
    isLoading: isClanLoading,
    isFetching: isClanFetching,
    isError: isClanError,
  } = useSearchClans(searchType === "clan" ? debouncedQuery : "");

  const {
    data: playerResults,
    isLoading: isPlayerLoading,
    isFetching: isPlayerFetching,
    isError: isPlayerError,
  } = useSearchPlayers(searchType === "player" ? debouncedQuery : "");

  const isLoading =
    searchType === "clan"
      ? isClanLoading || isClanFetching
      : isPlayerLoading || isPlayerFetching;
  const isError = searchType === "clan" ? isClanError : isPlayerError;
  const results = searchType === "clan" ? clanResults : playerResults;

  const placeholder =
    searchType === "player" ? "닉네임 입력" : "클랜명 입력";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowPreview(false);
      }
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsSelectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const performSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setShowPreview(false);

    try {
      let searchResults: (ClanSearchResult | PlayerSearchResult)[] = [];
      if (searchType === "clan") {
        searchResults = await searchService.searchClans(query);
      } else {
        searchResults = await searchService.searchPlayers(query);
      }

      if (searchResults && searchResults.length > 0) {
        // Find exact match case-insensitive
        const exactMatch = searchResults.find(
          (item) => item.name.toLowerCase() === query.toLowerCase(),
        );
        const target = exactMatch || searchResults[0];

        const route =
          searchType === "clan"
            ? `/clan/${encodeURIComponent(target.id)}`
            : `/user/${encodeURIComponent(target.id)}`;
        router.push(route);
      } else {
        // No results -> Fallback
        router.push(
          `/search/not-found?type=${searchType}&query=${encodeURIComponent(
            query,
          )}`,
        );
      }
    } catch (error) {
      console.error("Search failed", error);
      // Optional: Show error toast or state
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (id: string, name: string) => {
    setQuery(name);
    setShowPreview(false);

    // Create the correct route
    const route =
      searchType === "clan"
        ? `/clan/${encodeURIComponent(id)}`
        : `/user/${encodeURIComponent(id)}`;
    router.push(route);
  };

  return (
    <div
      className="w-full relative bg-white shadow-2xl flex items-center p-1 pl-3 md:pl-6 pr-1 md:pr-2 h-14 md:h-16 transition-all duration-300 border border-transparent focus-within:border-brand-500/50 focus-within:ring-4 focus-within:ring-brand-500/20"
      ref={searchRef}
    >
      {/* Search Type Selector (Custom Dropdown) */}
      <div className="relative flex-shrink-0" ref={selectorRef}>
        <button
          type="button"
          onClick={() => {
            const nextState = !isSelectorOpen;
            setIsSelectorOpen(nextState);
            if (nextState) setShowPreview(false);
          }}
          className="flex items-center gap-1 md:gap-2 font-bold text-gray-800 text-sm md:text-base focus:outline-none cursor-pointer py-2 pl-1 md:pl-2 hover:text-brand-600 transition-colors"
        >
          <span className="inline-block w-14 md:w-16 text-left">{searchType === "clan" ? "클랜" : "플레이어"}</span>
          <i
            className={`fas fa-chevron-down text-[10px] md:text-xs text-gray-400 transition-transform duration-200 ${
              isSelectorOpen ? "transform rotate-180" : ""
            }`}
          ></i>
        </button>

        {isSelectorOpen && (
          <ul className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
            <li
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors font-medium flex items-center justify-between ${
                searchType === "player"
                  ? "text-brand-600 bg-brand-50"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setSearchType("player");
                setQuery("");
                setShowPreview(false);
                setIsSelectorOpen(false);
              }}
            >
              <span>플레이어</span>
              {searchType === "player" && (
                <i className="fas fa-check text-xs"></i>
              )}
            </li>
            <li
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors font-medium flex items-center justify-between ${
                searchType === "clan"
                  ? "text-brand-600 bg-brand-50"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setSearchType("clan");
                setQuery("");
                setShowPreview(false);
                setIsSelectorOpen(false);
              }}
            >
              <span>클랜</span>
              {searchType === "clan" && (
                <i className="fas fa-check text-xs"></i>
              )}
            </li>
          </ul>
        )}
      </div>

      <div className="w-px h-6 md:h-8 bg-gray-200 mx-2 md:mx-4"></div>

      {/* Input */}
      <div className="flex-1 h-full min-w-0">
        <input
          type="text"
          className="w-full h-full text-gray-900 text-base md:text-lg placeholder-gray-400 focus:outline-none bg-transparent"
          placeholder={placeholder}
          autoComplete="off"
          maxLength={16}
          value={query}
          onChange={(e) => {
            const val = e.target.value.replace(/^\s+/, "");
            setQuery(val);
            if (val.trim().length > 0) {
              setShowPreview(true);
              setIsSelectorOpen(false);
            } else {
              setShowPreview(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") performSearch();
          }}
          onFocus={() => {
            if (query.length > 0) {
              setShowPreview(true);
              setIsSelectorOpen(false);
            }
          }}
        />
      </div>

      {/* Preview Dropdown */}
      {showPreview && query.length > 0 && !isSearching && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 animate-fade-in-up">
          {isError ? (
            <div className="p-5 text-center text-red-500">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : !results || results.length === 0 ? (
            !isLoading && (
              <div className="p-8 text-center text-gray-500">
                <i className="fas fa-search-minus text-3xl mb-2 opacity-50"></i>
                <p>검색 결과가 없습니다.</p>
              </div>
            )
          ) : (
            <ul className="divide-y divide-gray-100 overflow-y-auto max-h-80">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors"
                  onClick={() => handleResultClick(item.id, item.name)}
                >
                  <div className="flex items-center gap-4">
                    {searchType === "clan" ? (
                      <ClanLogo
                        clanName={item.name}
                        clanMarkUrl={item.clanMarkUrl ?? null}
                        clanBackMarkUrl={item.clanBackMarkUrl ?? null}
                        size="sm"
                        className="w-10 h-10 shadow-sm rounded-none"
                      />
                    ) : item.clanName ? (
                      <ClanLogo
                        clanName={item.clanName}
                        clanMarkUrl={item.clanMarkUrl ?? null}
                        clanBackMarkUrl={item.clanBackMarkUrl ?? null}
                        size="sm"
                        className="w-10 h-10 shadow-sm rounded-none"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                        <HighlightMatch text={item.name} query={query} />
                      </p>
                      {searchType === "player" && (
                        <p className="text-xs text-gray-500">
                          {item.clanName ? item.clanName : "No Clan"}
                        </p>
                      )}
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-gray-300 group-hover:text-brand-500 transition-colors"></i>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Search Button */}
      <button
        onClick={performSearch}
        disabled={isSearching}
        className="ml-1 md:ml-2 w-10 md:w-12 h-10 md:h-12 bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center flex-shrink-0"
      >
        {isSearching || (isLoading && query.length > 0) ? (
          <Loader size="sm" className="border-white" />
        ) : (
          <i className="fas fa-search text-base md:text-lg"></i>
        )}
      </button>
    </div>
  );
}
