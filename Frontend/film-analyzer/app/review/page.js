"use client"

import {useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import React from 'react'

export default function Review() {
  const dispatch = useDispatch();
  const questionlist = useSelector((state) => state.questionlist)
  const movie = useSelector((state) => state.movie);
  console.log("Movie on Second Page:", movie);




  return (
    <div>

       <h1 className="text-4xl font-bold mb-6 text-red-600"> {movie} </h1>


       <h2 className="text-2xl font-semibold text-gray-800 mb-4">List of Questions</h2>

       <ul className="w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                {questionlist.map((question, index) => (
                    <li
                        key={index}
                        className="p-2 mb-2 bg-gray-100 text-gray-800 font-medium rounded-lg border border-gray-200">
                        {question}
                    </li>
                ))}
            </ul>

    </div>
  )
}
