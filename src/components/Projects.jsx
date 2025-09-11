import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import chat from "../assets/chat.png";
import bar from "../assets/bar.png";
import store from "../assets/e-commerce.png";
import driver from "../assets/driver.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const projects = [ 
  {
    title: "Chat Application",
    image: chat,
    description:
      "Real-time chat platform with support for group and private messaging, avatars and notifications.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind CSS"],
    demo: "https://chat-app-9p6u.onrender.com/login",
    github: "https://github.com/Georgi1023Y/chat-app.git",
  },
  {
    title: "E-commerce Store",
    image: store,
    description:
      "Modern e-commerce site with shopping cart, payments and admin panel for product management.",
    tech: [
      "React",
      "Redux",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe",
      "Tailwind CSS",
    ],
    demo: "",
    github: "",
  },
  {
    title: "Website For Bar",
    image: bar,
    description: "Website for bar featuring menu and photo gallery.",
    tech: ["React", "Tailwind CSS", "EmailJS"],
    demo: "https://bar-center-menu.vercel.app/",
    github: "https://github.com/Georgi1023Y/bar-center-menu",
  },
  {
    title: "Driver Management System",
    image: driver,
    description:
      "Comprehensive driver and posting declaration management system with IMI integration. Includes user authentication, driver CRUD operations, posting declarations, document management, notifications, and a fully responsive frontend.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Vite",
      "Tailwind CSS",
      "JWT",
      "RTPD API"
    ],
    demo: "https://imi-driver-project.vercel.app/", 
    github: "https://github.com/Georgi1023Y/imi_driver_project.git", 
  },
];


const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSliding) {
        setIsSliding(true);
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }
  };

  const prevSlide = () => {
    if (!isSliding) {
      setIsSliding(true);
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsSliding(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <section
      id="projects"
      className="w-full py-12 px-4 flex flex-col items-center bg-gradient-to-br from-[#232526] to-[#414345] dark:from-[#ffffff] dark:to-[#f8f9fa]"
    >
      <h2 className="text-3xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 dark:from-pink-400 dark:to-cyan-400">
        Projects
      </h2>
      
      <div className="relative w-full max-w-3xl">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="min-w-full bg-[#2d2f38] dark:bg-white/80 rounded-2xl shadow-lg border border-[#383a47] dark:border-gray-200 flex flex-col overflow-hidden hover:scale-[1.025] hover:shadow-2xl transition-transform duration-200"
              >
                <div className="relative h-48 w-1/2">
                  <LazyLoadImage
                    src={project.image}
                    alt={project.title}
                    height={192}
                    width={384}
                    effect="blur"
                    className="object-cover"
                    placeholder={<div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />}
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-cyan-200 dark:text-gray-800">
                    {project.title}
                  </h3>
                  <p className="text-gray-200 dark:text-gray-700 mb-3 text-sm flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="bg-gradient-to-r from-cyan-400 to-pink-400 text-xs text-white dark:text-gray-900 px-3 py-1 rounded-full font-medium shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-cyan-500 hover:bg-cyan-600 dark:bg-pink-500 dark:hover:bg-pink-600 text-white font-bold py-2 px-3 text-sm sm:text-base rounded-full transition-colors duration-150"
                    >
                      See Demo
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 font-bold py-2 px-3 text-sm sm:text-base rounded-full transition-colors duration-150"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/50 text-white dark:text-gray-900 rounded-full p-2 hover:bg-black/70 dark:hover:bg-white/70 transition-colors"
          aria-label="Previous project"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/50 text-white dark:text-gray-900 rounded-full p-2 hover:bg-black/70 dark:hover:bg-white/70 transition-colors"
          aria-label="Next project"
        >
          <FaChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isSliding) {
                  setIsSliding(true);
                  setCurrentIndex(index);
                }
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index
                  ? "bg-cyan-400 dark:bg-pink-400"
                  : "bg-gray-400 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
