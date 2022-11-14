import React, {useState} from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  const [holeArticles, setHoleArticles] = useState([]);
  // const [savedHoles, setSavedHoles] = useState([]);

  const handleSearch = async event => {
    // If we don't type anything in the search bar, don't search:
    event.preventDefault();
    if (search === '') return;
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;
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
      <div class='PageTop'>
        <h1 class='PageTitle'>Wiki<span>-</span>Holes</h1>
          <p>Search Wikipedia and save articles to read that peak your interest!</p>
      </div>
      <div className="App">
        <header> 
          <form className='SearchBar' onSubmit={handleSearch}>
            <input 
              type='search'
              placeholder='Type a topic to explore...'
              value = {search}
              onChange = {e => setSearch(e.target.value)} />
          </form>
        </header>
        <div class='Main'>
          <SearchResults articles={results} addArticleToHole={addArticleToHole} />
          <Hole articles={holeArticles} removeArticleFromHole={removeArticleFromHole} />
        </div>
        {/* <MyWikiHoles /> */}
      </div>
    </div>
  );
  

  function SearchResults(props){
    return (
      <div className='SearchResults'>
          <h2>Search Results {(searchInfo.totalhits) ? <span>: <span className='TotalHits'>{searchInfo.totalhits}</span></span> : ''} </h2>
          <div className='ArticleList'>
            {
              props.articles.map(article => {
                const url = `https://en.wikipedia.org/?curid=${article.pageid}`;
                return(<Article
                    key={article.id}
                    url={url}
                    article={article}
                    articleActionCharacter='+'
                    handleArticleAction={props.addArticleToHole}/>
                )
              })
            }
          </div>
      </div>
    )
  }

  function Article(props){
    return (
      <div className='Article'>
          <div className='Article-information'>
            <h3 className='Article-title'>{props.article.title}</h3>
            <p className='Result-snippet' dangerouslySetInnerHTML={{__html: props.article.snippet}}></p>
            <a href={props.url} target='_blank' rel='noreferrer' className='ArticleButton'>Visit Page</a>
          </div>
          <button className='Article-action' onClick={() => props.handleArticleAction(props.article)}>
            {props.articleActionCharacter}
          </button>
      </div>
    )
  }

  function Hole(props) {
    // const [holeName, setHoleName] = useState('New Hole');

    // async function handleSave(props) {
    //   // const articleIDs = props.articles.map(t => t.id)
    //   saveHole(savedHoles)
    // }

    return (
      <div className='Hole'>
        <h2>My Wiki-Hole</h2>
        {/* <input onChange={e => setHoleName(e.target.value)} placeholder={holeName} /> */}
        <div className='ArticleList'>
          {
            props.articles.map(article => {
              return(<Article
                    // holeName = {holeName} 
                    key={article.id}
                    url={url}
                    article={article}
                    articleActionCharacter='-'
                    handleArticleAction={props.removeArticleFromHole} />)
            })
          }
        </div>
        {/* <button 
            className='Hole-save'
            onClick={handleSave}
            savedHole={props.articles}>SAVE WIKI-HOLE</button> */}
      </div>
    )
  }

  function addArticleToHole(article) {
    setHoleArticles(holeArticles => {
      if (holeArticles.includes(article)) {
        return holeArticles
      }
      else {
        return [...holeArticles, article]
      }
    })
  }

  function removeArticleFromHole(article) {
    setHoleArticles(holeArticles => holeArticles.filter((a => article !==  a)));
  }

  // function saveHole(savedHole) {
  //   setSavedHoles(savedHoles => {
  //     return [...savedHoles, savedHole]
  //   }
  //   )
  // }

  // function MyWikiHoles(props) {
  //   return(
  //     <div className='SavedHoles'>
  //       {
  //         props.savedHoles.map(savedHole => {
  //           return(<SavedHole
  //                 key={savedHole.id}
  //                 savedHole={savedHole} />)
  //         })
  //       }
  //     </div>
  //   )
  // }

  // function SavedHole(props) {
  //   return(
  //     <h3>{props.holeName}</h3>
  //   )
  // }

}

export default App;
