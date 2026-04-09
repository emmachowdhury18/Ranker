import db from '../../data/db.json';
import Ranker from '../components/Ranker';

export default function Page() {
  // TO DO: populate DB & then calculate index based on day
  const solution = db.solutions[0];
  return <Ranker solution={solution} />;
}