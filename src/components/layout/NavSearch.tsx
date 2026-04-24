"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/components/ui/utils";
import { searchService } from "@/apis/searchService";
import { useSearchClans, useSearchPlayers } from "@/hooks/queries/useSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchType } from "@/apis/types/search.type";
import { ClanLogo } from "@/components/ui/ClanLogo";
import Loader from "@/components/common/Loader";

export default function NavSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("player");
  const [isSearching, setIsSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const isLoadingResults =
    searchType === "clan"
      ? isClanLoading || isClanFetching
      : isPlayerLoading || isPlayerFetching;
  const isError = searchType === "clan" ? isClanError : isPlayerError;
  const results = searchType === "clan" ? clanResults : playerResults;

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setShowPreview(false);

    try {
      const searchResults = searchType === "clan" 
        ? await searchService.searchClans(query)
        : await searchService.searchPlayers(query);

      if (searchResults && searchResults.length > 0) {
        const exactMatch = searchResults.find(
          (item) => item.name.toLowerCase() === query.toLowerCase()
        );
        const target = exactMatch || searchResults[0];

        const route = searchType === "clan"
          ? `/clan/${encodeURIComponent(target.id)}`
          : `/user/${encodeURIComponent(target.id)}`;
        
        router.push(route);
        setIsOpen(false);
        setQuery("");
      } else {
        router.push(`/search/not-found?type=${searchType}&query=${encodeURIComponent(query)}`);
        setIsOpen(false);
        setQuery("");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (id: string, name: string) => {
    setQuery(name);
    setShowPreview(false);
    setIsOpen(false);
    const route = searchType === "clan"
      ? `/clan/${encodeURIComponent(id)}`
      : `/user/${encodeURIComponent(id)}`;
    router.push(route);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // isOpen 상태가 false가 될 때(접힐 때) 모든 검색 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setShowPreview(false);
      setIsSelectorOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      <div 
        className={cn(
          "flex items-center transition-all duration-500 ease-in-out bg-[#1e2026]/90 backdrop-blur-xl border border-gray-700/50 h-10 shadow-2xl overflow-hidden",
          isOpen ? "w-64 sm:w-80 px-2 opacity-100 rounded-xl" : "w-0 px-0 opacity-0 border-transparent pointer-events-none"
        )}
      >
        <div className="flex items-center w-full shrink-0">
          {/* Type Selector */}
          <div className="relative shrink-0" ref={selectorRef}>
            <button
              type="button"
              onClick={() => {
                const nextState = !isSelectorOpen;
                setIsSelectorOpen(nextState);
                if (nextState) setShowPreview(false);
              }}
              className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 text-xs font-bold text-gray-300 hover:text-white transition-colors focus:outline-none whitespace-nowrap"
            >
              <span className="inline-block w-12 text-left">{searchType === "clan" ? "클랜" : "플레이어"}</span>
              <i className={cn("fas fa-chevron-down text-[10px] transition-transform", isSelectorOpen && "rotate-180")}></i>
            </button>
          </div>

          <div className="w-px h-4 bg-gray-700/50 mx-1"></div>

          <input 
            ref={inputRef}
            type="text"
            maxLength={16}
            value={query}
            onChange={(e) => {
              const val = e.target.value.replace(/^\s+/, "");
              setQuery(val);
              const show = val.trim().length > 0;
              setShowPreview(show);
              if (show) setIsSelectorOpen(false);
            }}
            onFocus={() => {
              if (query.length > 0) {
                setShowPreview(true);
                setIsSelectorOpen(false);
              }
            }}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none text-white text-[13px] outline-none w-full placeholder:text-gray-500 font-medium px-2"
            placeholder={searchType === "player" ? "닉네임 입력..." : "클랜명 입력..."}
            autoComplete="off"
          />
          
          {(isSearching || (isLoadingResults && query.length > 0)) && (
            <Loader size="sm" className="mr-1" />
          )}
        </div>
      </div>

      {/* Layer for absolute dropdowns to avoid overflow-hidden of the bar */}
      <div className={cn("absolute right-12 h-10 pointer-events-none transition-all duration-500", isOpen ? "w-64 sm:w-80" : "w-0")}>
        <div className="relative w-full h-full">
          {/* Type Selector Dropdown */}
          {isSelectorOpen && (
            <ul className="absolute top-full left-2 mt-2 w-24 bg-[#1e2026] border border-gray-700/50 rounded-lg shadow-2xl py-1 z-60 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
              {(["player", "clan"] as const).map((type) => (
                <li
                  key={type}
                  onClick={() => {
                    setSearchType(type);
                    setIsSelectorOpen(false);
                    inputRef.current?.focus();
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs cursor-pointer transition-colors",
                    searchType === type ? "text-brand-500 bg-brand-500/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {type === "clan" ? "클랜" : "플레이어"}
                </li>
              ))}
            </ul>
          )}

          {/* Preview Results Dropdown */}
          {showPreview && query.length > 0 && !isSearching && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#1e2026]/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-auto">
              {isError ? (
                <div className="p-4 text-center text-xs text-red-400">오류가 발생했습니다.</div>
              ) : !results || results.length === 0 ? (
                !isLoadingResults && (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-xs">검색 결과가 없습니다.</p>
                  </div>
                )
              ) : (
                <ul className="divide-y divide-gray-800/50 overflow-y-auto max-h-64 scrollbar-hide">
                  {results.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleResultClick(item.id, item.name)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                    {searchType === "clan" ? (
                        <ClanLogo
                          clanName={item.name}
                          clanMarkUrl={item.clanMarkUrl ?? null}
                          clanBackMarkUrl={item.clanBackMarkUrl ?? null}
                          size="sm"
                          className="w-8 h-8 rounded-none shrink-0"
                        />
                      ) : item.clanName ? (
                        <ClanLogo
                          clanName={item.clanName}
                          clanMarkUrl={item.clanMarkUrl ?? null}
                          clanBackMarkUrl={item.clanBackMarkUrl ?? null}
                          size="sm"
                          className="w-8 h-8 rounded-none shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700 text-xs shrink-0">
                          <i className="fas fa-user"></i>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-brand-500 transition-colors truncate">
                          {item.name}
                        </p>
                        {searchType === "player" && (
                          <p className="text-[10px] text-gray-500 truncate">
                            {item.clanName ? item.clanName : "No Clan"}
                          </p>
                        )}
                      </div>
                      <i className="fas fa-chevron-right text-[10px] text-gray-600 group-hover:text-brand-500 transition-colors"></i>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      
      <button 
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-center transition-all duration-300 rounded-xl h-10 w-10 shrink-0",
          isOpen ? "text-brand-500 bg-[#1e2026]/90 ml-2" : "text-gray-400 hover:text-white"
        )}
      >
        <i className="fas fa-search transition-transform duration-300"></i>
      </button>
    </div>
  );
}
