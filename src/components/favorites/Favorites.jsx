import React from 'react';

const Favorites = ({
  storedFacts,
  removeStoredFact,
}) => (
  <section className="favoriteTab">
    <div className="favoriteTab-header">
      <h2>My favorite facts</h2>
    </div>
    <div className="favoriteTab-list">
      <section className="favoriteFacts">
        {storedFacts.length === 0 && (
          <i>There are no facts here yet.</i>
        )}
        {storedFacts.length !== 0 && (
          storedFacts.map((fact, factIndex) => (
            <button
              key={factIndex}
              onClick={() => removeStoredFact(factIndex)}
              className="favoriteFacts-fact"
            >
              {fact}
            </button>
          ))
        )}
      </section>
    </div>
  </section>
);

export default Favorites;
