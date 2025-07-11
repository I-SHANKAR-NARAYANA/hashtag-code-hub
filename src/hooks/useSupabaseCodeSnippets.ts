
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CodeSnippet } from '../types';

export const useSupabaseCodeSnippets = () => {
  const queryClient = useQueryClient();

  // Fetch all code snippets
  const { data: snippets = [], isLoading, error } = useQuery({
    queryKey: ['code-snippets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((snippet): CodeSnippet => ({
        id: snippet.id,
        code: snippet.code,
        hashtags: snippet.hashtags,
        author: snippet.author,
        createdAt: new Date(snippet.created_at),
      }));
    },
  });

  // Fetch saved snippets for current user
  const { data: savedSnippets = [] } = useQuery({
    queryKey: ['saved-snippets'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_snippets')
        .select('snippet_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(s => s.snippet_id);
    },
    enabled: true,
  });

  // Add snippet mutation
  const addSnippetMutation = useMutation({
    mutationFn: async ({ code, hashtags, author }: { code: string; hashtags: string[]; author: string }) => {
      const { data, error } = await supabase
        .from('code_snippets')
        .insert({
          code: code.trim(),
          hashtags: hashtags.map(tag => tag.toLowerCase().replace(/^#/, '')),
          author,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-snippets'] });
    },
  });

  // Delete snippet mutation
  const deleteSnippetMutation = useMutation({
    mutationFn: async (snippetId: string) => {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', snippetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-snippets'] });
      queryClient.invalidateQueries({ queryKey: ['saved-snippets'] });
    },
  });

  // Save snippet mutation
  const saveSnippetMutation = useMutation({
    mutationFn: async (snippetId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('saved_snippets')
        .insert({
          user_id: user.id,
          snippet_id: snippetId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-snippets'] });
    },
  });

  // Unsave snippet mutation
  const unsaveSnippetMutation = useMutation({
    mutationFn: async (snippetId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('saved_snippets')
        .delete()
        .eq('user_id', user.id)
        .eq('snippet_id', snippetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-snippets'] });
    },
  });

  const addSnippet = (code: string, hashtags: string[], author: string) => {
    addSnippetMutation.mutate({ code, hashtags, author });
  };

  const deleteSnippet = (id: string) => {
    deleteSnippetMutation.mutate(id);
  };

  const saveSnippet = (snippetId: string) => {
    saveSnippetMutation.mutate(snippetId);
  };

  const unsaveSnippet = (snippetId: string) => {
    unsaveSnippetMutation.mutate(snippetId);
  };

  const isSnippetSaved = (snippetId: string) => {
    return savedSnippets.includes(snippetId);
  };

  const getSavedSnippets = () => {
    return snippets.filter(snippet => savedSnippets.includes(snippet.id));
  };

  return {
    snippets,
    isLoading,
    error,
    addSnippet,
    deleteSnippet,
    saveSnippet,
    unsaveSnippet,
    isSnippetSaved,
    getSavedSnippets,
  };
};
