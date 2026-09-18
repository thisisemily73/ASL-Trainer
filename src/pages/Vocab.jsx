import { useState } from 'react';

function Vocab() {
const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock sign library data for demonstration purposes
  const signLibrary = [
    { id: 1, word: 'Hello', category: 'Greetings', icon: '👋' },
    { id: 2, word: 'Thank You', category: 'Greetings', icon: '🙏' },
    { id: 3, word: 'Please', category: 'Greetings', icon: '🤲' },
    { id: 4, word: 'Family', category: 'People', icon: '👨‍👩‍👧‍👦' },
    { id: 5, word: 'Friend', category: 'People', icon: '🤝' },
    { id: 6, word: 'Love', category: 'Emotions', icon: '❤️' },
  ];

  const filteredSigns = signLibrary.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page vocab-container">
      <div className="vocab-header">
        <h2>ASL SIGN VOCABULARY</h2>
        <p>Search, test, and explore signs freely outside of lessons.</p>
      </div>

      {/* Search and Filters */}
      <div className="vocab-controls">
        <input 
          type="text" 
          placeholder="Search for a sign (e.g., Hello)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="vocab-search-input"
        />
        <div className="category-chips">
          {['All', 'Greetings', 'People', 'Emotions'].map(cat => (
            <button 
              key={cat} 
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocab Grid Display */}
      <div className="vocab-grid">
        {filteredSigns.length > 0 ? (
          filteredSigns.map(sign => (
            <div key={sign.id} className="vocab-card">
              <div className="sign-preview-box">
                <span className="sign-icon">{sign.icon}</span>
              </div>
              <div className="sign-info">
                <h3>{sign.word}</h3>
                <span className="sign-cat">{sign.category}</span>
              </div>
              <button className="practice-now-btn">Practice Sign</button>
            </div>
          ))
        ) : (
          <p className="no-results">No signs found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default Vocab