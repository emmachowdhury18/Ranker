import { motion } from "motion/react";
import { useDrag } from "react-dnd";
import { bodyFont, DRAG_TYPE } from "../constants";
import { Ref } from "react";
import { RankerItem } from "../types";

export default function ScrambledItem({ item, isRevealed, cardHeight }: { item: RankerItem; isRevealed: boolean; cardHeight: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div className="mt-2">
      {!isRevealed ? (
        <motion.div
          layoutId={`item-${item.rank}`}
          ref={drag as unknown as Ref<HTMLDivElement>} // react-dnd returns a callback ref, not a RefObject
          className="bg-white rounded-2xl px-5 flex items-center shadow cursor-grab justify-center"
          style={{ height: cardHeight, opacity: isDragging ? 0.4 : 1 }}>
          <span className={`${bodyFont.className} font-semibold text-purple-900 text-base text-center`}>{item.name}</span>
        </motion.div>
      ) : (
        <div style={{ height: cardHeight }} aria-hidden />
      )}
    </div>
  );
}