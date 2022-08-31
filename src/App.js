import { useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});

  const handleSearch = async event => {
    // If we don't type anything in the search bar, don't search:
    event.preventDefault();
    if (search == '') return;

    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${search}`;
  
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw Error(response.statusText);
    }

    const json = await response.json();
    
    setResults(json.query.search);
    setSearchInfo(json.query.searchinfo);
  }

  return (
    <div>
      <h1>Wiki-Holes</h1>
      <div className="App">
        <header> 
          <form className='SearchBar' onSubmit={handleSearch}>
            <input 
              type='search'
              placeholder='Type a topic to explore...'
              value = {search}
              onChange = {event => setSearch(event.target.value)} />
          </form>
          {(searchInfo.totalhits) ? <p>Search Results: {searchInfo.totalhits}</p> : ''}
        </header>
        <div className='SearchResults'>
          {results.map((result, i) => {
            const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

            return (
              <div className='Result' key={i}>
                <h3>{result.title}</h3>
                <p className='Result-snippet' dangerouslySetInnerHTML={{__html: result.snippet}}></p>
                <a href={url} target='_blank' rel='noreferrer' >Visit Page</a>
                <hr></hr>
              </div>
            )
          })}
          
        </div>
      </div>
    </div>
  );
}

export default App;
