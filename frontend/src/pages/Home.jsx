import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section
        className="relative flex flex-col justify-center items-center text-center px-6 h-[90vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521633246924-67d02995bb46'",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-white relative z-10"
        >
          ABEG FIX. Hire Better. Faster.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-xl mt-4 text-gray-200 relative z-10"
        >
          Browse skilled artisans, view verified profiles, and book the right
          person instantly.
        </motion.p>
      </section>

      {/* BENTO FEATURE MENU */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Verified Artisans",
              desc: "We verify identity (NIN), location & craftsmanship.",
              span: "md:col-span-2",
            },
            {
              title: "Local Experts",
              desc: "Find artisans near your area instantly.",
            },
            {
              title: "24/7 Support",
              desc: "We’re here whenever you need help.",
              span: "md:col-span-2",
            },
          ].map((box, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              className={`bg-white p-8 rounded-2xl shadow-lg border ${box.span}`}
            >
              <h3 className="text-2xl font-bold mb-2">{box.title}</h3>
              <p className="text-gray-700 text-sm">{box.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
