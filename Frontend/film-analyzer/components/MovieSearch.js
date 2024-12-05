"use client";

import { useState } from "react";

const OMDBSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movie, setMovie] = useState(null); // Store movie details
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/myapis/search-omdb-movie-with-backdrop?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.movie) {
          setMovie(data.movie); // Save movie data
        } else {
          setError("No movie found for your search.");
          setMovie(null);
        }
      } else {
        setError("Failed to fetch movie details. Please try again.");
        setMovie(null);
      }
    } catch (err) {
      setError("An error occurred while fetching movie details.");
      setMovie(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: movie
          ? `url(${movie.Backdrop})` // Use the backdrop image from TMDB
          : "linear-gradient(to bottom, #450a0a, #7E1328)", // Default background
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black bg-opacity-70 text-white p-8 rounded-lg shadow-lg w-4/5 md:w-3/5 lg:w-2/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gold">OMDB Movie Search</h1>
          <p className="text-gray-300 mt-2">
            Search for movies and see detailed information about them.
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
                src={movie.Poster}
                alt={movie.Title}
                className="w-48 h-72 object-cover rounded-md shadow-lg"
              />
              <div className="md:ml-6 mt-4 md:mt-0 text-left">
                {/* Movie Details */}
                <h2 className="text-2xl font-bold text-gold">{movie.Title}</h2>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Year:</span> {movie.Year}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Rated:</span> {movie.Rated}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Released:</span>{" "}
                  {movie.Released}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Runtime:</span>{" "}
                  {movie.Runtime}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Genre:</span> {movie.Genre}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Director:</span>{" "}
                  {movie.Director}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="font-semibold">Plot:</span> {movie.Plot}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OMDBSearch;
