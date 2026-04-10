'use client';

import { CircleQuestionMark, Heart, Info, Link, Skull } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { DndProvider, MouseTransition, Preview, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { bodyFont, titleFont } from "../constants";
import { RankerItem, Solution } from "../types";
import Modal from "./Modal";
import Button from "./Button";
import GameInstructions from "./GameInstructions";
import RankedItem from "./RankedItem";
import ScrambledItem from "./ScrambledItem";
import DragPreview from "./DragPreview";
import Source from "./Source";

const DND_PIPELINE = {
  backends: [
    { id: "html5", backend: HTML5Backend, transition: MouseTransition },
    { id: "touch", backend: TouchBackend, options: { enableMouseEvents: true }, preview: true, transition: TouchTransition },
  ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Ranker({ solution }: { solution: Solution }) {
  const scrambledItems = solution.items;
  const rankedItems = useMemo(
    () => [...solution.items].sort((a, b) => a.rank - b.rank),
    [solution.items]
  );

  const [correctDrops, setCorrectDrops] = useState<Set<number>>(new Set());
  const [gameOverReveals, setGameOverReveals] = useState<Set<number>>(new Set());
  const [lives, setLives] = useState(Array(3).fill(true));
  const [gameOver, setGameOver] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    if (gameOver) revealAll();
  }, [gameOver]);

  function handleDrop(rankIndex: number, entry: RankerItem): void {
    if ((rankIndex + 1) === entry.rank) {
      setCorrectDrops(prev => new Set(prev).add(entry.rank));
    } else {
      setLives(prev => {
        const next = [...prev];
        const lifeIndex = next.findIndex(p => p);
        next[lifeIndex] = false;

        if (lifeIndex === next.length - 1) {
          setGameOver(true);
        }

        return next;
      });
    }
  }

  async function revealAll() {
    for (let i = 1; i <= solution.items.length; i++) {
      setGameOverReveals(prev => new Set(prev).add(i));
      await delay(500);
    }
  }

  const allRevealed = new Set([...correctDrops, ...gameOverReveals]).size === solution.items.length;

  return (
    <DndProvider options={DND_PIPELINE}>
      <DragPreview />
      <div className="min-h-svh w-full flex flex-col items-center justify-center bg-purple-200 p-10">
        <h3 className={`${titleFont.className} absolute top-5 left-5 text-white font-bold`}>
          {formattedDate}
        </h3>
        <div className="absolute top-5 right-5 text-white font-bold">
          <Modal>
            <Modal.Button asChild>
              <Button icon={<CircleQuestionMark />}></Button>
            </Modal.Button>
            <Modal.Content title="Ranker Instructions">
              <GameInstructions />
            </Modal.Content>
          </Modal>
          <Modal>
            <Modal.Button asChild>
              <Button icon={<Link />}></Button>
            </Modal.Button>
            <Modal.Content title="Source">
              <Source source={solution.source}/>
            </Modal.Content>
          </Modal>
        </div>
        <h1 className={`${titleFont.className} absolute top-15 text-white text-4xl font-bold`}>
          Ranker
        </h1>
        <h2 className={`${bodyFont.className} flex flex-col items-center pt-5 text-purple-900 text-base text-center font-bold`}>
          {solution.category}
        </h2>
        <div className="flex flex-row items-center pt-3">
          {lives.map((life, i) => (
            life ? (
              <Heart key={i} className="text-purple-900" />) : (
              <Skull key={i} className="text-purple-900" />)
          ))}
        </div>
        <div className={allRevealed ? "flex justify-center pt-3" : "grid grid-cols-2 gap-x-20 pt-3"}>
          {!allRevealed && (
            <div>
              {scrambledItems.map((scrambledItem) => (
                <ScrambledItem
                  key={scrambledItem.rank}
                  item={scrambledItem}
                  isRevealed={correctDrops.has(scrambledItem.rank) || gameOverReveals.has(scrambledItem.rank)}
                />
              ))}
            </div>
          )}
          <motion.div layout>
            {rankedItems.map((rankedItem, i) => (
              <RankedItem
                key={rankedItem.rank}
                index={i}
                item={rankedItem}
                isRevealed={correctDrops.has(rankedItem.rank) || gameOverReveals.has(rankedItem.rank)}
                isAnimated={gameOverReveals.has(rankedItem.rank)}
                onDrop={handleDrop}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </DndProvider>
  );
}