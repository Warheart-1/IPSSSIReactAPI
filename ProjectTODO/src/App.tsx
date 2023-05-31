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
  const [isEditing, setEditingStatus] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const idRef = useRef(0);

  useEffect(() => {
    const todo = localStorage.getItem('todo')
    if (typeof todo === 'string') {
      setTodo(JSON.parse(todo as string))
    }
  }, [])

  const modifyTodo = (event : React.FormEvent<HTMLFormElement>, id? : number) => {
    event.preventDefault();
    const form = formRef?.current;
    let editedTodo : TodoProps;
    let newListTodo : TodoProps[] | undefined;
    if(form) {
      const formData = new FormData(form);
      editedTodo  = {
        id : id ? id : todo ? todo.length + 1 : 1,
        title: formData.get('title') as string,
        autor: formData.get('autor') as string,
        status: formData.get('status') as STATUS,
      };
    }
    // if the id is defined, it's an edit, if not it's an add
    if(id) newListTodo = todo?.map((todo : TodoProps) => todo.id === id ? editedTodo : todo);
    else newListTodo = todo ? [...todo, editedTodo] : [editedTodo];
    setTodo(newListTodo);
    localStorage.setItem('todo', JSON.stringify(newListTodo));
    dialogRef.current?.close();  
  }

  const dialogOpen = ((event : React.MouseEvent<HTMLDialogElement, MouseEvent> ) => {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close();
    };
  });

  return (
    <>
      <div>
        <dialog ref={dialogRef} onClick={(event) => {
          dialogOpen(event);
        }}>
          <form ref={formRef} onSubmit={(event) => !isEditing  ? modifyTodo(event) : modifyTodo(event,idRef.current)}>
            <label htmlFor='autor'>
              Name of the autor  
            </label>
            <input name='autor' placeholder='Name...' />
            <label htmlFor='title'>
              Title of the task
            </label>
            <input name='title' placeholder='Title...' />
            <label htmlFor='status'>
              Status of the task
            </label>
            <select name='status'>
              {Object.values(STATUS).map((status, index) => {
                return (
                  <option key={index} value={status}>
                    {status}
                  </option>
                )
              })}
            </select>
            <button disabled={false} type='submit'>Add to the list</button>
            <button onClick={() => dialogRef.current?.close()} type='reset'>Cancel</button>
          </form>
        </dialog>
        <h1>Todo list</h1>
      </div>
        <ol>
          {todo && todo.map((t : TodoProps, index) => {
            return (
              <li id={`${t.id}`} key={index}>
                {t.title}
                 - 
                {t.autor}
                 - 
                {t.status}
                <br/>
                <button onClick={() => {
                    const newListTodo = todo.filter((todo : TodoProps) => todo.id !== t.id)
                    setTodo(newListTodo)
                    localStorage.setItem('todo', JSON.stringify(newListTodo))
                  }
                }>
                  Delete this todo
                </button>
                <button onClick={() => {
                  const selectedTodo = todo.filter((todo : TodoProps) => todo.id === t.id)
                  const form = formRef.current
                  if(form?.elements instanceof HTMLFormControlsCollection){
                    (form.elements.namedItem('autor') as HTMLInputElement).value = selectedTodo[0].autor;
                    (form.elements.namedItem('title') as HTMLInputElement).value = selectedTodo[0].title;
                    (form.elements.namedItem('status') as HTMLSelectElement).value = selectedTodo[0].status;
                  }
                  setEditingStatus(true);
                  idRef.current = t.id;
                  dialogRef.current?.showModal()
                }}
                >
                  Edit this todo
                </button>
              </li>

            )
          })}
        </ol>
        <button onClick={() => {setEditingStatus(false);dialogRef.current?.showModal()}}>
          Add an new todo
        </button>
    </>
  )
}

export default App;