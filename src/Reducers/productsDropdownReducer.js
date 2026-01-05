//

const initstate = {
    productDropdown : []
  }
  
  
  export const productsDropdownReducer = (state = initstate, action) => {
      if (action.type === 'SEND_PRODUCT_DROPDOWNS') {
          return {
              productDropdown: action.product // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  
  
  
  
  