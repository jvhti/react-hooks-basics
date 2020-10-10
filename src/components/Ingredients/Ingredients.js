import React, {useCallback, useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

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

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  return (
      <div className="App">
        <IngredientForm onAddIngredient={addIngredientHandler}/>

        <section>
          <Search onLoadIngredients={filteredIngredientsHandler}/>
          <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        </section>
      </div>
  );
}

export default Ingredients;
