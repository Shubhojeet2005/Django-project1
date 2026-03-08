import React, { useState, useEffect } from "react";
import "./SpringLeaves.css";

const Leaf = ({ delay, left, size, fallDuration, swayDuration, color }) => {
  const style = {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size * 0.8}px`,
    animationDelay: `${delay}s, ${delay}s`,
    animationDuration: `${fallDuration}s, ${swayDuration}s`,
    color: color,
  };

  return (
    <div className="spring-leaf" style={style}>
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 C 100 50, 100 100, 50 100 C 0 100, 0 50, 50 0 Z" />
      </svg>
    </div>
  );
};

const SpringLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate an array of leaves with random properties
    const numLeaves = 25; // number of falling leaves
    const colors = ["#93dba5", "#ff8fa3", "#a8e6cf", "#ffd3b6"]; // spring palette

    const generatedLeaves = Array.from({ length: numLeaves }).map((_, i) => ({
      id: i,
      delay: Math.random() * 15, // random delay up to 15s
      left: Math.random() * 100, // random horizontal start position
      size: Math.random() * 20 + 15, // random size between 15px and 35px
      fallDuration: Math.random() * 5 + 10, // fall duration between 10s and 15s
      swayDuration: Math.random() * 2 + 3, // sway duration between 3s and 5s
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className="leaves-container">
      {leaves.map((leaf) => (
        <Leaf key={leaf.id} {...leaf} />
      ))}
    </div>
  );
};

export default SpringLeaves;
