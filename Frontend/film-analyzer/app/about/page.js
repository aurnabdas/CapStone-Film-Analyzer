import Link from "next/link";
import Image from "next/image";
import Team from "../../components/Team";
import NavBar from "../../components/NavBar";
import jokerImage from "../../public/images/Joker2.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen text-white relative">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/images/clapperboard.jpg')" }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 bg-black bg-opacity-90">
        {/* NavBar */}
        <NavBar />

        {/* Header Section */}
        <section className="h-[500px] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold text-gold mb-4">
              About Film Analyzer
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how Film Analyzer combines cutting-edge AI and audience
              insights to help studios and film enthusiasts connect with movies
              like never before.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container px-6 py-16 mx-auto">
          {/* How It Started */}
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gold mb-8">
              How It Started
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Who is the App For */}
              <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-semibold text-gold mb-4">
                  Who is the App For?
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Film Analyzer is designed for both movie studios and movie
                  enthusiasts. Studios can use AI-driven tools to analyze
                  real-time audience reactions, helping refine marketing
                  strategies, measure trailer impact, and predict box office
                  success.
                  <br />
                  For movie lovers, Film Analyzer provides a space to explore
                  upcoming films, share their opinions, and influence the
                  industry with their feedback.
                </p>
              </div>

              {/* Why Us */}
              <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-2xl font-semibold text-gold mb-4">
                  Why Us?
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Our platform stands out by combining AI-powered insights,
                  emotion tracking, and interactive surveys. We go beyond
                  traditional feedback by capturing emotional engagement and
                  providing actionable insights that help studios make informed
                  decisions to maximize box office results.
                  <br />
                  With tools like predictive analytics, AI-generated questions,
                  and real-time audience feedback, Film Analyzer bridges the gap
                  between studios and viewers.
                </p>
              </div>
            </div>
          </section>

          {/* Joker 2 Section */}
          <section className="flex flex-col lg:flex-row items-center bg-[#1A1A1A] rounded-lg p-8 shadow-lg mb-16">
            {/* Text Content */}
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0 px-4">
              <h2 className="text-3xl font-bold text-gold mb-4">
                Let's Take a Look at Joker 2
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Joker 2 had high expectations and promising box office
                projections. However, its release revealed a disconnect between
                audience expectations and the film’s actual content. This
                highlights the value of Film Analyzer, which enables studios to
                collect emotional feedback and predict potential pitfalls during
                marketing campaigns.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-2xl font-bold text-gold">$60M</h3>
                  <p className="text-gray-300">Projected Nationwide</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">$85M</h3>
                  <p className="text-gray-300">Projected Overseas</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">$200M</h3>
                  <p className="text-gray-300">Budget</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-500">-125M</h3>
                  <p className="text-gray-300">Net Profit</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="lg:w-1/2 w-full flex justify-center">
              <Image
                src={jokerImage}
                alt="Joker 2 Movie"
                className="rounded-lg shadow-md object-cover"
                width={500}
                height={300}
                priority
              />
            </div>
          </section>

          {/* Team Section */}
          <Team />
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Film Analyzer. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
