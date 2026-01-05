//

const initstate = {
    activePage : {}
  }
  
  
  export const activePageReducer = (state = initstate, action) => {
      if (action.type === 'GET_ACTIVEPAGE') {
          return {
              
              activePage: action.activePage // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  
  
  
  
  