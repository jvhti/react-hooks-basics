import React, {useEffect, useRef, useState} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (filter !== inputRef.current.value) return;

      const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;

      fetch('https://ingredients-list-a6589.firebaseio.com/ingredients.json' + query).then(res => res.json()).then(res => {
        const loadedIngredients = [];
        for (const key in res) {
          loadedIngredients.push({id: key, title: res[key].title, amount: res[key].amount});
        }

        onLoadIngredients(loadedIngredients);
      });
    }, 500);
    // Note: This is generating a lot of timeouts, could hurt the performance
  }, [filter, onLoadIngredients, inputRef]);

  return (
      <section className="search">
        <Card>
          <div className="search-input">
            <label>Filter by Title</label>
            <input ref={inputRef} type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
          </div>
        </Card>
      </section>
  );
});

export default Search;
