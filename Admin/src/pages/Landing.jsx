import React from "react";
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Download,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  Zap,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import AppImage from "../assets/home.jpeg";

const Home = () => {
  const stats = [
    {
      icon: Users,
      value: "10K+",
      label: "SEBA Students",
    },
    {
      icon: Star,
      value: "4.9",
      label: "Play Store Rating",
    },
    {
      icon: BookOpen,
      value: "1000+",
      label: "PDF Notes & Solutions",
    },
    {
      icon: Award,
      value: "95%",
      label: "HSLC Pass Rate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Helmet>
        <title>
          GyanBrix — Free HSLC (SEBA) Class 10 Notes, PDFs & Mock Tests
        </title>

        <meta
          name="description"
          content="Free HSLC (SEBA) Class 10 Assamese Medium notes, maths solutions, question papers and mock tests. Download GyanBrix and score better."
        />

        <meta
          name="keywords"
          content="HSLC, SEBA, Assamese medium, class 10 notes, HSLC mock tests, maths solutions, SEBA question papers"
        />

        {/* Social / Share preview */}
        <meta
          property="og:title"
          content="GyanBrix — Best App for SEBA HSLC Students"
        />
        <meta
          property="og:description"
          content="Free notes, mock tests and solutions for SEBA HSLC Class 10."
        />
        <meta property="og:image" content="/seo-cover.jpg" />
        <meta property="og:type" content="website" />

        {/* Language */}
        <meta httpEquiv="content-language" content="as" />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              GyanBrix
            </span>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
            title="Download GyanBrix from Play Store"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Download className="w-4 h-4" />
            Download App
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-purple-100">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-600"></span>
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  #1 App for SEBA Students
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-purple-900 bg-clip-text text-transparent">
                    HSLC ত
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    ভাল নম্বৰ পাওক
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-xl leading-relaxed">
                  Complete study materials for{" "}
                  <span className="font-bold text-purple-700">
                    Class 10 Assamese Medium
                  </span>{" "}
                  — Notes, Solutions & Mock Tests
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Free</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="inline-flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-5 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-gray-100">
                  <PlayCircle className="w-6 h-6 text-purple-600" />
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-purple-600 mb-1">
                        <IconComponent className="w-5 h-5" />
                        <span className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative block mx-auto sm:mt-10 lg:mt-0 w-[260px] sm:w-[300px] lg:w-[320px]">
              <div className="relative bg-gray-900 rounded-[3.5rem] p-4 shadow-2xl ring-8 ring-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-7 bg-gray-900 rounded-b-3xl z-20"></div>

                <div className="relative bg-white rounded-[3rem] overflow-hidden aspect-[9/19]">
                  <img
                    src={AppImage}
                    alt="GyanBrix App Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Rating badge */}
              <div className="absolute -top-6 sm:-top-8 -right-4 sm:-right-8 bg-white rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-900 text-sm sm:text-base">
                    4.9 Rating
                  </span>
                </div>
              </div>

              {/* Free badge */}
              <div className="absolute -bottom-5 sm:-bottom-6 -left-4 sm:-left-8 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-2xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">
                    100% Free
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                GyanBrix Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete HSLC Preparation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All subjects, all chapters — designed strictly for SEBA Class 10
              students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Class 10 Notes (Assamese)",
                description:
                  "Detailed Science, Social Science & English notes in Assamese medium",
                gradient: "from-purple-600 to-purple-700",
                highlight: "Top Rated",
              },
              {
                icon: CheckCircle,
                title: "Maths Solutions (Ganit)",
                description:
                  "Step-by-step solutions for General Mathematics Class 10 SEBA",
                gradient: "from-purple-500 to-purple-600",
                highlight: "Solved",
              },
              {
                icon: FileText,
                title: "HSLC Question Papers",
                description:
                  "Previous 10 years SEBA question papers with solved answers",
                gradient: "from-purple-700 to-purple-800",
              },
              {
                icon: Video,
                title: "SEBA Video Classes",
                description:
                  "Easy-to-understand video lectures for Maths and Science topics",
                gradient: "from-purple-400 to-purple-600",
              },
              {
                icon: Award,
                title: "HSLC Mock Tests",
                description:
                  "Chapter-wise online tests to prepare for the final Matric exam",
                gradient: "from-purple-600 to-purple-900",
              },
              {
                icon: Download,
                title: "Offline PDF Download",
                description:
                  "Download notes and study anytime without internet connection",
                gradient: "from-purple-500 to-purple-700",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
                >
                  {feature.highlight && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {feature.highlight}
                    </div>
                  )}
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects Showcase */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              All SEBA Subjects Covered
            </h2>
            <p className="text-xl text-gray-300">
              Complete Assamese Medium syllabus for 2024-25
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "General Science",
                emoji: "🧪",
                chapters: "16 Chapters",
                color:
                  "from-purple-600/20 to-purple-700/20 border-purple-600/30",
              },
              {
                name: "General Maths",
                emoji: "📐",
                chapters: "15 Chapters",
                color:
                  "from-purple-500/20 to-purple-600/20 border-purple-500/30",
              },
              {
                name: "Social Science",
                emoji: "🌍",
                chapters: "Complete Notes",
                color:
                  "from-purple-700/20 to-purple-800/20 border-purple-700/30",
              },
              {
                name: "English",
                emoji: "📚",
                chapters: "Grammar & Text",
                color:
                  "from-purple-400/20 to-purple-600/20 border-purple-400/30",
              },
            ].map((subject, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${subject.color} backdrop-blur-xl border-2 rounded-3xl p-8 text-center hover:scale-105 transition-transform group cursor-pointer`}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {subject.emoji}
                </div>
                <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                <p className="text-gray-300">{subject.chapters}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Trusted by Students Across Assam
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Das",
                location: "Guwahati",
                text: "GyanBrix helped me score 92% in HSLC! The Maths solutions are very clear.",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                location: "Dibrugarh",
                text: "Best app for Assamese medium. The Science notes helped me understand everything.",
                rating: 5,
              },
              {
                name: "Ankit Bora",
                location: "Jorhat",
                text: "I practiced previous year HSLC papers on GyanBrix and it boosted my confidence.",
                rating: 5,
              },
            ].map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex gap-1 mb-4 justify-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
                <div className="font-bold text-gray-900">{review.name}</div>
                <div className="text-sm text-gray-500">{review.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-[3rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Start Your HSLC Prep Today
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-2xl mx-auto">
                Join 10,000+ Assamese medium students using GyanBrix to ace
                their exams
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
                className="inline-flex items-center gap-3 bg-white text-purple-700 px-10 py-6 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
              >
                <Download className="w-7 h-7" />
                Download App Free
                <ChevronRight className="w-6 h-6" />
              </a>
              <p className="text-purple-100 mt-6 text-sm">
                ✓ 100% Free Forever ✓ Based on SEBA Syllabus ✓ Works Offline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">GyanBrix</span>
              </div>
              <p className="text-gray-400 max-w-xs leading-relaxed">
                Empowering Assam's students with free, high-quality digital
                education for HSLC success. The best guide for Class 10 Assamese
                Medium.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Class 10 Subjects</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    Assamese
                  </a>
                </li>
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    General Science (Notes)
                  </a>
                </li>
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    General Mathematics (Solutions)
                  </a>
                </li>
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    Social Science (Assamese)
                  </a>
                </li>
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    English Textbook
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    HSLC Question Papers
                  </a>
                </li>
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://play.google.com/store/apps/details?id=com.gyanbrix.app">
                    SEBA Syllabus 2025
                  </a>
                </li>

                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://gyanbrix.vercel.app/privacy-policy">
                    Privacy Policy{" "}
                  </a>
                </li>
                <li className="hover:text-purple-400 cursor-pointer transition-colors">
                  <a href="https://gyanbrix.vercel.app/terms-and-conditions">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} GyanBrix. Made with ❤️ for Assam
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
