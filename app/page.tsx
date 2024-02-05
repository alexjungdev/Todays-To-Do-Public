"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

interface TodoList {
  date: string;
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {

  const [todos, setTodos] = useState<TodoList[]>([]);
  const [input, setInput] = useState('');


  useEffect(()=>{
    console.log(input);
  },[input])

  const AddTodo = () => {
    console.log(input);
    if (input) {
      // if the input is not empty
      setTodos([
        // update the todo list with the new todo
        ...todos,
        {
          id: Math.random().toString(), // generate a random id for the new todo
          date: new Date().toLocaleDateString(), // use the current date as the date of the new todo
          text: input, // use the input value as the text of the new todo
          completed: false, // set the completed status of the new todo to false
        },
      ]);
      setInput(""); // reset the input value
    }
  }

  return (
    <main className="w-screen flex items-center justify-center">
      <div className="flex flex-col justify-center">
        <text className="text-4xl font-bold">오늘의 할일</text>
        <div className="mt-4 flex flex-col justify-center">
          <div className="h-96 bg-slate-600">
            {todos.map((todo) => (
              // map over the todos from the state
              <div key={todo.id} className="border p-2 mt-4 bg-red-100">
                {todo.date} - {todo.text}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center">
            <input
              className="border-4"
              placeholder="입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2"
              onClick={AddTodo}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
