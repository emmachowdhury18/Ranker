import { bodyFont, bodyFontLight } from "@/src/constants";
import { SourceInformation } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Info } from "lucide-react";
import { Button } from "../ui/button";

export default function Source({ open, onOpenChange, source }: {   
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: SourceInformation }) 
{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="[&_svg]:size-5">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className={`${bodyFont.className} text-gray-700 text-lg relative flex items-center justify-center`}>Source</DialogTitle>
        </DialogHeader>
        <div aria-describedby={undefined} className={`${bodyFontLight.className} text-gray-700 wrap-break-word`}>
          <p>{ source.description }</p>
          <br />
          <a href={source.link} className="text-sm text-blue-600 underline break-all">{source.link}</a>
        </div>
      </DialogContent>
    </Dialog>  
  );
}