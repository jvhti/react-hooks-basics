import React, {useCallback, useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
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
      setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
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
      setIngredients(prevIngredients => prevIngredients.filter(x => x.id !== id));
    }).catch(error => {
      setError("Something went wrong!");
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
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
