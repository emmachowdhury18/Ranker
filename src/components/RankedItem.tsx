import { motion } from "motion/react";
import { useDrop } from "react-dnd";
import { bodyFont, DRAG_TYPE } from "../constants";
import { Ref } from "react";
import { RankerItem } from "../types";


export default function RankedItem({
  index,
  item,
  isRevealed,
  isAnimated,
  onDrop
}: {
  index: number;
  item: RankerItem;
  isRevealed: boolean;
  isAnimated: boolean;
  onDrop: (index: number, entry: RankerItem) => void
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: RankerItem) => onDrop(index, item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={drop as unknown as Ref<HTMLDivElement>} // react-dnd returns a callback ref, not a RefObject
      className="relative mt-2">
      <div
        className="bg-white rounded-2xl px-5 h-14 flex items-center shadow"
        style={{ outline: isOver && !isRevealed ? "2px solid #7c3aed" : undefined }}>
        {isRevealed
          ? <span className={`${bodyFont.className} font-semibold invisible justify-center text-base text-center`}>{item.name}</span> 
          : <span className={`${bodyFont.className} text-gray-300 text-base`}>{item.rank}</span>}
      </div>
      {isRevealed && (
        <motion.div
          layoutId={isAnimated ? `item-${item.rank}` : undefined}
          className="bg-white rounded-2xl px-5 flex items-center justify-center shadow absolute inset-0">
          <span className={`${bodyFont.className} font-semibold text-purple-900 text-base text-center`}>{item.name}</span>
        </motion.div>
      )}
    </div>
  );
}
