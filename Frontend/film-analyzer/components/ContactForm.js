"use client";

import { useState } from "react";
import validator from "validator";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validator.isEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(email)) {
      setIsEmailValid(false);
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });

    if (response.ok) {
      setEmail("");
      setMessage("");
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#450a0a] to-[#7E1328] py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gold mb-4">Contact Us</h2>
          <p className="text-gray-300 text-lg">
            Are you a film studio interested in creating surveys and gathering
            audience feedback? Contact us below to get started.
          </p>
        </div>
        <div className="bg-[#5d1a1a] bg-opacity-90 rounded-lg shadow-lg p-8 border border-gold">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gold font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                    isEmailValid
                      ? "border-gray-300 focus:border-gold"
                      : "border-red-500 focus:border-red-500"
                  }`}
                  placeholder="Enter your email"
                />
                {!isEmailValid && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gold font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Enter the subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-gold font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                placeholder="Write your message here"
                rows="5"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#D5A036] to-[#FFC107] text-[#450a0a] font-semibold py-2 px-6 rounded-md hover:from-[#FFC107] hover:to-[#E8C547] transition-all duration-200 shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
