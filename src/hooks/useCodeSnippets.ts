
import { useState, useEffect } from 'react';
import { CodeSnippet, SavedSnippet } from '../types';

export const useCodeSnippets = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);

  useEffect(() => {
    // Load snippets from localStorage
    const savedSnippetsData = localStorage.getItem('codeSnippets');
    if (savedSnippetsData) {
      const parsed = JSON.parse(savedSnippetsData);
      setSnippets(parsed.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) })));
    } else {
      // Initialize with some sample data
      const sampleSnippets: CodeSnippet[] = [
        {
          id: '1',
          code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
          hashtags: ['javascript', 'sorting', 'algorithms'],
          author: 'developer1',
          createdAt: new Date(),
        },
        {
          id: '2',
          code: `const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};`,
          hashtags: ['javascript', 'utility', 'performance'],
          author: 'developer2',
          createdAt: new Date(),
        },
      ];
      setSnippets(sampleSnippets);
      localStorage.setItem('codeSnippets', JSON.stringify(sampleSnippets));
    }

    // Load saved snippets
    const savedSnippetsData = localStorage.getItem('savedSnippets');
    if (savedSnippetsData) {
      setSavedSnippets(JSON.parse(savedSnippetsData));
    }
  }, []);

  const addSnippet = (code: string, hashtags: string[], author: string) => {
    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      code: code.trim(),
      hashtags: hashtags.map(tag => tag.toLowerCase().replace(/^#/, '')),
      author,
      createdAt: new Date(),
    };
    
    const updatedSnippets = [newSnippet, ...snippets];
    setSnippets(updatedSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
  };

  const deleteSnippet = (id: string) => {
    const updatedSnippets = snippets.filter(s => s.id !== id);
    setSnippets(updatedSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
    
    // Also remove from saved snippets
    const updatedSaved = savedSnippets.filter(s => s.snippetId !== id);
    setSavedSnippets(updatedSaved);
    localStorage.setItem('savedSnippets', JSON.stringify(updatedSaved));
  };

  const saveSnippet = (userId: string, snippetId: string) => {
    const alreadySaved = savedSnippets.some(s => s.userId === userId && s.snippetId === snippetId);
    if (!alreadySaved) {
      const updatedSaved = [...savedSnippets, { userId, snippetId }];
      setSavedSnippets(updatedSaved);
      localStorage.setItem('savedSnippets', JSON.stringify(updatedSaved));
    }
  };

  const unsaveSnippet = (userId: string, snippetId: string) => {
    const updatedSaved = savedSnippets.filter(s => !(s.userId === userId && s.snippetId === snippetId));
    setSavedSnippets(updatedSaved);
    localStorage.setItem('savedSnippets', JSON.stringify(updatedSaved));
  };

  const isSnippetSaved = (userId: string, snippetId: string) => {
    return savedSnippets.some(s => s.userId === userId && s.snippetId === snippetId);
  };

  const getSavedSnippets = (userId: string) => {
    const userSavedIds = savedSnippets.filter(s => s.userId === userId).map(s => s.snippetId);
    return snippets.filter(s => userSavedIds.includes(s.id));
  };

  return {
    snippets,
    addSnippet,
    deleteSnippet,
    saveSnippet,
    unsaveSnippet,
    isSnippetSaved,
    getSavedSnippets,
  };
};
