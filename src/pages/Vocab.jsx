import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Vocab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');
  
  const navigate = useNavigate();

  const signLibrary = [
    { id: 1, word: 'Hello', unit: 'Unit 1: Fundamentals', category: 'Greetings', icon: '👋' },
    { id: 2, word: 'Thank You', unit: 'Unit 1: Fundamentals', category: 'Greetings', icon: '🙏' },
    { id: 3, word: 'Please', unit: 'Unit 1: Fundamentals', category: 'Manners', icon: '🤲' },
    { id: 4, word: 'Family', unit: 'Unit 2: People', category: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 5, word: 'Friend', unit: 'Unit 2: People', category: 'People', icon: '🤝' },
    { id: 6, word: 'Love', unit: 'Unit 3: Emotions', category: 'Emotions', icon: '❤️' },
  ];

  const categories = ['All', ...new Set(signLibrary.map(sign => sign.category))];
  const units = ['All', ...new Set(signLibrary.map(sign => sign.unit))];

  const filteredSigns = signLibrary.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sign.category === selectedCategory;
    const matchesUnit = selectedUnit === 'All' || sign.unit === selectedUnit;
    return matchesSearch && matchesCategory && matchesUnit;
  });

  return (
    <div className="page vocab-container">
      <div className="vocab-header">
        <h2>ASL SIGN VOCABULARY</h2>
        <p>Search, test, and explore signs freely outside of lessons.</p>
      </div>

      <div className="vocab-controls">
        <input 
          type="text" 
          placeholder="Search for a sign (e.g., Hello)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="vocab-search-input"
        />

        <div className="filter-group">
          <label>Filter by Unit: </label>
          <select 
            value={selectedUnit} 
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="vocab-select"
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="category-chips">
          {categories.map(cat => (
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

      <div className="vocab-grid">
        {filteredSigns.length > 0 ? (
          filteredSigns.map(sign => (
            <div key={sign.id} className="vocab-card">
              <div className="sign-preview-box">
                <span className="sign-icon">{sign.icon}</span>
              </div>
              <div className="sign-info">
                <h3>{sign.word}</h3>
                <div className="badge-container">
                  <span className="sign-unit-badge">{sign.unit}</span>
                  <span className="sign-cat-badge">{sign.category}</span>
                </div>
              </div>
              <button 
                className="practice-now-btn" 
                onClick={() => navigate(`/vocab/${sign.word.toLowerCase()}`)}
              >
                Practice Sign
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No signs found matching your search or filters.</p>
        )}
      </div>
    </div>
  );
}

export default Vocab;