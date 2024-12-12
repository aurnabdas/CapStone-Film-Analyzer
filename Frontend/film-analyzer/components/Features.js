"use client";
import Link from "next/link";

const Features = () => {
  const features = [
    {
      title: "Real-Time Emotion Tracking",
      description:
        "Track viewers' emotions as they watch movie trailers, providing insights into how scenes affect audiences in real-time.",
      link: "https://face-specs.vercel.app/",
      image: "/images/Icon One.png", // Replace with your icon image paths
    },
    {
      title: "Predictive Analytics",
      description:
        "Use historical data and real-time reactions to predict box office success before a movie hits theaters.",
      link: "/predictor",
      image: "/images/group1.png", // Replace with your icon image paths
    },
    {
      title: "Personalized Surveys",
      description:
        "Collect tailored feedback from viewers to understand what resonates with them and improve your films.",
      link: "/survey",
      image: "/images/group2.png", // Replace with your icon image paths
    },
  ];

  return (
    <section className="py-20 bg-[#450a0a] text-white body-font">
      <div className="container px-5 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">
            Want Better Movies?
          </h1>
          <p className="text-lg leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-300">
            We have the right tools for both users and studios alike where
            better movies can be produced and shipped out to theaters for them
            to be viewed.
          </p>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-gold inline-flex"></div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <button className="text-white bg-gold py-2 px-8 rounded-lg hover:bg-[#9b2222] transition duration-300">
            Learn More About Our Tools
          </button>
        </div>
      </div>
    </section>
  );
};

function FeatureCard({ feature }) {
  return (
    <div className="flex flex-col text-center items-center bg-[#7E1328] shadow-lg rounded-lg overflow-hidden border border-gold transition-transform transform hover:scale-105 hover:shadow-[0_0_20px_10px_rgba(255,223,0,0.9)] px-6 py-8">
      <img
        src={feature.image}
        alt={feature.title}
        className="w-24 h-24 object-contain invert" // Larger size and white color
      />
      <div className="mt-4">
        <h2 className="text-2xl font-medium text-gold mb-3">{feature.title}</h2>
        <p
          className="text-gray-300 text-sm mx-auto"
          style={{ maxWidth: "250px" }}
        >
          {feature.description}
        </p>
        <Link
          href={feature.link}
          className="mt-3 text-gold inline-flex items-center font-semibold hover:underline"
        >
          Learn More →
        </Link>
      </div>
    </div>
  );
}

export default Features;
