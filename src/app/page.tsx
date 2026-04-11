import db from '../../data/db.json';
import Ranker from '../components/Ranker';

export default function Page() {
  const currentDate = new Date().toLocaleDateString();
  const solution = db.solutions.find(s => s.date === currentDate);

  return (solution && <Ranker solution={solution} />);
}