import Link from "next/link";
import Team from "../../components/Team";
import NavBar from "../../components/NavBar";

const AboutUs = () => {
  return (
    <div className="bg-[#7A1C23] min-h-screen text-white body-font">
      <NavBar /> {/* NavBar with matching red background */}
      
      <div className="flex flex-col items-center justify-center">
        <section className="w-full">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20 bg-[#7A1C23] rounded-lg p-8 shadow-lg">
              <h1 className="text-2xl font-medium title-font mb-4 tracking-widest" style={{ color: '#D4A03A' }}>
                WHY WE MADE THIS PROJECT
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                Our Film Analyzer project was built specifically for movie studios seeking a better understanding of audience reactions to their trailers. By combining AI-driven insights with real-time audience feedback, this tool allows studios to gauge interest, predict box office success, and understand emotional engagement at key moments. With features like emotion tracking, AI-generated questions, and custom surveys, Film Analyzer empowers studios to tailor their marketing strategies, determine sequel potential, and make data-backed decisions on future projects.
              </p>
            </div>

            <div className="flex flex-col text-center w-full mb-10 bg-[#7A1C23] rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-medium title-font mb-4 tracking-widest" style={{ color: '#D4A03A' }}>
                WHO CAN USE THIS WEBSITE
              </h2>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
                This platform is designed for both movie studios and everyday users. Movie studios can leverage Film Analyzer to gain deep insights into how audiences react to their trailers, helping them refine marketing strategies, make data-driven decisions, and improve their content.
              </p>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base mt-4 text-white">
                For regular users, Film Analyzer serves as a hub to explore upcoming movies, watch trailers, and learn more about films through reviews and ratings. Users can dive into details, get a sense of movie trends, and even contribute their own feedback on trailers, making it an engaging experience for movie enthusiasts and researchers alike.
              </p>
            </div>
          </div>

          <Team /> {/* This will render the Team component below the AboutUs content */}
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
