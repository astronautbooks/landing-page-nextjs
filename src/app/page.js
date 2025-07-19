// import { getBooks } from '@/lib/getBooks';
import HomeClient from './components/HomeClient';

export default async function Home() {
  // const books = await getBooks();
  // Fetch books from Stripe via Netlify Function
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/.netlify/functions/get-books-from-stripe`, { cache: 'no-store' });
  const books = await res.json();
  return <HomeClient books={books} />;
}
