import { useState, useRef, useEffect} from 'react'
import './App.css'

enum STATUS {
  NOTSTARTED = 'Not started',
  INPROGRESS = 'In progress',
  DONE = 'Done',
  VALIDED = 'Valided',
}

type TodoProps = {
  id : number;
  title : string;
  autor: string;
  status : STATUS;
}

function App() {
  const [todo, setTodo] = useState<TodoProps[]>();
  const [showDialogBox, setShowDialog] = useState(false)

  const formRef = useRef<HTMLFormElement | null>(null)  

  useEffect(() => {
    const todo = localStorage.getItem('todo')
    if (typeof todo === 'string') {
      setTodo(JSON.parse(todo as string))
    }
  }, [])

  const addTodo = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    if (form) {
      const formData = new FormData(form);
      const newTodo : TodoProps = {
        id : todo ? todo.length + 1 : 1,
        title: formData.get('title') as string,
        autor: formData.get('autor') as string,
        status: STATUS.NOTSTARTED,
      }
      const newListTodo = todo ? [...todo, newTodo] : [newTodo]
      setTodo(newListTodo)
      localStorage.setItem('todo', JSON.stringify(newListTodo))
      setShowDialog(false)
    }
  }

  return (
    <>
      <dialog open={showDialogBox}>
        <form ref={formRef} onSubmit={(event) => addTodo(event)}>
          <label htmlFor='autor'>
            Name of the autor  
          </label>
          <input name='autor' placeholder='Name...' />
          <label htmlFor='title'>
            Title of the task
          </label>
          <input name='title' placeholder='Title...' />
          <button disabled={false}>Add to the list</button>
        </form>
      </dialog>
      <ol>
        {todo && todo.map((t : TodoProps, index) => {
          return (
            <li id={`${t.id}`} key={index}>
              {t.title} - {t.autor} - {t.status}
              <br/>
              <button onClick={() => {
                  const newListTodo = todo.filter((todo : TodoProps) => todo.id !== t.id)
                  setTodo(newListTodo)
                  localStorage.setItem('todo', JSON.stringify(newListTodo))
                }
              }>
                Delete this todo
              </button>

            </li>

          )
        })}
      </ol>
      <button onClick={() => setShowDialog(!showDialogBox)}>
        Add an new todo
      </button>
    </>
  )
}

export default App
