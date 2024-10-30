import Head from 'next/head';
import Link from 'next/link';
import NavBar from '../components/NavBar'; // Import the NavBar component
import Features from '../components/Features';
import Hero from '../components/Hero';
import Team from '../components/Team';
import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <section>
      <Head>
        <title>Movie Predictor</title>
        <meta name="description" content="Predict movie hits and misses" />
      </Head>

      {/* NavBar Component */}
      <NavBar />

    
    <Hero/>
    <Features/>
    {/* <Team/> */}
    <ContactForm/>
    </section>
  );
}