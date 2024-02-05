"use client"

import Image from "next/image";
import { list } from "postcss";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";

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

  const DeleteTodo = (id: string) => {
    //filter을 통해 returns a new array with only elements that pass a given condition 충족 가능
    const newToDos = todos.filter((todo) => {
      //선택된 id가 아닌 것들만 전부 return 시키자
      return todo.id !== id;
    })
    setTodos(newToDos);
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

  const onDragEnd = (result:DropResult) => 
  {
    //console.log("res", result)

    const sourceOrderNo = result.source.index;
    const destinationOrderNo = result.destination?.index;
    
    if (destinationOrderNo !== undefined) {
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        const [draggedTodo] = updatedTodos.splice(sourceOrderNo, 1);
        updatedTodos.splice(destinationOrderNo, 0, draggedTodo);
        return updatedTodos;
      });
    }

  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="w-screen">
        <div className="flex flex-row justify-center">
          <div className="grid-container">
            <div className="flex flex-col items-center justify-center mt-5 w-2/3">
              <text className="text">오늘의 할일을 작성하세요.</text>
              <div className="flex flex-row w-full justify-center">
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
            <div className="mt-8 flex flex-col justify-center items-center w-4/5 min-w-24 min-h-52 flex-grow">
              <div className="to-do">
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div className="w-full" ref={provided.innerRef} {...provided.droppableProps}>
                      {todos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="to-do-item">
                                <div className="flex justify-center items-center mr-2">
                                  <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onClick={() => ToggleCheck(todo.id)}
                                    className="min-w-6 min-h-6"
                                  />
                                </div>
                                <text>
                                  {todo.text}
                                </text>
                                <div className="flex ml-auto min-w-16 justify-center items-center">
                                  <button
                                    className="btn-warning min-w-10 min-h-6"
                                    onClick={() => DeleteTodo(todo.id)} // a function to delete the todo
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}
