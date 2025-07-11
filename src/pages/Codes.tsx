
import React, { useState } from 'react';
import { useCodeSnippets } from '../hooks/useCodeSnippets';
import { useAuth } from '../contexts/AuthContext';
import CodeSnippetCard from '../components/CodeSnippetCard';
import CreateSnippetForm from '../components/CreateSnippetForm';
import { Search, Plus, Filter, Hash } from 'lucide-react';

const Codes: React.FC = () => {
  const { user } = useAuth();
  const {
    snippets,
    addSnippet,
    deleteSnippet,
    saveSnippet,
    unsaveSnippet,
    isSnippetSaved,
  } = useCodeSnippets();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique hashtags
  const allTags = Array.from(
    new Set(snippets.flatMap(snippet => snippet.hashtags))
  ).sort();

  // Filter snippets based on search query and selected tags
  const filteredSnippets = snippets.filter(snippet => {
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

  const handleCreateSnippet = (code: string, hashtags: string[], author: string) => {
    addSnippet(code, hashtags, author);
    setShowCreateForm(false);
  };

  const handleSaveSnippet = (snippetId: string) => {
    if (user) {
      saveSnippet(user.id, snippetId);
    }
  };

  const handleUnsaveSnippet = (snippetId: string) => {
    if (user) {
      unsaveSnippet(user.id, snippetId);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Code Snippets</h1>
          <p className="text-muted-foreground">
            Discover and share amazing code snippets from the community
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Snippet</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search by hashtags, code, or author..."
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
          <span>Showing {filteredSnippets.length} of {snippets.length} snippets</span>
        ) : (
          <span>{snippets.length} snippets total</span>
        )}
      </div>

      {/* Snippets Grid */}
      {filteredSnippets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <CodeSnippetCard
              key={snippet.id}
              snippet={snippet}
              isSaved={user ? isSnippetSaved(user.id, snippet.id) : false}
              onSave={handleSaveSnippet}
              onUnsave={handleUnsaveSnippet}
              onDelete={deleteSnippet}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchQuery || selectedTags.length > 0 ? (
              <div>
                <p className="text-lg mb-2">No snippets found</p>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2">No snippets yet</p>
                <p>Be the first to share a code snippet!</p>
              </div>
            )}
          </div>
          {(!searchQuery && selectedTags.length === 0) && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Your First Snippet
            </button>
          )}
        </div>
      )}

      {/* Create Snippet Modal */}
      {showCreateForm && (
        <CreateSnippetForm
          onSubmit={handleCreateSnippet}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Codes;
