"use client";
import React, { useEffect, useState } from "react";

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/myapis/trending-movies/"
        ); // Make sure this URL is correct
        const data = await response.json();
        setMovies(data.movies); // Adjust based on your JSON structure
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">Trending Movies</h2>
      <div className="flex overflow-x-auto space-x-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-none w-64 bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Use the poster_path here
              alt={movie.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {movie.overview.length > 100
                  ? `${movie.overview.substring(0, 100)}...`
                  : movie.overview}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
