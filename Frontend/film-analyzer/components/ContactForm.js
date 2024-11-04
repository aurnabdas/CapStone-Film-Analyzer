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
    <div className="flex items-center justify-center py-10 bg-[#450a0a]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us And/Or Request Studio Account</h2>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none ${
              isEmailValid ? "border-gray-300 focus:border-blue-500" : "border-red-500"
            }`}
            placeholder="Enter your email"
          />
          {!isEmailValid && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
          )}
        </div>

        <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 font-semibold">
            Subject
          </label>

          <input
          >
          </input>
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 font-semibold">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Write your message"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
