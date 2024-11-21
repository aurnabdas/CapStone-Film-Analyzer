"use client";

import { useState } from "react";

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movie, setMovie] = useState(null); // Store a single movie
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setError(""); // Clear any existing errors

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/myapis/search-movie?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.movies.length > 0) {
          setMovie(data.movies[0]); // Get the first movie result
        } else {
          setError("No movies found for your search.");
          setMovie(null);
        }
      } else {
        setError("Failed to fetch movie details. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while fetching movie details.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "linear-gradient(to bottom, #450a0a, #7E1328)",
      }}
    >
      <div className="bg-black bg-opacity-70 text-white p-8 rounded-lg shadow-lg w-4/5 md:w-3/5 lg:w-2/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold">Movie Search</h1>
          <p className="text-gray-300 mt-2">
            Find detailed information about your favorite movies.
          </p>
        </div>
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gold bg-gray-800 text-white"
            placeholder="Enter movie name..."
          />
          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-gradient-to-r from-[#D5A036] to-[#FFC107] text-[#450a0a] font-semibold py-2 px-6 rounded-md hover:from-[#FFC107] hover:to-[#E8C547] transition-all duration-200 shadow-lg"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        {movie && (
          <div className="text-center">
            <div className="flex flex-col md:flex-row items-center">
              {/* Movie Poster */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-md shadow-lg"
              />
              <div className="md:ml-6 mt-4 md:mt-0 text-left">
                {/* Movie Details */}
                <h2 className="text-2xl font-bold text-gold">{movie.title}</h2>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Overview:</span>{" "}
                  {movie.overview}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Popularity:</span>{" "}
                  {movie.popularity}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Release Date:</span>{" "}
                  {movie.release_date}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Rating:</span>{" "}
                  {movie.vote_average} ({movie.vote_count} votes)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
