
import React, { useState } from 'react';
import { CodeSnippet } from '../types';
import { Copy, Bookmark, BookmarkCheck, Trash2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CodeSnippetCardProps {
  snippet: CodeSnippet;
  isSaved?: boolean;
  onSave?: (snippetId: string) => void;
  onUnsave?: (snippetId: string) => void;
  onDelete?: (snippetId: string) => void;
}

const CodeSnippetCard: React.FC<CodeSnippetCardProps> = ({
  snippet,
  isSaved = false,
  onSave,
  onUnsave,
  onDelete,
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleSave = () => {
    if (isSaved && onUnsave) {
      onUnsave(snippet.id);
    } else if (!isSaved && onSave) {
      onSave(snippet.id);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this snippet?')) {
      onDelete(snippet.id);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {snippet.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            by {snippet.author} • {snippet.createdAt.toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>

          {user && (
            <button
              onClick={handleSave}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title={isSaved ? "Unsave snippet" : "Save snippet"}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          )}

          {user && onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
              title="Delete snippet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm">
          <code className="language-javascript">{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippetCard;
