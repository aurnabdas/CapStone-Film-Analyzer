"use client";

import { useState, useEffect } from "react";
import NavBar from "./NavBar";

const OMDBSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movie, setMovie] = useState(null);
  const [backdrop, setBackdrop] = useState("");
  const [overview, setOverview] = useState(""); // Overview from TMDB
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [recommendedMovies, setRecommendedMovies] = useState([]); // For recommended movies

  const fetchRecommendedMovies = async (movieId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/myapis/get-recommended-movies/${movieId}/`
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendedMovies(data.recommended_movies || []);
      } else {
        setRecommendedMovies([]);
        console.error("Failed to fetch recommended movies.");
      }
    } catch (err) {
      console.error(
        "An error occurred while fetching recommended movies:",
        err
      );
      setRecommendedMovies([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setError("");

    try {
      // Fetch backdrop and overview from TMDB
      const tmdbResponse = await fetch(
        `http://127.0.0.1:8000/myapis/search-movie?query=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (tmdbResponse.ok) {
        const tmdbData = await tmdbResponse.json();
        if (tmdbData.movies.length > 0) {
          const movieDetails = tmdbData.movies[0];
          setBackdrop(
            movieDetails.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`
              : ""
          );
          setOverview(movieDetails.overview || "No overview available."); // Set overview
          await fetchRecommendedMovies(movieDetails.id); // Fetch recommended movies based on TMDB movie ID
        } else {
          setBackdrop("");
          setOverview("");
        }
      } else {
        setBackdrop("");
        setOverview("");
        setError("Failed to fetch the backdrop image and overview.");
      }

      // Fetch other movie details from OMDB
      const omdbResponse = await fetch(
        `http://127.0.0.1:8000/myapis/search-omdb-movie?query=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (omdbResponse.ok) {
        const omdbData = await omdbResponse.json();
        if (omdbData.movie) {
          setMovie(omdbData.movie); // Store movie details
          setShowSearch(false); // Hide search bar after successful search
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
      setOverview("");
      setMovie(null);
      setError("An error occurred while fetching movie details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-[60px]">
      <NavBar />
      {/* Search Section */}
      {showSearch && (
        <div className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg w-4/5 md:w-3/5 lg:w-2/5 mx-auto mt-10">
          <div className="text-center mb-4">
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
              className="w-full px-4 py-2 rounded-full border-2 border-gradient-to-r from-[#FFC107] to-[#D5A036] focus:outline-none focus:ring focus:ring-gold bg-gray-900 text-white placeholder-gray-400 text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              placeholder="Search for your favorite movie..."
            />
            <button
              onClick={handleSearch}
              className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-[#D5A036] to-[#FFC107] text-[#450a0a] font-bold text-lg py-2 px-6 rounded-full hover:from-[#FFC107] hover:to-[#E8C547] transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}

      {/* Movie Details Section */}
      {movie && (
        <div className="relative w-full h-[60vh] bg-black bg-opacity-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: `url(${backdrop})`,
            }}
          ></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 max-w-5xl mx-auto">
            {/* Poster */}
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-64 h-auto rounded-lg shadow-lg"
            />
            {/* Movie Details */}
            <div className="text-white">
              <h1 className="text-4xl font-bold">{movie.Title}</h1>
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
              <p>
                <strong>Overview:</strong> {overview}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Movies Section */}
      {recommendedMovies.length > 0 && (
        <div className="bg-[#450a0a] py-8">
          <h2 className="text-center text-3xl font-bold text-gold mb-6">
            You May Also Like
          </h2>
          <div className="flex overflow-x-auto space-x-6 px-4 scrollbar-hide">
            {recommendedMovies.map((recMovie) => (
              <div
                key={recMovie.id}
                className="flex-none w-48 bg-[#7E1328] shadow-lg rounded-lg overflow-hidden border border-gold relative group transition-all duration-300 transform hover:scale-110 hover:translate-y-[-5px] hover:shadow-[0_0_20px_10px_rgba(255,223,0,0.9)] hover:bg-[#9b2222]"
              >
                {/* Poster */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${recMovie.poster_path}`}
                  alt={recMovie.title}
                  className="w-full h-64 object-cover"
                />
                {/* Movie Details */}
                <div className="p-3 text-white">
                  <h3 className="text-md font-bold text-gold truncate">
                    {recMovie.title}
                  </h3>
                  <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                    {recMovie.overview?.length > 100
                      ? `${recMovie.overview.substring(0, 100)}...`
                      : recMovie.overview || "No description available."}
                  </p>
                </div>
                {/* "View Details" Button on Hover */}
                <button
                  onClick={() => alert(`More info about ${recMovie.title}`)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OMDBSearch;
