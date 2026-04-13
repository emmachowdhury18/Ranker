import { bodyFont } from "@/src/constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Archive } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

export default function ArchiveModal({ open, onOpenChange, onDateSelect } : {
  open: boolean;
  onOpenChange: (open: boolean) => void; 
  onDateSelect: (date: Date) => void; })
{
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="[&_svg]:size-6 focus-visible:ring-0 hover:bg-transparent hover:text-white cursor-pointer">
          <Archive className="size-6"/>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className={`${bodyFont.className} text-gray-700 text-lg relative flex items-center justify-center`}>Archive</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center ">
          <Calendar
            startMonth={new Date("4/1/2026")}
            endMonth={new Date()}
            disabled={(date) => date < new Date(new Date("4/9/2026").setHours(0, 0, 0, 0)) || date > new Date(new Date().setHours(0, 0, 0, 0))}
            mode="single"
            selected={date}
            onSelect={(date) => { if (date) { setDate(date); onDateSelect(date); } }}
            className={`${bodyFont.className} text-gray-700 rounded-lg [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]`}
            captionLayout="label"
          />
        </div>
      </DialogContent>
    </Dialog>  
  );
}