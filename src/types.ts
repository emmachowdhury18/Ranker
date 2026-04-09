export interface RankerItem {
  name: string;
  rank: number;
}

export interface Solution {
  category: string;
  items: RankerItem[];
}