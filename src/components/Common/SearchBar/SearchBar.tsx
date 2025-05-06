import { useEffect, useState, useRef } from 'react';
import styles from './SearchBar.module.scss';
import clsx from 'clsx';
import useDebounce from '../../../Utils/useDebounce';
import SearchIcon from '../../../assets/SearchIcon';

interface SearchBoxProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    onSearch,
    placeholder = 'Search by Company/Lender Name (Min 3 char)',
}) => {
    const [queryText, setQueryText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const debouncedQueryText = useDebounce(queryText.trim(), 300);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                if (queryText.length === 0) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [queryText]);

    useEffect(() => {
        if (debouncedQueryText.length >= 3) {
            handleSearch(debouncedQueryText);
            setHasSearched(true);
            setIsExpanded(true);
        } else if (debouncedQueryText.length === 0 && hasSearched) {
            handleSearch('');
            setHasSearched(false);
            // Keep expanded even when search is cleared
            setIsExpanded(true);
        }
    }, [debouncedQueryText]);

    const handleSearch = (query: string) => {
        // Ensure we're expanded when searching
        if (query.length > 0) {
            setIsExpanded(true);
        }
        onSearch(query);
    };

    const handleTextSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQueryText(value);
    };

    const handleExpandSearch = () => {
        setIsExpanded(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
    };

    const handleCollapseSearch = () => {
        setIsExpanded(false);
        // Always reset search when collapsing
        setQueryText('');
        handleSearch('');
        setHasSearched(false);
    };

    return (
        <div
        className={clsx(styles.searchBox, {
            [styles.expanded]: isExpanded,
        })}
            ref={searchBoxRef}
        >
            <div
                className={clsx(styles.boxWrapper, {
                    [styles.expanded]: isExpanded,
                })}
                onClick={!isExpanded ? handleExpandSearch : undefined}
            >
                <input
                    ref={inputRef}
                    className={clsx(styles.searchInput, {
                        [styles.HasData]: !!queryText,
                        [styles.collapsed]: !isExpanded,
                    })}
                    type="text"
                    onChange={handleTextSearch}
                    value={queryText}
                    placeholder={isExpanded ? placeholder : ''}
                    disabled={!isExpanded}
                />
                {isExpanded ? (
                    <img alt="Cancel Icon" src={"https://fl-fe-assets.s3.ap-south-1.amazonaws.com/png/searchCut.png"} className={styles.cancelIcon} onClick={handleCollapseSearch} />
                ) : (
                    <SearchIcon
                        className={clsx(styles.searchIcon, {
                            [styles.iconBadge]: !isExpanded,
                        })}
                        onClick={!isExpanded ? handleExpandSearch : undefined}
                    />
                )}
            </div>
        </div>
    );
};

export default SearchBox;
