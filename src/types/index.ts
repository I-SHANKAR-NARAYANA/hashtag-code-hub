
export interface CodeSnippet {
  id: string;
  code: string;
  hashtags: string[];
  author: string;
  createdAt: Date;
}

export interface SavedSnippet {
  userId: string;
  snippetId: string;
}
