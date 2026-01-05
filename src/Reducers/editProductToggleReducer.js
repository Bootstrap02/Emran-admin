//

const initstate = {
    editProductToggle : {}
  }
  
  
  export const editProductToggleReducer = (state = initstate, action) => {
      if (action.type === 'TOGGLE_EDIT_PRODUCT_FORM') {
          return {
              editProductToggle: action.editProductToggle // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  
  
  
  
  