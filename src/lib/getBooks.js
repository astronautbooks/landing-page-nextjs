import { supabase } from './supabaseClient';

export async function getBooks() {
  // Busca livros e seus preços relacionados via book_prices
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      book_prices (
        *,
        price:price_id(*)
      )
    `)
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
} 