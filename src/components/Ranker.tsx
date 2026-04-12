'use client';

import { ArchiveIcon, CircleQuestionMark, Heart, Info, Skull } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DndProvider, MouseTransition, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { bodyFont, titleFont } from "../constants";
import { RankerItem, Solution } from "../types";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import GameInstructions from "./modals/GameInstructions";
import RankedItem from "./RankedItem";
import ScrambledItem from "./ScrambledItem";
import DragPreview from "./ui/DragPreview";
import Source from "./modals/Source";
import Archive from "./modals/Archive";
import EndOfGame, { WIN_GIF, LOSE_GIF } from "./modals/EndOfGame";
import { solutions } from "../solutions";

const DND_PIPELINE = {
  backends: [
    { id: "html5", backend: HTML5Backend, transition: MouseTransition },
    { id: "touch", backend: TouchBackend, options: { enableMouseEvents: true }, preview: true, transition: TouchTransition },
  ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Ranker() {
  const [solution, setSolution] = useState<Solution | null>(null);
  const [scrambledItems, setScrambledItems] = useState<RankerItem[]>([]);
  const [lives, setLives] = useState(Array(3).fill(true));
  const [correctDrops, setCorrectDrops] = useState<Set<number>>(new Set());
  const [gameOverReveals, setGameOverReveals] = useState<Set<number>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [endOfGameModalOpen, setEndOfGameModalOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [shakingRank, setShakingRank] = useState<number | null>(null);
  const pendingWinModal = useRef(false);

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const cardHeight = solution ? `calc((100svh - 14rem) / ${solution.items.length} - 0.5rem)` : '0'
  const allRevealed = solution ? new Set([...correctDrops, ...gameOverReveals]).size === solution.items.length : false;
  const isWin = solution ? correctDrops.size === solution.items.length : false;

  useEffect(() => {
    new Image().src = WIN_GIF;
    new Image().src = LOSE_GIF;
  }, []);

  useEffect(() => {
    setSolution(solutions.find(s => s.date === new Date().toLocaleDateString()) ?? null);
  }, []);

  useEffect(() => {
    if (solution?.items && solution.items.length > 0) {
      const itemsCopy = [...solution.items];
      setScrambledItems(shuffle(itemsCopy));
    }
  }, [solution]);

  useEffect(() => {
    if (!gameOver || !solution) return;
    let cancelled = false;
    (async () => {
      for (let i = 1; i <= solution.items.length; i++) {
        if (!correctDrops.has(i)) {
          setGameOverReveals(prev => new Set(prev).add(i));
          await delay(500);
        }
        if (cancelled) return;
      }
      await delay(200);
      if (!cancelled) setEndOfGameModalOpen(true);
    })();
    return () => { cancelled = true; };
  }, [gameOver, solution, correctDrops]);

  function shuffle(array: RankerItem[]): RankerItem[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array; 
  }

  function handleDrop(rankIndex: number, entry: RankerItem): void {
    if ((rankIndex + 1) === entry.rank) {
      setCorrectDrops(prev => {
        const updated = new Set(prev).add(entry.rank);
        if (updated.size === solution?.items.length) pendingWinModal.current = true;
        return updated;
      });
    } else {
      setShakingRank(rankIndex);
      setTimeout(() => setShakingRank(null), 500);
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

  return (
    solution && (
      <DndProvider options={DND_PIPELINE}>
        <DragPreview cardHeight={cardHeight} />
        <div className="min-h-svh w-full flex flex-col items-center bg-purple-200 pb-8">
          <div className="w-full flex items-center justify-between px-3 pt-3 text-white">
            <div className="flex flex-col">
              <h1 className={`${titleFont.className} text-xl font-bold`}>Ranker</h1>
              <h3 className={`${titleFont.className} text-sm`}>{formattedDate}</h3>
            </div>
            <div className="flex items-center gap-1 font-bold">
              <Modal open={instructionsOpen} onOpenChange={setInstructionsOpen}>
                <Modal.Button asChild>
                  <Button icon={<CircleQuestionMark />}></Button>
                </Modal.Button>
                <Modal.Content titleClass={`${bodyFont.className} text-gray-900 text-xl`} title="Instructions">
                  <GameInstructions />
                </Modal.Content>
              </Modal>
              <Modal>
                <Modal.Button asChild>
                  <Button icon={<ArchiveIcon />}></Button>
                </Modal.Button>
                <Modal.Content titleClass={`${bodyFont.className} text-gray-900 text-xl`} title="Archive">
                  <Archive />
                </Modal.Content>
              </Modal>
            </div>
          </div>
          <h2 className={`${bodyFont.className} flex flex-row items-center gap-1 pt-5 text-lg text-purple-900 text-center font-bold`}>
            {solution.category}
            <Modal>
              <Modal.Button asChild>
                <Button icon={<Info  size={18} className="text-purple-900" />}></Button>
              </Modal.Button>
              <Modal.Content titleClass={`${bodyFont.className} text-gray-900 text-xl`} title="Source">
                <Source source={solution.source}/>
              </Modal.Content>
            </Modal>
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
                    cardHeight={cardHeight}
                  />
                ))}
              </div>
            )}
            <motion.div layout onLayoutAnimationComplete={() => {
              if (pendingWinModal.current) {
                pendingWinModal.current = false;
                setEndOfGameModalOpen(true);
              }
            }}>
              {solution.items.map((rankedItem, i) => (
                <RankedItem
                  key={rankedItem.rank}
                  index={i}
                  item={rankedItem}
                  isRevealed={correctDrops.has(rankedItem.rank) || gameOverReveals.has(rankedItem.rank)}
                  isAnimated={gameOverReveals.has(rankedItem.rank)}
                  isShaking={shakingRank === i}
                  cardHeight={cardHeight}
                  onDrop={handleDrop}
                />
              ))}
            </motion.div>
          </div>
          <Modal open={endOfGameModalOpen} onOpenChange={setEndOfGameModalOpen}>
            <Modal.Content
              titleClass={`${titleFont.className} text-purple-900 text-xl`}
              title={isWin ? 'Yay! You won' : 'You lost :('}>
              <EndOfGame win={isWin}/>
            </Modal.Content>
          </Modal>
        </div>
      </DndProvider>
    )
  );
}