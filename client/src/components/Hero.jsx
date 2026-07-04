import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="text-center py-24 px-6">

      <motion.h1
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        transition={{duration:.8}}
        className="text-6xl md:text-7xl font-bold"
      >
        Learn Smarter
      </motion.h1>

      <motion.h2
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        transition={{delay:.2}}
        className="text-6xl md:text-7xl font-bold mt-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
      >
        With AI
      </motion.h2>

      <motion.p
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:.5}}
        className="max-w-2xl mx-auto mt-8 text-gray-400 text-lg"
      >
        Upload PDFs, generate AI summaries,
        flashcards, quizzes and track your
        study progress with one click.
      </motion.p>

      <motion.button
        whileHover={{scale:1.05}}
        whileTap={{scale:.95}}
        className="mt-10 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold"
      >
        Get Started
      </motion.button>

    </section>
  );
}