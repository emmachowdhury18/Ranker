export interface RankerItem {
  name: string;
  rank: number;
}

export interface SourceInformation {
  description: string;
  link: string;
}

export interface Solution {
  category: string;
  items: RankerItem[];
  source: SourceInformation;
}