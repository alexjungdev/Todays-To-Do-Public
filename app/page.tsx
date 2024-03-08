"use client"

import { useEffect, useState, useContext } from "react";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { RotatingLines } from "react-loader-spinner";

import SignIn from "@/components/signin";
import { UserAuth } from "@/components/auth";
import axios from "axios";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

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
  const [dataFetched, setDataFetch] = useState(false);
  const [saveReady, setSaveReady] = useState(false);

  const [calenderValue, calenderOnChange] = useState<Value>(new Date());

  const { user, guestMode} = useContext(UserAuth);

  const getIndexOfCalenderValue = (value: Value): string => {
    if (value instanceof Date) {
      return moment(value).format('YYYY-MM-DD');
    } else if (Array.isArray(value) && value.length === 2 && value.every((v) => v instanceof Date || v === null)) {

      const [startDate, endDate] = value;
      const formattedStartDate = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
      const formattedEndDate = endDate ? moment(endDate).format('YYYY-MM-DD') : '';
      return formattedStartDate + '-' + formattedEndDate;
    } else {
      // Handle other cases if necessary
      return '';
    }
  };

  const indexOfCalenderValue = getIndexOfCalenderValue(calenderValue);


  useEffect(() => {
    setTodos(todosByDate[indexOfCalenderValue] || []);

    if(saveReady) {
      if (user && user?.uid.includes("kakao")) {
        const local_data = JSON.stringify(todosByDate, null, 3);
        localStorage.setItem('my-to-do-list-kakao', local_data);

        saveDataToFirebase();
      }
      else if (user && !user?.uid.includes("kakao")) {
        const local_data = JSON.stringify(todosByDate, null, 3);
        localStorage.setItem('my-to-do-list-google', local_data);

        saveDataToFirebase();
      }
      else if (guestMode) {
        const local_data = JSON.stringify(todosByDate, null, 3);
        localStorage.setItem('my-to-do-list-guest', local_data);
      }
    }
  }, [indexOfCalenderValue, todosByDate])

  useEffect(() => {
    if(!user && !guestMode) {
      setSaveReady(false);
    }
    else if (user) {
      let my_data;
      if(user?.uid.includes("kakao")){
       my_data = localStorage.getItem('my-to-do-list-kakao');
      }
      else if(!user?.uid.includes("kakao")){
        my_data = localStorage.getItem('my-to-do-list-google');
      }

      ResetTodo();

      if (my_data) {
        setDataFetch(true);
        GetLocalData(my_data);
      }
      else {
        loadDataFromFirebase();
      }

      setSaveReady(true);
    }
    else if (guestMode) {
      const my_data = localStorage.getItem('my-to-do-list-guest');

      ResetTodo();
      setDataFetch(true);

      if (my_data) {
        GetLocalData(my_data);
      }

      setSaveReady(true);
    }
  }, [user, guestMode])

  const GetLocalData = (my_data: any) => {
    const fetched_data = JSON.parse(my_data);

    for (const date in fetched_data) {
      setTodosByDate((prev)=>{
        const existingTodos = prev[date] || [];
        const updatedTodos = {
          ...prev,
          [date]: [...existingTodos, ...fetched_data[date]],
        };
        return updatedTodos;
      });
    }
  }


  const ResetTodo = () => {
    if (dataFetched) {
      setSaveReady(false);
      setTodos([]);
      for (const date in todosByDate) {
        if (todosByDate.hasOwnProperty(date)) {
          setTodosByDate({ [date]: [] });
        }
      }
      setDataFetch(false);
    }
  }


  const AddTodo = () => {
    if (input) {
      const newTodo = {
        id: indexOfCalenderValue + Math.random(),
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
    const newTodos = todos.filter((todo) => {
      //1.삭제하지 않는 todo 들만 남기기
      return todo.id !== id;
    })
    const newTodosByDate: { [date: string]: TodoList[] } = {};
    //2. todosByDate안의 date에 대해서 만약 todosByDate가 date를 포함한다면 => 삭제하지 않는 todo 들만 남기기 => todosByDate 안에 있는 날짜만큼 반복하기
    for (const date in todosByDate) {
      if (todosByDate.hasOwnProperty(date)) {
        const filteredTodos = todosByDate[date].filter((todo) => todo.id !== id);
        if (filteredTodos.length > 0) {
          newTodosByDate[date] = filteredTodos;
        }
      }
    }

    setTodos(newTodos);
    setTodosByDate(newTodosByDate);
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

  const saveDataToFirebase = async () => {
    const id = user?.uid || "guest";
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL_DATABASE}`, { id, todosByDate });
  }

  const loadDataFromFirebase = async () => {
    const id = user?.uid || "guest";

    const fetched_data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_DATABASE}`, { params: { id: id } });
    setDataFetch(true);
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

  const unloadedTodoList = () => {
    return (
      <div className="auth-spinner">
        <RotatingLines

          visible={true}
          width="64"
          strokeColor="green"
          strokeWidth="3"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  const loadedTodoList = () => {
    return (
      <>
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
      </>
    );
  }


  if (!user && !guestMode) {
    return <SignIn />;
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="w-screen">
        <div className="flex flex-col justify-center items-center">
          {!dataFetched ? (
            unloadedTodoList()
          ) : (
            loadedTodoList()
          )}
        </div>
      </main>
    </DragDropContext>
  );
}
