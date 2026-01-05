//

const initstate = {
    searchInputs : []
  }
  
  
  export const searchInputsReducer = (state = initstate, action) => {
      if (action.type === 'SEND_SEARCH_INPUTS') {
          return {
              ...state,
              searchInputs: action.searchInputs // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  