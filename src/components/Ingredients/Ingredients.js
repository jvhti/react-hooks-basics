import React, {useCallback, useEffect, useMemo, useReducer} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

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
  const {isLoading, error, data, extra, sendRequest, identifier, clear} = useHttp();

  useEffect(() => {
    if (isLoading || error) return;

    if (identifier === 'DELETE')
      dispatchToIngredients({type: 'DELETE', id: extra})
    else if (identifier === 'ADD')
      dispatchToIngredients({type: 'ADD', ingredient: {id: data.name, ...extra}})
  }, [data, extra, identifier, isLoading, error]);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://ingredients-list-a6589.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), ingredient, 'ADD');
  }, [sendRequest]);

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(`https://ingredients-list-a6589.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'DELETE');
  }, [sendRequest]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatchToIngredients({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>;
  }, [ingredients, removeIngredientHandler]);

  return (
      <div className="App">
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
        <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

        <section>
          <Search onLoadIngredients={filteredIngredientsHandler}/>
          {ingredientList}
        </section>
      </div>
  );
}

export default Ingredients;
