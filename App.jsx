import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Daily Motivation Dashboard
 * A React component that fetches and manages motivational quotes.
 */
const App = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedQuotes, setLikedQuotes] = useState(() => {
    // Initialize likedQuotes from localStorage
    const saved = localStorage.getItem('likedQuotes');
    return saved ? JSON.parse(saved) : [];
  });

  // Function to fetch a random quote from the API
  const fetchQuote = async () => {
    setLoading(true);
    try {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const targetUrl = "https://zenquotes.io/api/random";
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const zenData = JSON.parse(data.contents);
      if (zenData && Array.isArray(zenData) && zenData.length > 0) {
        setQuote({ content: zenData[0].q, author: zenData[0].a });
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote({ 
        content: "Be the change that you wish to see in the world.", 
        author: "Mahatma Gandhi" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch an initial quote on mount
  useEffect(() => {
    fetchQuote();
  }, []);

  // Save liked quotes to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('likedQuotes', JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  // Toggle liking a quote
  const toggleLike = () => {
    if (!quote) return;
    const isLiked = likedQuotes.some(q => q.content === quote.content);
    if (isLiked) {
      setLikedQuotes(likedQuotes.filter(q => q.content !== quote.content));
    } else {
      setLikedQuotes([...likedQuotes, quote]);
    }
  };

  // Remove a quote from the favorites list
  const removeQuote = (contentToRemove) => {
    setLikedQuotes(likedQuotes.filter(q => q.content !== contentToRemove));
  };

  const isCurrentQuoteLiked = quote && likedQuotes.some(q => q.content === quote.content);

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="header">
          <h1 className="app-title">Daily Motivation</h1>
          <div className="app-subtitle">Fuel your day with inspiration</div>
        </header>

        <main className="quote-display">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Fetching inspiration...</p>
            </div>
          ) : quote ? (
            <div className="quote-section">
              <div className="quote-wrapper">
                <span className="quote-icon">“</span>
                <p className="quote-content">{quote.content}</p>
                <div className="author-section">
                  <div className="author-line"></div>
                  <p className="author-name">{quote.author}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-text">No quote available. Try again!</div>
          )}
        </main>

        <footer className="footer">
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={fetchQuote} 
              disabled={loading}
            >
              New Quote
            </button>
            
            <button 
              className={`btn btn-secondary ${isCurrentQuoteLiked ? 'is-liked' : ''}`}
              onClick={toggleLike}
            >
              {isCurrentQuoteLiked ? '♥ Liked' : '♡ Like'}
            </button>
          </div>

          <div className="stats-container">
            <span className="stats-label">Favorites:</span>
            <span className="stats-count">{likedQuotes.length}</span>
          </div>
        </footer>
      </div>

      {likedQuotes.length > 0 && (
        <div className="liked-list-section">
          <h2 className="liked-title">Your Favorites</h2>
          <div className="liked-list">
            {likedQuotes.map((q, index) => (
              <div key={index} className="liked-item">
                <div className="liked-content-wrapper">
                  <p className="liked-quote-text">"{q.content}"</p>
                  <p className="liked-quote-author">— {q.author}</p>
                </div>
                <button 
                  className="btn-remove"
                  onClick={() => removeQuote(q.content)}
                >
                  Remove ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Background blobs for aesthetic depth */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
};

export default App;
