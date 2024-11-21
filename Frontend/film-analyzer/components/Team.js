import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const teamData = [
  {
    id: 1,
    name: "Aurnab Das",
    designation: "FullStack Developer",
    image: "/images/aurnab.jpeg",
    linkedin: "https://www.linkedin.com/in/aurnabdas/", // Add Aurnab's LinkedIn URL here
  },
  {
    id: 2,
    name: "Mahathir Rojan",
    designation: "FrontEnd Developer & Designer",
    image: "/images/mahathir.jpeg",
    linkedin: "https://www.linkedin.com/in/m-rojan/", // Add Mahathir's LinkedIn URL here
  },
  {
    id: 3,
    name: "Muhammed Cheema",
    designation: "Backend Developer",
    image: "/images/cheema.jpeg",
    linkedin: "https://www.linkedin.com/in/muhammed-cheema/", // Add Muhammed's LinkedIn URL here
  },
  {
    id: 4,
    name: "Akshay Hanooman",
    designation: "Database Engineer",
    image: "/images/akshay.jpeg",
    linkedin: "https://www.linkedin.com/in/akshay-hanooman/", // Add Akshay's LinkedIn URL here
  },
];

const Team = () => {
  return (
    <section className="bg-[#7A1C23] min-h-screen text-white body-font flex items-center justify-center relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="text-2xl font-medium title-font mb-4 tracking-widest" style={{ color: "#D4A03A" }}>
            OUR TEAM
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-white">
            Meet our team of professionals, ensuring the best results for our users.
          </p>
        </div>
        <div className="flex flex-wrap -m-4">
          {teamData.map((teamMember) => (
            <div key={teamMember.id} className="p-4 lg:w-1/2">
              <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left bg-[#7A1C23] p-6 rounded-lg shadow-lg">
                <img
                  alt={teamMember.name}
                  className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                  src={teamMember.image}
                />
                <div className="flex-grow sm:pl-8">
                  <h2 className="title-font font-medium text-lg" style={{ color: "#D4A03A" }}>
                    {teamMember.name}
                  </h2>
                  <h3 className="text-white mb-3">{teamMember.designation}</h3>
                  <p className="mb-4 text-white">Expert in {teamMember.designation}, ensuring high-quality work.</p>
                  <span className="inline-flex">
                    {/* LinkedIn Icon with Link */}
                    <Link href={teamMember.linkedin} target="_blank" className="text-white">
                      <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="ml-2 text-white">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                      </svg>
                    </Link>
                    <Link href="#" className="ml-2 text-white">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                      </svg>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
