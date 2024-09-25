"use client"

import React, { createContext, useState, useContext } from 'react';

export const StateContext = createContext();

// export const StateProvider = ({ children }) => {


 
//   const [files, setFiles] = useState([]);
//   const [questionlist, setQuestionslist] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [movie, setMovie] = useState("");

//   return (
//     <StateContext.Provider
//       value={{files, setFiles, question, setQuestion, questionlist, setQuestionslist, movie, setMovie,}}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };


