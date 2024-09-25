// pages/index.js
import Head from 'next/head';
import Link from 'next/link'; // Import the Link component
import { StateProvider } from '../context/StateContext';

export default function Home() {
  return (
    <div className="bg-steel-gray min-h-screen text-gold p-10">
      <Head>
        <title>Movie Predictor</title>
        <meta name="description" content="Predict movie hits and misses" />
      </Head>

      <header className="flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-gold">Movie Predictor</div>
        <nav className="space-x-4">
          <Link href="/" className="text-gold">Home</Link>
          <Link href="/about" className="text-gold">About Us</Link>
          <Link href="/login">
            <button className="bg-red-theme text-white px-4 py-2 rounded">Sign In</button>
          </Link>
          <Link href="/signup">
            <button className="bg-gold text-white px-4 py-2 rounded">Register</button>
          </Link>
          
        </nav>
      </header>

      <main className="text-center mt-16">
        <h1 className="text-4xl mb-6">Welcome to the Movie Predictor</h1>
        <p className="mb-4">Stay updated on the latest box office performances and see how current movies are doing in theaters.</p>
        <button className="bg-red-theme text-white px-6 py-3 rounded mb-4">Current Movies</button>
        <p className="mb-4">Or dive into the future with our advanced model, trained on over two decades of data, to predict whether upcoming films will be a hit or miss.</p>
        <button className="bg-red-theme text-white px-6 py-3 rounded mb-4">Predictions</button>
        <p className="mb-4">Track your emotions as you watch and share your thoughts with our Facial Review feature.</p>

          
        <Link href="/review">
        <button className="bg-red-theme text-white px-6 py-3 rounded mb-8">Write A Review</button>
        </Link>

        <Link href="/survey">
        <button className="bg-red-theme text-white px-6 py-3 rounded mb-8">Make A Survey</button>
        </Link>


        <h2 className="text-2xl mb-6">Our Top Predictions Right Now:</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-700 p-4 rounded">
            <div className="bg-gray-400 h-40 mb-4"></div>
            <p>Movie Name</p>
            <p>Hit or Miss</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <div className="bg-gray-400 h-40 mb-4"></div>
            <p>Movie Name</p>
            <p>Hit or Miss</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <div className="bg-gray-400 h-40 mb-4"></div>
            <p>Movie Name</p>
            <p>Hit or Miss</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <div className="bg-gray-400 h-40 mb-4"></div>
            <p>Movie Name</p>
            <p>Hit or Miss</p>
          </div>
        </div>
      </main>
    </div>
  );
}
