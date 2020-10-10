import {useCallback, useReducer} from "react";

const initialState = {isLoading: false, error: null, data: null, extra: null, identifier: null};

const httpReducer = (state, action) => {
  switch (action.type) {
    case 'SEND':
      return {isLoading: true, error: null, data: null, extra: null, identifier: action.identifier};
    case 'RESPONSE':
      return {...state, isLoading: false, data: action.responseData, extra: action.extra};
    case 'ERROR':
      return {isLoading: false, error: action.error};
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not get here!');
  }
};

const useHttp = () => {
  const [httpState, dispatchToHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchToHttp({type: 'CLEAR'}), []);

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchToHttp({type: 'SEND', identifier});
    fetch(url, {method, body, headers: {'Content-Type': 'application/json'}})
        .then(response => response.json())
        .then(responseData => dispatchToHttp({type: 'RESPONSE', responseData, extra}))
        .catch(() => {
          dispatchToHttp({type: 'ERROR', error: "Something went wrong!"});
        });
  }, []);

  return {
    isLoading: httpState.isLoading,
    error: httpState.error,
    data: httpState.data,
    extra: httpState.extra,
    identifier: httpState.identifier,
    sendRequest,
    clear
  };
};

export default useHttp;
