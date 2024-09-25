// reducer.js
// i used my past web dev project as a reference to the syntax and how its all laid out
// i used chatgbt to get a template of everything i needed. for instance i got everything to work, but i forgot i had to wrap the layout.js with <Provider>
const initialState = {
    files: [],
    question: '',
    questionlist: [],
    movie: '',
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_FILES':
        return { ...state, files: action.payload };
      case 'SET_QUESTION':
        return { ...state, question: action.payload };
      case 'SET_QUESTIONSLIST':
        return { ...state, questionlist: action.payload };
      case 'SET_MOVIE':
        return { ...state, movie: action.payload };
      default:
        return state;
    }
  };
  
  // Action creators
  export const setFiles = (files) => ({ type: 'SET_FILES', payload: files });
  export const setQuestion = (question) => ({ type: 'SET_QUESTION', payload: question });
  export const setQuestionslist = (questionlist) => ({ type: 'SET_QUESTIONSLIST', payload: questionlist });
  export const setMovie = (movie) => ({ type: 'SET_MOVIE', payload: movie });
  
  export default rootReducer;
  