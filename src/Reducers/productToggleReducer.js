//

const initstate = {
    productToggle : ''
  }
  
  
  export const productToggleReducer = (state = initstate, action) => {
      if (action.type === 'TOGGLE_PRODUCT_AND_SERVICE') {
          return {
              productToggle: action.productToggle // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  
  
  
  
  