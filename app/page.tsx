"use client"

import Image from "next/image";
import { list } from "postcss";
import { useEffect, useState, useContext } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";

import SignIn from "@/components/signin";
import { UserAuth } from "@/components/auth";
import axios, { AxiosResponse } from "axios";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "moment/locale/ko";
import { DiDlang } from "react-icons/di";

interface TodoList {
  date: string;
  id: string;
  text: string;
  completed: boolean;
}
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


export default function Home() {

  const [todos, setTodos] = useState<TodoList[]>([]);
  const [todosByDate, setTodosByDate] = useState<{ [date: string]: TodoList[] }>({});
  const [input, setInput] = useState('');

  const [calenderValue, calenderOnChange] = useState<Value>(new Date());
  const indexOfCalenderValue = moment(calenderValue?.toString()).format('YYYY-MM-DD');

  const { user, loading, guestMode, SignOut } = useContext(UserAuth);

  const db = getFirestore();

  useEffect(() => {
    setTodos(todosByDate[indexOfCalenderValue] || []);
    saveDataToFirebase();
  }, [indexOfCalenderValue, todosByDate])

  useEffect(()=>{
    if(user){
      loadDataFromFirebase();
    }
  },[user])


  const AddTodo = () => {
    if (input) {
      const newTodo = {
        id: user?.uid || "guest",
        date: indexOfCalenderValue,
        text: input,
        completed: false,
      };
      setTodosByDate(prev => ({
        ...prev,
        [indexOfCalenderValue]: [...(prev[indexOfCalenderValue] || []), newTodo],
      }));
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

  //#region Deprecated
  //const saveDataToFirebase = async()=>{
    //const docRef = await addDoc(collection(db,{collection_name}),{
    //  id: user?.email?.toString() || "guest",
    //  todosByDate: todosByDate,
    //});
  //}

  //const loadDataFromFirebase = async()=>{
    //const snapShot = await getDocs(collection(db,{collection_name}));
    //snapShot.forEach((doc)=>{
    //  //setTodosByDate(doc.data().todosByDate);
    //  console.log("date:"+doc.data().todosByDate);
    //  console.log("id:"+doc.data().id);
    //});
  //}
  //#endregion

  const saveDataToFirebase = async()=>{
    const id = user?.uid || "guest";
    await axios.post(`api/database`, { id,todosByDate });
  }

  const loadDataFromFirebase = async()=>{
    const id = user?.uid || "guest";

    const fetched_data = await axios.get(`api/database`, {params:{id: id}});
    setTodosByDate(fetched_data.data);
  }

  const ToggleCheck = (id: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };

        setTodosByDate((prev) => ({
          ...prev,
          [indexOfCalenderValue]: prev[indexOfCalenderValue]?.map((item) =>
            item.id === id ? updatedTodo : item
          ),
        }));
        return updatedTodo;
      }
      return todo;
    });
    setTodos(newTodos);
  }

  const onDragEnd = (result: DropResult) => {
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


  if (!user && !guestMode) {
    return <SignIn />;
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="w-screen">
        <div className="flex flex-col justify-center items-center">
          <Calendar
            key={Object.keys(todosByDate).join()}
            className="react-calendar"
            onChange={calenderOnChange}
            value={calenderValue}
            calendarType="gregory"
            minDetail="month"
            showNeighboringMonth={false}
            tileContent={({ date }) => {
              const tileDate = moment(date).format("YYYY-MM-DD");
              const todosForDate = todosByDate[tileDate] || [];
              const hasTodos = todosByDate[tileDate]?.length > 0; // Check if there are todos for this date
              const hasCompletedTodos = todosForDate.some(todo => todo.completed);

              return (
                <span className={` ${hasTodos ? "visible" : "hidden"} ${hasCompletedTodos ? "text-green-700" : "text-red-700"} `}>
                  ●
                </span>
              );
            }}
          />
          <div className="grid-container">
            <text className="text-large font-bold">{indexOfCalenderValue?.toString()}</text>
            <div className="flex flex-col items-center justify-center mt-5 w-2/3">
              <text className="text-small">오늘의 할일을 작성하세요.</text>
              <div className="flex flex-row w-full justify-center items-center">
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
                  <text className="text-x-small">
                    Add
                  </text>
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
                                    defaultChecked={todo.completed}
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
