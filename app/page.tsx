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




  const AddTodo = () => {
    if (input) {
      setTodos([
        ...todos,
        {
          id: Math.random().toString(), // id of to-do (need for mongoDB to save / not sure yet)
          date: new Date().toLocaleDateString(), // date of to-do
          text: input, // content of to-do
          completed: false, // if this to-do is completed
        },
      ]);
      setInput("");
    }
  }

  const ToggleCheck = (id: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { 
          ...todo, completed: !todo.completed
        };
      }
      return todo;
    });
    setTodos(newTodos);
  }

  return (
    <main className="w-screen">
      <text className="text">할일</text>
      <div className="flex flex-row justify-center bg-yellow-100">
        <div className="grid-container">
          <div className="flex flex-col items-center justify-center mt-5">
            <text className="text">오늘의 할일을 작성하세요.</text>
            <div className="flex flex-row justify-center">
              <input
                className="input"
                placeholder="입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="btn btn-normal"
                onClick={AddTodo}
              >
                Add
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-center min-w-24 min-h-52 flex-grow">
            <div className="to-do">
              {todos.map((todo) => (
                <div key={todo.id} className="to-do-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onClick={()=>ToggleCheck(todo.id)}
                    className="mr-2"
                  />
                  <text>
                    {todo.text}
                  </text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
