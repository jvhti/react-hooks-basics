import React, {useCallback, useReducer} from 'react';

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

const httpReducer = (state, action) => {
  switch (action.type) {
    case 'SEND':
      return {isLoading: true, error: null};
    case 'RESPONSE':
      return {...state, isLoading: false};
    case 'ERROR':
      return {isLoading: false, error: action.error};
    case 'CLEAR_ERROR':
      return {...state, error: null};
    default:
      throw new Error('Should not get here!');
  }
}

function Ingredients() {
  const [ingredients, dispatchToIngredients] = useReducer(ingredientReducer, []);
  const [httpState, dispatchToHttp] = useReducer(httpReducer, {isLoading: false, error: null});

  const addIngredientHandler = ingredient => {
    dispatchToHttp({type: 'SEND'});
    fetch('https://ingredients-list-a6589.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      return response.json();
    }).then(responseData => {
      dispatchToHttp({type: 'RESPONSE'});
      dispatchToIngredients({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
    }).catch(error => {
      dispatchToHttp({type: 'ERROR', error: "Something went wrong!"});
    });
  };

  const removeIngredientHandler = id => {
    dispatchToHttp({type: 'SEND'});
    fetch(`https://ingredients-list-a6589.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(() => {
      dispatchToHttp({type: 'RESPONSE'});
      dispatchToIngredients({type: 'DELETE', id})
    }).catch(error => {
      dispatchToHttp({type: 'ERROR', error: "Something went wrong!"});
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatchToIngredients({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const clearError = () => dispatchToHttp({type: 'CLEAR_ERROR'});

  return (
      <div className="App">
        {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
        <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.isLoading}/>

        <section>
          <Search onLoadIngredients={filteredIngredientsHandler}/>
          <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
        </section>
      </div>
  );
}

export default Ingredients;
