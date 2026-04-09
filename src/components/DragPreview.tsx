import { Preview } from "react-dnd-multi-backend";
import { RankerItem } from "../types";

export default function DragPreview() {
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