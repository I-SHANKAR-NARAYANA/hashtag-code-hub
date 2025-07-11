
import React, { useState } from 'react';
import { useSupabaseCodeSnippets } from '../hooks/useSupabaseCodeSnippets';
import { useAuth } from '../contexts/AuthContext';
import CodeSnippetCard from '../components/CodeSnippetCard';
import { Search, BookmarkCheck, Hash, Filter, Loader2 } from 'lucide-react';

const Saved: React.FC = () => {
  const { user } = useAuth();
  const {
    getSavedSnippets,
    unsaveSnippet,
    deleteSnippet,
    isLoading,
    error,
  } = useSupabaseCodeSnippets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const savedSnippets = getSavedSnippets();

  // Get all unique hashtags from saved snippets
  const allTags = Array.from(
    new Set(savedSnippets.flatMap(snippet => snippet.hashtags))
  ).sort();

  // Filter saved snippets based on search query and selected tags
  const filteredSnippets = savedSnippets.filter(snippet => {
    const matchesSearch = searchQuery === '' || 
      snippet.hashtags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => snippet.hashtags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleUnsaveSnippet = (snippetId: string) => {
    if (user) {
      unsaveSnippet(snippetId);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Please log in to view saved snippets</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg">Loading saved snippets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p className="text-lg mb-2">Error loading saved snippets</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <BookmarkCheck className="h-7 w-7 text-primary" />
          <span>Saved Snippets</span>
        </h1>
        <p className="text-muted-foreground">
          Your personal collection of saved code snippets
        </p>
      </div>

      {savedSnippets.length > 0 && (
        <>
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search your saved snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  <span>Filter by tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1 ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-accent'
                      }`}
                    >
                      <Hash className="h-3 w-3" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground">
            {searchQuery || selectedTags.length > 0 ? (
              <span>Showing {filteredSnippets.length} of {savedSnippets.length} saved snippets</span>
            ) : (
              <span>{savedSnippets.length} saved snippets</span>
            )}
          </div>
        </>
      )}

      {/* Snippets Grid */}
      {filteredSnippets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <CodeSnippetCard
              key={snippet.id}
              snippet={snippet}
              isSaved={true}
              onUnsave={handleUnsaveSnippet}
              onDelete={deleteSnippet}
            />
          ))}
        </div>
      ) : savedSnippets.length > 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">No snippets found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <BookmarkCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No saved snippets yet</p>
            <p>Start saving snippets you find useful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saved;
