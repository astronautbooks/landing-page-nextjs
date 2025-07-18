-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.book_prices (
  id bigint NOT NULL,
  book_id bigint,
  price_id text,
  created_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  CONSTRAINT book_prices_pkey PRIMARY KEY (id),
  CONSTRAINT book_prices_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT book_prices_price_id_fkey FOREIGN KEY (price_id) REFERENCES public.prices(id)
);
CREATE TABLE public.books (
  id bigint NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  cover text NOT NULL,
  page1 text NOT NULL,
  page2 text NOT NULL,
  page3 text NOT NULL,
  page4 text NOT NULL,
  pages integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  CONSTRAINT books_pkey PRIMARY KEY (id)
);
CREATE TABLE public.order_items (
  id bigint NOT NULL,
  book_price_id bigint NOT NULL,
  order_id bigint,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_book_price_id_fkey FOREIGN KEY (book_price_id) REFERENCES public.book_prices(id)
);
CREATE TABLE public.orders (
  id bigint NOT NULL,
  order_number bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  stripe_session_id text NOT NULL UNIQUE,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.prices (
  id text NOT NULL,
  price numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('America/Sao_Paulo'::text, now()),
  CONSTRAINT prices_pkey PRIMARY KEY (id)
);