import React, {useCallback, useReducer, useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...state, action.ingredient];
    case 'DELETE':
      return state.filter(x => x.id !== action.id);
    default:
      throw new Error('Should not get here!');
  }
};

function Ingredients() {
  const [ingredients, dispatchToIngredients] = useReducer(ingredientReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://ingredients-list-a6589.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      dispatchToIngredients({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
    }).catch(error => {
      setError("Something went wrong!");
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://ingredients-list-a6589.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(() => {
      dispatchToIngredients({type: 'DELETE', id})
    }).catch(error => {
      setError("Something went wrong!");
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatchToIngredients({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const clearError = () => setError(null);

  return (
      <div className="App">
        {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
        <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

        <section>
          <Search onLoadIngredients={filteredIngredientsHandler}/>
          <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        </section>
      </div>
  );
}

export default Ingredients;
