//

const initstate = {
    university : {
        label: "All Universities",
        value: "All Universities",
       }
                  }
  
  
  export const universityReducer = (state = initstate, action) => {
      if (action.type === 'CHANGE_UNIVERSITY') {
          return {
              state,
              university: action.university // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  