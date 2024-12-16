import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const teamData = [
  {
    id: 1,
    name: "Aurnab Das",
    designation: "FullStack Developer",
    image: "/images/aurnab.jpeg",
    linkedin: "https://www.linkedin.com/in/aurnabdas/",
  },
  {
    id: 2,
    name: "Mahathir Rojan",
    designation: "FrontEnd Developer & Designer",
    image: "/images/mahathir.jpeg",
    linkedin: "https://www.linkedin.com/in/m-rojan/",
  },
  {
    id: 3,
    name: "Muhammed Cheema",
    designation: "Backend Developer",
    image: "/images/cheema.jpeg",
    linkedin: "https://www.linkedin.com/in/muhammed-cheema/",
  },
  {
    id: 4,
    name: "Akshay Hanooman",
    designation: "Database Engineer",
    image: "/images/akshay.jpeg",
    linkedin: "https://www.linkedin.com/in/akshay-hanooman/",
  },
];

const Team = () => {
  return (
    <section className="bg-black text-white py-16">
      <div className="container mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gold mb-4">Our Team</h2>
          <p className="text-lg text-gray-300">
            Meet our team of professionals dedicated to delivering excellence.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamData.map((member) => (
            <div
              key={member.id}
              className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-gold transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_5px_rgba(212,160,58,0.8)]"
            >
              {/* Image */}
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>

              {/* Team Member Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gold mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-300 mb-4">{member.designation}</p>

                {/* LinkedIn Icon */}
                <div className="flex justify-center">
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
                  </Link>
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
