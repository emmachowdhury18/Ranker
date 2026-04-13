import { Preview } from "react-dnd-multi-backend";
import { RankerItem } from "../../types";
import { bodyFont } from "../../constants";

export default function DragPreview() {
  return (
    <Preview>
      {({ item }) => (
        <div className="bg-white h-16 rounded-2xl px-5 flex items-center shadow opacity-80 pointer-events-none">
          <span className={`${bodyFont.className} font-semibold text-purple-300 text-base text-center`}>{(item as RankerItem).name}</span>
        </div>
      )}
    </Preview>
  );
}