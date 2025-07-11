
import React, { useState } from 'react';
import { Plus, X, Hash, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CreateSnippetFormProps {
  onSubmit: (code: string, hashtags: string[], author: string) => void;
  onCancel: () => void;
}

const CreateSnippetForm: React.FC<CreateSnippetFormProps> = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim() && !hashtags.includes(currentTag.trim().toLowerCase())) {
      setHashtags([...hashtags, currentTag.trim().toLowerCase()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && hashtags.length > 0 && user) {
      onSubmit(code, hashtags, user.username);
      setCode('');
      setHashtags([]);
      setCurrentTag('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Create Code Snippet</h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code snippet here..."
                className="w-full h-48 p-3 bg-secondary border rounded-lg resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Hashtags Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Hashtags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    <Hash className="h-3 w-3" />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add hashtag (e.g., javascript, sorting)"
                  className="flex-1 p-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
              {hashtags.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Add at least one hashtag to categorize your snippet
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!code.trim() || hashtags.length === 0}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Snippet</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSnippetForm;
