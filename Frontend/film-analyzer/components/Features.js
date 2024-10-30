import Link from "next/link";
import ContactForm from '../components/ContactForm'

const Features = () => {
  return (
    <section className="bg-[url('../public/images/red_curtains.jpeg')] bg-cover bg-center h-screen text-white body-font flex items-center justify-center">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-[100px] font-bold text-[#D5A036] mb-4">Want Better Movies?</h1>
          <p className="text-[24px] leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-white">
            We have the right tools for both users and studios alike where better movies can be produced and shipped out to theaters for them to be viewed.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-[#D5A036] inline-flex"></div>
          </div>
        </div>
        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6 justify-center">
          {/* Real-Time Emotion Tracking Feature */}
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center bg-black bg-opacity-50 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-5 flex-shrink-0">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="flex-grow">
              <h2 className="text-[#D5A036] text-[36px] font-medium mb-3">Real-Time Emotion Tracking</h2>
              <p className="text-[18px] leading-relaxed text-white">
                Track viewers' emotions as they watch movie trailers, providing insights into how scenes affect audiences in real-time.
              </p>
              <Link href="/review" className="mt-3 text-[#FFD700] inline-flex items-center">
                Start Tracking Emotions →
              </Link>
            </div>
          </div>

          {/* Predictive Analytics Feature */}
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center bg-black bg-opacity-50 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-5 flex-shrink-0">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10"
                viewBox="0 0 24 24"
              >
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
              </svg>
            </div>
            <div className="flex-grow">
              <h2 className="text-[#D5A036] text-[36px] font-medium mb-3">Predictive Analytics</h2>
              <p className="text-[18px] leading-relaxed text-white">
                Use historical data and real-time reactions to predict box office success before a movie hits theaters.
              </p>
              <Link href="/predictor" className="mt-3 text-[#FFD700] inline-flex items-center">
                Predict Movie Success →
              </Link>
            </div>
          </div>

          {/* Personalized Surveys Feature */}
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center bg-black bg-opacity-50 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-5 flex-shrink-0">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="flex-grow">
              <h2 className="text-[#D5A036] text-[36px] font-medium mb-3">Personalized Surveys</h2>
              <p className="text-[18px] leading-relaxed text-white">
                Collect tailored feedback from viewers to understand what resonates with them and improve your films.
              </p>
              <Link href="/survey" className="mt-3 text-[#FFD700] inline-flex items-center">
                Get Viewer Feedback →
              </Link>
            </div>
          </div>
        </div>
        <button className="flex mx-auto mt-16 text-white bg-[#D5A036] border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg">
          Learn More About Our Tools
        </button>
        
      </div>
    </section>
  );
};

export default Features;