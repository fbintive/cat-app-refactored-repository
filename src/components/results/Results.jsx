import React from 'react';

const Results = ({
  fact,
  isFetching,
  getFact,
  isFetchingError,
  addStoredFact,
}) => (
  <section className="results">
    {isFetchingError && <p className="results-placeholder">An error occured, please try again later</p>}
    {(!isFetchingError && isFetching) && <p className="results-placeholder">Getting a fact, please wait...</p>}
    {(!isFetchingError && !isFetching) && <button className="results-fact" onClick={(e) => addStoredFact(e)}>{fact}</button>}
    <div className="results-requests">
      <button disabled={isFetching} className="results-requests-button" onClick={getFact}>Get new fact</button>
      {isFetching && <div className="results-requests-loader"/>}
    </div>
  </section>
);

export default Results;
