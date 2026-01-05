//

const initstate = {
    newProduct : []
  }
  
  
  export const newProductReducer = (state = initstate, action) => {
      if (action.type === 'NEW_PRODUCT_FORM') {
          return {
              
              newProduct: action.newProduct // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  