import React, { useState } from "react";
import axios from "axios";
import {
  FaLeaf,
  FaClipboard,
  FaVolumeUp,
  FaAppleAlt,
  FaPizzaSlice,
  FaHamburger
} from "react-icons/fa";
import { motion } from "framer-motion";

const doodles = [FaAppleAlt, FaPizzaSlice, FaHamburger];
function getRandom(min, max) { return Math.random() * (max - min) + min; }

function FloatingDoodle() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        const Icon = doodles[Math.floor(Math.random() * doodles.length)];
        const size = getRandom(20, 50);
        const duration = getRandom(10, 20);
        const top = getRandom(0, 80);
        const left = getRandom(0, 90);
        const color = ["text-red-400", "text-yellow-400", "text-green-400", "text-orange-400"][
          Math.floor(Math.random() * 4)
        ];

        return (
          <motion.div
            key={i}
            className={`absolute ${color}`}
            style={{ top: `${top}%`, left: `${left}%`, fontSize: size, opacity: 0.7 }}
            animate={{ y: [0, 100, 0], rotate: [0, 360, 0] }}
            transition={{ repeat: Infinity, repeatType: "loop", duration, ease: "linear" }}
          >
            <Icon />
          </motion.div>
        );
      })}
    </>
  );
}

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const generateRecipe = async () => {
    if (!ingredients.trim()) return alert("Enter ingredients!");
    try {
      setLoading(true);
      setRecipe("");
      const res = await axios.post("http://localhost:4000/api/recipe", { ingredients });
      setRecipe(res.data.recipe);
      setHistory((prev) => [{ ingredients, recipe: res.data.recipe }, ...prev]);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  const copyRecipe = () => { if (!recipe) return; navigator.clipboard.writeText(recipe); alert("Recipe copied!"); };
  const readRecipe = () => { if (!recipe) return; const utterance = new SpeechSynthesisUtterance(recipe); speechSynthesis.speak(utterance); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 flex flex-col items-center p-4 sm:p-6 relative overflow-hidden">
      <FloatingDoodle />
      <h1 className="text-4xl font-bold mb-6 text-purple-700 flex items-center gap-2">🍳 Recipe Generator</h1>

      <div className="flex flex-col sm:flex-row w-full max-w-6xl relative z-10">
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <div className="flex items-center gap-2 flex-1 bg-white p-2 rounded-lg shadow-sm border border-purple-200">
              <FaLeaf className="text-green-500" />
              <input
                type="text"
                placeholder="Enter ingredients..."
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="flex-1 p-2 focus:outline-none"
              />
            </div>
            <button
              onClick={generateRecipe}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              {loading ? "Generating..." : "Get Recipe"}
            </button>
          </div>

          {recipe && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg border border-purple-200 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2">Your Recipe</h2>
                <div className="flex gap-3">
                  <button onClick={copyRecipe} className="p-2 rounded-full hover:bg-purple-100 transition">
                    <FaClipboard className="text-purple-500" />
                  </button>
                  <button onClick={readRecipe} className="p-2 rounded-full hover:bg-purple-100 transition">
                    <FaVolumeUp className="text-purple-500" />
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-gray-800">{recipe}</pre>
            </motion.div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="hidden sm:flex flex-col w-80 ml-6 bg-white p-4 rounded-xl shadow-lg border border-purple-200 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">History</h3>
          {history.length === 0 ? (
            <p className="text-gray-500">No history yet</p>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="mb-4 p-2 rounded-lg hover:bg-purple-50 cursor-pointer border border-purple-100"
                onClick={() => {
                  setIngredients(item.ingredients);
                  setRecipe(item.recipe);
                }}
              >
                <p className="font-semibold text-gray-700">{item.ingredients}</p>
                <p className="text-gray-500 text-sm line-clamp-3">{item.recipe}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;



