"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const events = {
  1: {
    id: 1,
    name: "BugHunt",
    tagline: "Hunt the bugs, claim the glory!",
    description: "BugHunt is an exciting debugging competition where participants race against time to find and fix bugs in code. Test your problem-solving skills, attention to detail, and coding expertise as you navigate through challenging code snippets across multiple programming languages.",
    image: "🐛",
    date: "March 15, 2026",
    time: "10:00 AM - 6:00 PM",
    duration: "8 Hours",
    mode: "Hybrid",
    location: "CS Lab 101 & Online",
    category: "Competition",
    teamSize: "Individual or Team of 2",
    registrationDeadline: "March 10, 2026",
    prizes: ["1st Place: ₹5,000", "2nd Place: ₹3,000", "3rd Place: ₹2,000"],
    requirements: ["Laptop with IDE", "Basic programming knowledge", "GitHub account"],
    highlights: ["Multiple difficulty levels", "Real-world bug scenarios", "Industry mentors", "Certificates for all"]
  }
};

const EventDetailPage = () => {
  const params = useParams();
  const eventId = parseInt(params.id);
  const event = events[eventId];

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Found</h1>
          <Link href="/events" className="text-purple-400 hover:text-purple-300">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/events"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-purple-500/20 overflow-hidden mb-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-8 sm:p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">{event.image}</span>
            </div>
            <span className="inline-block px-4 py-1 text-sm font-medium text-purple-300 bg-purple-500/20 rounded-full mb-4">
              {event.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {event.name}
            </h1>
            <p className="text-xl text-purple-200 italic">{event.tagline}</p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-b border-purple-500/20">
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-purple-400 mb-1">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-xs mb-1">Date</p>
              <p className="text-white font-medium text-sm">{event.date}</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-purple-400 mb-1">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-xs mb-1">Duration</p>
              <p className="text-white font-medium text-sm">{event.duration}</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-purple-400 mb-1">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-xs mb-1">Mode</p>
              <p className="text-white font-medium text-sm">{event.mode}</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-xl">
              <div className="text-purple-400 mb-1">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-400 text-xs mb-1">Team Size</p>
              <p className="text-white font-medium text-sm">{event.teamSize}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* About */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">📋</span>
                About the Event
              </h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Time & Location */}
              <div className="bg-slate-700/30 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">📍 Venue & Timing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time</span>
                    <span className="text-white">{event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{event.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deadline</span>
                    <span className="text-red-400">{event.registrationDeadline}</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-slate-700/30 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">📝 Requirements</h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <span className="text-purple-400 mr-2">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prizes */}
            {event.prizes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">🏆</span>
                  Prizes
                </h2>
                <div className="flex flex-wrap gap-3">
                  {event.prizes.map((prize, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 rounded-full text-sm font-medium">
                      {prize}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">✨</span>
                Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {event.highlights.map((highlight, index) => (
                  <div key={index} className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                    <span className="text-purple-200 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Register Button */}
            <div className="text-center pt-4">
              <Link
                href={`/events/${eventId}/register`}
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/30"
              >
                Register for {event.name}
              </Link>
              <p className="text-gray-500 text-sm mt-4">
                Registration closes on {event.registrationDeadline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
