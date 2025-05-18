import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceTime?: number;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Поиск...',
  debounceTime = 300,
  initialValue = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, debounceTime),
    [onSearch, debounceTime]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      {searchQuery && (
        <button className="clear-button" onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar; 