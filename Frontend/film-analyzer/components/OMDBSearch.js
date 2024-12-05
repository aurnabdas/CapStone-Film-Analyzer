"use client";

import { useState, useEffect } from "react";

const OMDBSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movie, setMovie] = useState(null);
  const [backdrop, setBackdrop] = useState("");
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(true); // Toggle search bar visibility
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Toggle autocomplete suggestions

  // Load recent searches from localStorage
  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  const updateRecentSearches = (newSearch) => {
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((s) => s !== newSearch),
    ].slice(0, 3);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleSearch = async (query) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setError("");

    try {
      // Fetch backdrop from TMDB
      const tmdbResponse = await fetch(
        `http://127.0.0.1:8000/myapis/search-movie?query=${encodeURIComponent(
          searchTerm
        )}`
      );

      if (tmdbResponse.ok) {
        const tmdbData = await tmdbResponse.json();
        if (tmdbData.movies.length > 0) {
          const backdropPath = tmdbData.movies[0]?.backdrop_path;
          setBackdrop(
            backdropPath
              ? `https://image.tmdb.org/t/p/original${backdropPath}`
              : ""
          );
        } else {
          setBackdrop("");
        }
      } else {
        setBackdrop("");
        setError("Failed to fetch the backdrop image.");
      }

      // Fetch movie details from OMDB
      const omdbResponse = await fetch(
        `http://127.0.0.1:8000/myapis/search-omdb-movie?query=${encodeURIComponent(
          searchTerm
        )}`
      );

      if (omdbResponse.ok) {
        const omdbData = await omdbResponse.json();
        if (omdbData.movie) {
          setMovie(omdbData.movie); // Store movie details
          setShowSearch(false); // Hide search bar after successful search
          updateRecentSearches(searchTerm); // Add to recent searches
        } else {
          setMovie(null);
          setError("No movie found for your search.");
        }
      } else {
        setMovie(null);
        setError("Failed to fetch movie details. Please try again.");
      }
    } catch (err) {
      setBackdrop("");
      setMovie(null);
      setError("An error occurred while fetching movie details.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{
        backgroundImage: backdrop
          ? `url(${backdrop})`
          : "linear-gradient(to bottom, #450a0a, #7E1328)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Wrapper for search and movie details */}
      <div
        className={`${
          movie
            ? "w-4/5 md:w-3/5 lg:w-2/5 mt-10"
            : "flex items-center justify-center min-h-screen"
        }`}
      >
        {showSearch && (
          <div className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg w-full">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gold">
                OMDB Movie Search
              </h1>
              <p className="text-gray-300 mt-2">
                Search for movies and see detailed information about them.
              </p>
            </div>
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay hiding to allow click
                className="w-full px-4 py-2 rounded-full border-2 border-gradient-to-r from-[#FFC107] to-[#D5A036] focus:outline-none focus:ring focus:ring-gold bg-gray-900 text-white placeholder-gray-400 text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                placeholder="Search for your favorite movie..."
              />
              <button
                onClick={() => handleSearch()}
                className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-[#D5A036] to-[#FFC107] text-[#450a0a] font-bold text-lg py-2 px-6 rounded-full hover:from-[#FFC107] hover:to-[#E8C547] transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Search
              </button>

              {/* Autocomplete Suggestions */}
              {showSuggestions && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-lg">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-700 hover:cursor-pointer"
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch(search);
                      }}
                    >
                      {search}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
      </div>

      {/* Movie Details Section */}
      {movie && (
        <div className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg w-4/5 md:w-3/5 lg:w-2/5 mt-10 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-gold mb-6">{movie.Title}</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center w-full">
            {/* Movie Poster */}
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-64 h-auto object-cover rounded-md shadow-lg mb-4 md:mb-0 md:mr-6"
            />
            {/* Movie Details */}
            <div className="text-lg leading-relaxed">
              <p>
                <strong>Year:</strong> {movie.Year}
              </p>
              <p>
                <strong>Rated:</strong> {movie.Rated}
              </p>
              <p>
                <strong>Released:</strong> {movie.Released}
              </p>
              <p>
                <strong>Runtime:</strong> {movie.Runtime}
              </p>
              <p>
                <strong>Genre:</strong> {movie.Genre}
              </p>
              <p>
                <strong>Director:</strong> {movie.Director}
              </p>
              <p>
                <strong>Writer:</strong> {movie.Writer}
              </p>
              <p>
                <strong>Actors:</strong> {movie.Actors}
              </p>
              <p>
                <strong>Language:</strong> {movie.Language}
              </p>
              <p>
                <strong>Country:</strong> {movie.Country}
              </p>
              <p>
                <strong>Awards:</strong> {movie.Awards}
              </p>
              <p>
                <strong>Box Office:</strong> {movie.BoxOffice}
              </p>
              <p>
                <strong>IMDb Rating:</strong> {movie.imdbRating} (
                {movie.imdbVotes} votes)
              </p>
            </div>
          </div>
          <div className="mt-6 w-full">
            <h3 className="text-2xl font-bold text-gold mb-2">Plot</h3>
            <p className="text-lg">{movie.Plot}</p>
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="mt-6 bg-gradient-to-r from-[#FFC107] to-[#D5A036] text-[#450a0a] font-semibold py-2 px-6 rounded-md hover:from-[#D5A036] hover:to-[#FFC107] transition-all duration-200 shadow-lg flex items-center"
          >
            Search Another Movie
          </button>
        </div>
      )}
    </div>
  );
};

export default OMDBSearch;
