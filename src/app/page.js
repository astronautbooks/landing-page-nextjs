import { getBooks } from '@/lib/getBooks';
import HomeClient from './components/HomeClient';

export default async function Home() {
  const books = await getBooks();
  return <HomeClient books={books} />;
}
