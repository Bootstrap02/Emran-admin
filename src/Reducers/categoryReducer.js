//

const initstate = {
    category : []
  }
  
  
  export const categoryReducer = (state = initstate, action) => {
      if (action.type === 'GET_CATEGORY') {
          return {
              ...state,
              category: action.category // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  
  

  
  
  