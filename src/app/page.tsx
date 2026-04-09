'use client';

import { CircleQuestionMark, Heart, Skull } from "lucide-react";
import { motion } from "motion/react";
import { Ref, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider, MouseTransition, Preview, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Titan_One, Inter } from 'next/font/google';
import Modal from "../components/modal";
import Button from "../components/button";

const title_font = Titan_One({weight: '400'})

const body_font = Inter({weight: '700'})

interface RankerItem {
  name: string;
  rank: number;
  display?: boolean;
}

const category = 'State Census Population, 2025';

const baseRankerItems: RankerItem[] = [
  {
    name: 'Kentucky',
    rank: 4
  },
  {
    name: 'California',
    rank: 1
  },  {
    name: 'Arkansas',
    rank: 5
  },
  {
    name: 'Missouri',
    rank: 3
  },
  {
    name: 'Florida',
    rank: 2
  }
]

const DRAG_TYPE = "ENTRY";

const DND_PIPELINE = {
  backends: [
    { id: "html5", backend: HTML5Backend, transition: MouseTransition },
    { id: "touch", backend: TouchBackend, options: { enableMouseEvents: true }, preview: true, transition: TouchTransition },
  ],
};

export default function Home() {
  const [scrambledItems, setScrambledItems] = useState<(RankerItem)[]>(() => initializeScrambledItems());
  const [rankedItems, setRankedItems] = useState<(RankerItem)[]>(() => initializeRankedItems());
  const [lives, setLives] = useState(Array(3).fill(true));
  const [gameOver, setGameOver] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    if (gameOver) revealAll();
  }, [gameOver]);

  function initializeScrambledItems(): RankerItem[] {
    const items = baseRankerItems.map(item => {
      return {...item, display: true};
    });
    return items;
  }

  function initializeRankedItems(): RankerItem[] {
    const items = baseRankerItems.map(item => {
      return {...item, display: false};
    });
    items.sort((a, b) => a.rank - b.rank);
    return items;
  }

  function handleDrop(rankIndex: number, entry: RankerItem): void {
    if ((rankIndex + 1) === entry.rank){
      setRankedItems((prev) => {
        const next = [...prev];
        next[rankIndex].display = true;
        return next;
      });
      setScrambledItems((prev) => {
        const next = [...prev];
        const scrambledIndex = next.findIndex(p => p.rank === entry.rank);
        next[scrambledIndex].display = false;
        return next;
      });
    }
    else {
      setLives(prev => {
        const next = [...prev];
        const lifeIndex = next.findIndex(p => p);
        next[lifeIndex] = false;

        if (lifeIndex === next.length - 1){
          setGameOver(true);
        }

        return next;
      });
    }
  }

  async function revealAll() {
    for (let i = 1; i <= baseRankerItems.length; i++){
      setScrambledItems(prev => {
        const next = [...prev];
        const scrambledIndex = next.findIndex(p => p.rank === i);
        next[scrambledIndex].display = false;
        return next;
      })
      setRankedItems(prev => {
        const next = [...prev];
        const rankedIndex = next.findIndex(p => p.rank === i);
        next[rankedIndex].display = true;
        return next;
      })
      await delay(500);
    }
  }

  const allRevealed = rankedItems.every(item => item.display);

  return (
    <DndProvider options={DND_PIPELINE}>
      <DragPreview />
      <div className="min-h-svh w-full flex flex-col items-center justify-center bg-purple-200">
          <h3 className={`${title_font.className} absolute top-5 left-5 text-white font-bold`}>
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
          </div>
          <h1 className={`${title_font.className} absolute top-15 text-white text-4xl font-bold`}>
            Ranker
          </h1>
          <h2 className={`${body_font.className} flex flex-col items-center pt-5 text-purple-900 text-xl font-bold`}>
            {category}
          </h2>
          <div className="flex flex-row items-center pt-3">
            {lives.map((life, i) => (
              life ? (
                <Heart key={i} className="text-purple-900"></Heart>) : (
                <Skull key={i} className="text-purple-900"></Skull>)
            ))}
          </div>
          <div className={allRevealed ? "flex justify-center pt-3" : "grid grid-cols-2 gap-x-20 pt-3"}>
            {!allRevealed && (
              <div>
                {scrambledItems.map((scrambledItem) => (
                  <ScrambledItem key={scrambledItem.rank} item={scrambledItem} />
                ))}
              </div>
            )}
            <motion.div layout>
              {rankedItems.map((rankedItem, i) => (
                <RankedItem key={rankedItem.rank} gameOver={gameOver} index={i} item={rankedItem} onDrop={handleDrop}/>
              ))}
            </motion.div>
          </div>
          {gameOver && (
            <h2 className="flex flex-col items-center pt-5 text-purple-900 text-2xl font-bold">
              GAME OVER
            </h2>
          )}
      </div>
    </DndProvider>
  );
}


function GameInstructions() {
  return (
    <div className="mt-4 space-y-3 text-gray-600">
      <p>Drag each item on the left to its correct spot in the ranking on the right</p>
      <p>Be careful... You only have three lives to complete the game.</p>
      <p>Good luck, young Ranker!</p>
    </div>
  );
}

function DragPreview() {
  return (
    <Preview>
      {({ item, style }) => (
        <div style={style} className="bg-white rounded-2xl px-6 py-4 shadow opacity-80 pointer-events-none">
          <span className="font-semibold text-purple-900">{(item as RankerItem).name}</span>
        </div>
      )}
    </Preview>
  );
}

function ScrambledItem({ item }: { item: RankerItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div className="mt-2">
      {item.display ? (
        <motion.div
          layoutId={`item-${item.rank}`}
          ref={drag as unknown as Ref<HTMLDivElement>}
          className="bg-white rounded-2xl px-5 py-4 shadow cursor-grab"
          style={{ opacity: isDragging ? 0.4 : 1 }}>
          <span className={`${body_font.className} font-semibold text-purple-900`}>{item.name}</span>
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl px-5 py-4 invisible">
          <span className={`${body_font.className} font-semibold invisible`}>placeholder</span>
        </div>
      )}
    </div>
  );
}

function RankedItem({
  gameOver,
  index,
  item,
  onDrop
}: {
  gameOver: boolean;
  index: number;
  item: RankerItem;
  onDrop: (index: number, entry: RankerItem) => void
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: RankerItem) => onDrop(index, item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop as unknown as Ref<HTMLDivElement>}
      className="relative mt-2">
      <div
        className="bg-white rounded-2xl px-5 py-4 shadow"
        style={{ outline: isOver && !item.display ? "2px solid #7c3aed" : undefined }}>
        {item.display
          ? <span className={`${body_font.className} font-semibold invisible`}>{item.name}</span>
          : <span className={`${body_font.className} text-gray-300`}>{item.rank}</span>}
      </div>
      {item.display && (
        <motion.div
          layoutId={`item-${item.rank}`}
          className="bg-white rounded-2xl px-5 py-4 shadow absolute inset-0">
          <span className={`${body_font.className} font-semibold text-purple-900`}>{item.name}</span>
        </motion.div>
      )}
    </div>
  );

}
