import { bodyFont, bodyFontLight } from "@/src/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CircleQuestionMark } from "lucide-react";
import { Button } from "../ui/button";

export default function GameInstructionsModal({ open, onOpenChange } : {
  open: boolean;
  onOpenChange: (open: boolean) => void; })
{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="[&_svg]:size-6 focus-visible:ring-0 hover:bg-transparent hover:text-purple-900 cursor-pointer">
          <CircleQuestionMark className="size-6"/>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className={`${bodyFont.className} text-gray-700 text-lg relative flex items-center justify-center`}>Instructions</DialogTitle>
        </DialogHeader>
        <div className={`${bodyFontLight.className} text-gray-700 wrap-break-word`}>
          <p>
            Drag each item on the left to its correct spot in the ranking on the right. 
            Keep in mind that these are comparative rankings, not a definitive top five list.
          </p>
          <br />
          <p>
            If you place an item in an incorrect rank, you lose a life. 
            Be careful... You only have three lives to complete the game.
          </p>
          <br />
          <p>Good luck, young Ranker!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}