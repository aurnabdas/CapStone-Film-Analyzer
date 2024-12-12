import Link from "next/link";
import Team from "../../components/Team";
import NavBar from "../../components/NavBar";

const AboutUs = () => {
  return (
    <div className="bg-[#450a0a] min-h-screen text-white body-font">
      <NavBar /> {/* NavBar with the same background */}
      <div className="container px-5 py-24 mx-auto">
        {/* Why We Made This Project */}
        <div className="flex flex-col text-center w-full mb-12 bg-[#7E1328] rounded-lg p-8 shadow-lg border border-gold transition-transform transform hover:scale-105">
          <h1 className="text-3xl font-bold text-gold mb-6 tracking-wide">
            WHY WE MADE THIS PROJECT
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-lg text-gray-300">
            Our Film Analyzer project was built specifically for movie studios
            seeking a better understanding of audience reactions to their
            trailers. By combining AI-driven insights with real-time audience
            feedback, this tool allows studios to gauge interest, predict box
            office success, and understand emotional engagement at key moments.
          </p>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-lg mt-4 text-gray-300">
            With features like emotion tracking, AI-generated questions, and
            custom surveys, Film Analyzer empowers studios to tailor their
            marketing strategies, determine sequel potential, and make
            data-backed decisions on future projects.
          </p>
        </div>
        {/* Who Can Use This Website */}
        <div className="flex flex-col text-center w-full mb-12 bg-[#7E1328] rounded-lg p-8 shadow-lg border border-gold transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-bold text-gold mb-6 tracking-wide">
            WHO CAN USE THIS WEBSITE
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-lg text-gray-300">
            This platform is designed for both movie studios and everyday users.
            Movie studios can leverage Film Analyzer to gain deep insights into
            how audiences react to their trailers, helping them refine marketing
            strategies, make data-driven decisions, and improve their content.
          </p>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-lg mt-4 text-gray-300">
            For regular users, Film Analyzer serves as a hub to explore upcoming
            movies, watch trailers, and learn more about films through reviews
            and ratings. Users can dive into details, get a sense of movie
            trends, and even contribute their own feedback on trailers, making
            it an engaging experience for movie enthusiasts and researchers
            alike.
          </p>
        </div>
        {/* Team Section */}
        <Team /> {/* Same styled Team.js component */}
      </div>
    </div>
  );
};

export default AboutUs;
