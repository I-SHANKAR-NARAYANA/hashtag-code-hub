
-- Create code_snippets table
CREATE TABLE public.code_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_snippets table for user bookmarks
CREATE TABLE public.saved_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  snippet_id UUID REFERENCES public.code_snippets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, snippet_id)
);

-- Enable Row Level Security
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_snippets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for code_snippets (public read, authenticated users can create/delete)
CREATE POLICY "Anyone can view code snippets" 
  ON public.code_snippets 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create code snippets" 
  ON public.code_snippets 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Anyone can delete code snippets" 
  ON public.code_snippets 
  FOR DELETE 
  USING (true);

-- RLS Policies for saved_snippets (users can only manage their own saves)
CREATE POLICY "Users can view their own saved snippets" 
  ON public.saved_snippets 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save snippets" 
  ON public.saved_snippets 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their snippets" 
  ON public.saved_snippets 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Insert some sample data
INSERT INTO public.code_snippets (code, hashtags, author) VALUES
(
  'function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}',
  ARRAY['javascript', 'sorting', 'algorithms'],
  'developer1'
),
(
  'const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};',
  ARRAY['javascript', 'utility', 'performance'],
  'developer2'
);
