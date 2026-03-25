'use client';

import { Heart, Skull } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Ref, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DRAG_TYPE = "ENTRY";

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

interface RankerItem {
  name: string;
  rank: number;
  display?: boolean;
}

function DraggableEntry({ entry }: { entry: RankerItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: entry,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div className="mt-2">
      {entry.display ? (
        <AnimatePresence>
          <motion.div
            layoutId={`item-${entry.rank}`}
            ref={drag as unknown as Ref<HTMLDivElement>}
            className="bg-white rounded-2xl px-6 py-4 shadow cursor-grab"
            style={{ opacity: isDragging ? 0.4 : 1 }}>
            <span className="font-semibold text-purple-800">{entry.name}</span>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="bg-white rounded-2xl px-6 py-4 invisible">
          <span className="font-semibold invisible">placeholder</span>
        </div>
      )}
    </div>
  );
}

function RankedSlot({
  gameOver,
  index,
  entry,
  onDrop
}: {
  gameOver: boolean;
  index: number;
  entry: RankerItem;
  onDrop: (index: number, entry: RankerItem) => void
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: RankerItem) => onDrop(index, item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop as unknown as Ref<HTMLDivElement>}>
      {gameOver ? (
        entry.display ? (
          <AnimatePresence>
            <motion.div 
              className="bg-white rounded-2xl px-6 py-4 shadow mt-2"
              style={{ outline: isOver ? "2px solid #7c3aed" : undefined }}
              layoutId={`item-${entry.rank}`}>
              <span className="font-semibold text-purple-800">{entry.name}</span>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-white rounded-2xl px-6 py-4 shadow mt-2">
            <span className="text-gray-300">{entry.rank}</span>
          </div>
        )
      ) : (
        <div
          className="bg-white rounded-2xl px-6 py-4 shadow mt-2"
          style={{ outline: isOver ? "2px solid #7c3aed" : undefined }}>
          <div>
            {entry.display ?
              (<span className="font-semibold text-purple-800">{entry.name}</span>) :
              (<span className="text-gray-300">{entry.rank}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [unrankedItems, setUnrankedItems] = useState<(RankerItem)[]>(() => initializeUnrankedItems());
  const [rankedItems, setRankedItems] = useState<(RankerItem)[]>(() => initializeRankedItems());
  const [lives, setLives] = useState(Array(3).fill(true));
  const [gameOver, setGameOver] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (gameOver) revealAll();                                                  
  }, [gameOver]);

  function initializeUnrankedItems(): RankerItem[] {
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
      setUnrankedItems((prev) => {
        const next = [...prev];
        const unrankedIndex = next.findIndex(p => p.rank === entry.rank);
        next[unrankedIndex].display = false;
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
      setUnrankedItems(prev => {
        const next = [...prev];
        const index = next.findIndex(p => p.rank === i);
        next[index].display = false;
        return next;
      })
      setRankedItems(prev => {
        const next = [...prev];
        const index = next.findIndex(p => p.rank === i);
        next[index].display = true;
        return next;
      })
      if (i < baseRankerItems.length) {
        await delay(500);
      }
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full flex flex-col items-center pt-16 bg-purple-200">
        <h1 className="flex flex-col items-center text-white text-4xl font-bold">
          Ranker
        </h1>
        <h2 className="flex flex-col items-center pt-5 text-purple-800 text-2xl font-bold">
          {category}
        </h2>
        <div className="flex flex-row items-center pt-3">
          {lives.map((life, i) => (
            life ? (
              <Heart key={i} className="text-purple-800"></Heart>) : (
              <Skull key={i} className="text-purple-800"></Skull>)
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-20 pt-3">
          <div>
            {unrankedItems.map((unkrankedEntry) => (
              <DraggableEntry key={unkrankedEntry.rank} entry={unkrankedEntry} />
            ))}
          </div>
          <div>
            {rankedItems.map((rankedEntry, i) => (
              <RankedSlot key={rankedEntry.rank} gameOver={gameOver} index={i} entry={rankedEntry} onDrop={handleDrop}/>
            ))}
          </div>
        </div>
        {gameOver && (
          <h2 className="flex flex-col items-center pt-5 text-purple-800 text-2xl font-bold">
            GAME OVER
          </h2>
        )}
      </div>
    </DndProvider>
  );
}
