import React, {useCallback, useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://ingredients-list-a6589.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
      setIsLoading(false);
    })
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://ingredients-list-a6589.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(() => {
      setIngredients(prevIngredients => prevIngredients.filter(x => x.id !== id));
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  return (
      <div className="App">
        <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

        <section>
          <Search onLoadIngredients={filteredIngredientsHandler}/>
          <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        </section>
      </div>
  );
}

export default Ingredients;
