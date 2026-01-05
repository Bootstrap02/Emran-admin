//

const initstate = {
    conversationId : null
  }
  
  
  export const conversationIdReducer = (state = initstate, action) => {
      if (action.type === 'GET_CONVERSATION_ID') {
          return {
              conversationId: action.conversationId // Concatenate the new todo to the todos array
          }
      }
  
      
      return state;
  }
  
  
  
  
  
  