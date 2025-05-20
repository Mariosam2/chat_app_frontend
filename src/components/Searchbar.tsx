import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { chatApi } from "../helpers/axiosInterceptor";
import { useEffect, useState } from "react";
import lodash from "lodash";
import type { MessageSearchResult, User } from "../types";
import noResultsImg from "../assets/no-results.png";
import "./Searchbar.css";
import { useDispatch } from "react-redux";
import { clickResult, isSearching, setQuery } from "../slices/searchSlice";
import { useSelector } from "react-redux";
import type { RootState } from "..";

interface SearchResponse {
  success: boolean;
  results: {
    users: User[];
    messages: MessageSearchResult[];
  };
}

interface SearchbarProps {
  authUser: User | null;
}

const Searchbar = ({ authUser }: SearchbarProps) => {
  const dispatch = useDispatch();
  const { query, clickedResult } = useSelector(
    (state: RootState) => state.searchState
  );
  const [searchResults, setSearchResults] = useState<{
    users: User[];
    messages: MessageSearchResult[];
  } | null>(null);

  const search = (query: string) => {
    if (query.trim() !== "") {
      chatApi
        .get<SearchResponse>(`/api/search/${authUser?.uuid}?query=${query}`)
        .then((res) => {
          if (res.data.success) {
            setSearchResults(res.data.results);
          }
        })
        .catch((err) => {
          if (err) {
            setSearchResults(null);
          }
        });
    } else {
      setSearchResults(null);
    }
  };
  useEffect(() => {
    window.addEventListener("click", (e: MouseEvent) => {
      const searchbar = document.querySelector(".searchbar");
      const target = e.target as Node;
      //console.log(target);
      if (searchbar && !searchbar?.contains(target)) {
        setSearchResults(null);
        dispatch(isSearching(false));
      }
    });
  }, []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const [debouncedSearch] = useState(() => lodash.debounce(search, 250));

  const handleClickOnResult = (result: User | MessageSearchResult) => {
    dispatch(clickResult(result));
    dispatch(isSearching(false));
    dispatch(setQuery(""));
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (clickedResult !== null) {
      dispatch(clickResult(null));
    }
    dispatch(isSearching(true));
    const changedQuery = e.target.value;
    dispatch(setQuery(changedQuery));
  };

  const highlightMatch = (string: string, query: string) => {
    const newBody = string.replace(
      new RegExp(query, "gi"),
      (match) =>
        `<mark style="font-weight: 700; background-color:transparent;">${match}</mark>`
    );

    return { __html: newBody };
  };

  const ShowUsers = () => {
    if (searchResults && searchResults.users.length > 0) {
      return (
        <div className="users  p-4 md:px-2 xl:px-4">
          <h2 className="text-xl xxs:text-2xl mb-6 xxs:mb-8 ps-2 font-semibold">
            Discover
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 max-h-[200px] overflow-y-auto">
            {searchResults?.users?.map((result, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleClickOnResult(result)}
                  className="result  h-fit flex items-center p-2"
                >
                  <img
                    className="w-[40px] aspect-square  rounded-full"
                    src={import.meta.env.VITE_BASE_URL + result.profile_picture}
                    alt=""
                  />
                  <div
                    dangerouslySetInnerHTML={highlightMatch(
                      result.username,
                      query
                    )}
                    className="username ms-3 font-light"
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const ShowMessages = () => {
    if (searchResults && searchResults.messages.length > 0) {
      return (
        <div
          className={`messages ${
            searchResults.users.length > 0 ? "border-t border-ms-muted" : ""
          } p-4 md:px-2 xl:px-4 `}
        >
          <h2 className="text-xl xxs:text-2xl mb-6 xxs:mb-8 ps-2 font-semibold">
            Your chats
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 max-h-[200px] overflow-y-auto md:grid-cols-1 xl:grid-cols-2">
            {searchResults?.messages?.map((result, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleClickOnResult(result)}
                  className={`result p-2  py-4 me-2 xs:me-0 md:me-2 xl:me-0 ${
                    index === 0
                      ? "border-y xs:border-y-0 md:border-y xl:border-y-0"
                      : "border-b xs:border-b-0 md:border-b xl:border-b-0"
                  }  border-ms-muted`}
                >
                  <div className="flex items-center pb-1">
                    <img
                      className="w-[40px] aspect-square  rounded-full"
                      src={
                        import.meta.env.VITE_BASE_URL +
                        result.user?.profile_picture
                      }
                      alt=""
                    />
                    <div className="username ms-3 font-light">
                      {result.user?.username}
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={highlightMatch(
                      result.content,
                      query
                    )}
                    className="content font-light pt-2 wrap-break-word"
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const ShowNoResults = () => {
    if (
      (searchResults &&
        searchResults.users.length === 0 &&
        searchResults.messages.length === 0) ||
      searchResults == null
    ) {
      return (
        <div className="no-results flex items-center px-2">
          <img className="size-10 p-1 ms-2" src={noResultsImg} alt="" />
          <span className="block px-2"> No results for this search</span>
        </div>
      );
    }
  };

  const ShowSearchResults = () => {
    if (searchResults !== null) {
      return (
        <div
          className={`search-results absolute z-10 left-0 top-[100%] translate-y-[5px]  bg-ms-dark w-full flex flex-col text-ms-almost-white py-4 rounded-2xl`}
        >
          <ShowUsers />
          <ShowMessages />
          <ShowNoResults />
        </div>
      );
    }
  };

  return (
    <>
      <div className="searchbar-container px-2 pb-4 md:pb-0 xxs:px-6 md:px-4 w-full  col-span-1 row-span-1 row-start-2 md:row-start-1 md:col-start-7 md:col-span-4 md:me-4 lg:col-span-4 lg:col-start-6 lg:me-0  2xl:col-start-5">
        <div className="searchbar h-[40px]    bg-ms-dark rounded-xl p-2 text-ms-muted flex items-center relative ">
          <MagnifyingGlassIcon className="size-5 me-1 " />
          <input
            onChange={handleQueryChange}
            className="p-1 flex-grow focus:outline-none"
            placeholder="Search..."
            type="text"
            name="search"
            id="search"
            autoComplete="off"
            value={query}
          />
          <ShowSearchResults />
        </div>
      </div>
    </>
  );
};

export default Searchbar;
