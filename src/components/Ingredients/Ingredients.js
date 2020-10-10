import React, {useEffect, useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://ingredients-list-a6589.firebaseio.com/ingredients.json').then(res => res.json()).then(res => {
      const loadedIngredients = [];
      for (const key in res) {
        loadedIngredients.push({id: key, title: res[key].title, amount: res[key].amount});
      }
      setIngredients(loadedIngredients);
    });
  }, []);

  const addIngredientHandler = ingredient => {
    fetch('https://ingredients-list-a6589.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
    })
  };

  const removeIngredientHandler = id => {
    setIngredients(prevIngredients => prevIngredients.filter(x => x.id !== id));
  }

  return (
      <div className="App">
        <IngredientForm onAddIngredient={addIngredientHandler}/>

        <section>
          <Search/>
          <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        </section>
      </div>
  );
}

export default Ingredients;
