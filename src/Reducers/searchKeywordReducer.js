//

const initstate = {
    searchKeyword : []
  }
  
  
  export const searchKeywordReducer = (state = initstate, action) => {
      if (action.type === 'SEND_SEARCH_KEYWORD') {
          return {
              ...state,
              searchKeyword: action.searchKeyword // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  