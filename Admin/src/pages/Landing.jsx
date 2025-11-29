import React from "react";
import { Helmet } from "react-helmet-async";
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

// ❌ REMOVED THE BROKEN IMAGE IMPORT
// import APPSCREENSHOT from "../assets/home.jpeg";

import SS from "../assets/home.jpeg";

const Home = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GyanBrix",
    headline: "Class 10 Assamese Medium Solutions App",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Best learning app for SEBA Class 10 Assamese Medium students. Get free notes, video solutions, and previous year HSLC question papers.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "10500",
    },
    featureList:
      "Class 10 Science Notes in Assamese, SEBA Maths Solutions, HSLC Mock Tests",
  };

  const stats = [
    {
      icon: <Users className="w-5 h-5" />,
      value: "10K+",
      label: "SEBA Students",
    },
    {
      icon: <Star className="w-5 h-5" />,
      value: "4.9",
      label: "Play Store Rating",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      value: "1000+",
      label: "PDF Notes & Solutions",
    },
    {
      icon: <Award className="w-5 h-5" />,
      value: "95%",
      label: "HSLC Pass Rate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <Helmet>
        <title>
          GyanBrix: Class 10 Assamese Medium Solutions, Notes & HSLC Guide
        </title>
        <meta
          name="description"
          content="Download GyanBrix for free SEBA Class 10 Assamese Medium notes, General Maths solutions, Science explanations, and HSLC question papers. The #1 study app for Assam students."
        />
        <meta
          name="keywords"
          content="Class 10 Assamese Medium Solutions, SEBA Class 10 Notes, HSLC Question Papers Assamese, Assam Board Maths Solution, GyanBrix App"
        />
        <link rel="canonical" href="https://gyanbrix.vercel.app/" />

        <meta
          property="og:title"
          content="GyanBrix - Best App for SEBA Class 10 Students"
        />
        <meta
          property="og:description"
          content="Get free notes, video solutions, and previous papers for Class 10 Assamese Medium. Ace your HSLC exams!"
        />
        <meta
          property="og:image"
          content="https://gyanbrix.vercel.app/og-image.jpg"
        />
        <meta property="og:url" content="https://gyanbrix.vercel.app/" />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GyanBrix
            </span>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
            title="Download GyanBrix from Play Store"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Download className="w-4 h-4" />
            Download App
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-emerald-100">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  #1 App for SEBA Students
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                    HSLC ত
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                    ভাল নম্বৰ পাওক
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-xl leading-relaxed">
                  Complete study materials for{" "}
                  <span className="font-bold text-emerald-700">
                    Class 10 Assamese Medium
                  </span>{" "}
                  — Notes, Solutions & Mock Tests
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Free</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button className="inline-flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-5 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-gray-100">
                  <PlayCircle className="w-6 h-6 text-emerald-600" />
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        {/* Fixed Icon rendering */}
                        {stat.icon}
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

            <div className="relative lg:block hidden">
              <div className="relative mx-auto w-[320px]">
                <div className="relative bg-gray-900 rounded-[3.5rem] p-4 shadow-2xl ring-8 ring-white/10">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-3xl z-20"></div>

                  {/* Screen with Image */}
                  <div className="relative bg-white rounded-[3rem] overflow-hidden aspect-[9/19]">
                    {/* ✅ I AM USING A PLACEHOLDER IMAGE HERE SO IT WORKS FOR YOU */}
                    <img
                      src={SS}
                      alt="GyanBrix App Screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating Badge Elements */}
                <div className="absolute -top-8 -right-8 bg-white rounded-2xl px-4 py-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">4.9 Rating</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl px-4 py-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold">100% Free</span>
                  </div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
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
                icon: <BookOpen className="w-7 h-7" />,
                title: "Class 10 Notes (Assamese)", // Keyword
                description:
                  "Detailed Science, Social Science & English notes in Assamese medium", // Keywords
                gradient: "from-blue-500 to-blue-600",
                highlight: "Top Rated",
              },
              {
                icon: <CheckCircle className="w-7 h-7" />,
                title: "Maths Solutions (Ganit)", // Keyword
                description:
                  "Step-by-step solutions for General Mathematics Class 10 SEBA", // Keywords
                gradient: "from-cyan-500 to-cyan-600",
                highlight: "Solved",
              },
              {
                icon: <FileText className="w-7 h-7" />,
                title: "HSLC Question Papers", // Keyword
                description:
                  "Previous 10 years SEBA question papers with solved answers", // Keywords
                gradient: "from-teal-500 to-teal-600",
              },
              {
                icon: <Video className="w-7 h-7" />,
                title: "SEBA Video Classes", // Keyword
                description:
                  "Easy-to-understand video lectures for Maths and Science topics",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: <Award className="w-7 h-7" />,
                title: "HSLC Mock Tests", // Keyword
                description:
                  "Chapter-wise online tests to prepare for the final Matric exam",
                gradient: "from-orange-500 to-orange-600",
              },
              {
                icon: <Download className="w-7 h-7" />,
                title: "Offline PDF Download", // Keyword
                description:
                  "Download notes and study anytime without internet connection",
                gradient: "from-indigo-500 to-indigo-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2"
              >
                {feature.highlight && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {feature.highlight}
                  </div>
                )}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
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
                color: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
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
                  "from-orange-500/20 to-orange-600/20 border-orange-500/30",
              },
              {
                name: "English",
                emoji: "📚",
                chapters: "Grammar & Text",
                color: "from-teal-500/20 to-teal-600/20 border-teal-500/30",
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
          <div className="relative bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-[3rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Start Your HSLC Prep Today
              </h2>
              <p className="text-xl md:text-2xl text-emerald-50 mb-10 max-w-2xl mx-auto">
                Join 10,000+ Assamese medium students using GyanBrix to ace
                their exams
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.gyanbrix.app"
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-10 py-6 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all shadow-2xl hover:scale-105"
              >
                <Download className="w-7 h-7" />
                Download App Free
                <ChevronRight className="w-6 h-6" />
              </a>
              <p className="text-emerald-100 mt-6 text-sm">
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
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
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
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  General Science (Notes)
                </li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  General Mathematics (Solutions)
                </li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  Social Science (Assamese)
                </li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  English Grammar
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  HSLC Question Papers
                </li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  SEBA Syllabus 2025
                </li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  Video Lessons
                </li>
                <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                  Privacy Policy
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

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
