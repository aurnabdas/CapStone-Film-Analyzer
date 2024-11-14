"use client";
import React, { useEffect, useState } from "react";

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/myapis/trending-movies/"
        );
        const data = await response.json();
        setMovies(data.movies);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-[#450a0a]">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-gold text-center mb-6">
          Trending Movies
        </h2>
        <div className="flex overflow-x-auto scrollbar-hide space-x-6 px-4 py-8 overflow-visible">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full mt-10">
        <div
          className="border-t border-gold mx-auto opacity-70"
          style={{ backgroundColor: "#450a0a", height: "2px", width: "100%" }}
        ></div>
      </div>
    </div>
  );
}

function MovieCard({ movie }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="flex-none w-64 bg-[#7E1328] shadow-lg rounded-lg overflow-hidden border border-gold relative group transition-all duration-300 transform hover:scale-110 hover:translate-y-[-5px] hover:shadow-[0_0_20px_10px_rgba(255,223,0,0.9)] hover:bg-[#9b2222]">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-80 object-cover"
      />
      <div className="p-4 text-white">
        <h3 className="text-lg font-bold text-gold">{movie.title}</h3>
        <p className="text-gray-300 text-sm mt-2">
          {showFullDescription
            ? movie.overview
            : movie.overview.length > 100
            ? `${movie.overview.substring(0, 100)}...`
            : movie.overview}
        </p>
      </div>
      {/* Read More Button */}
      <button
        onClick={() => setShowFullDescription(!showFullDescription)}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {showFullDescription ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
