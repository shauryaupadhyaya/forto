import { useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("all"); // sections
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
  });

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!newTask.title || !newTask.date) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", description: "", date: "" });
    setShowNewTask(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task)=> {
    const today=new Date().toISOString().split("T")[0];
    if (tab=="today") return task.date === today;
    if (tab=="upcoming") return task.date > today;
  })

  return (
    <div style={{padding:"20px"}}>
        <h1 style={{marginBottom:"20px"}}>Tasks</h1>

        {/* tabs section */}
        <div style={{display:"flex", gap:"10px", marginBottom:"20px"}}>
            {["all", "today", "upcoming"].map((t) =>(
                <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                        padding: "8px 16px",
                        borderRadius: "5px",
                        border: tab === t? "2px solid #0A589C" : "1px solid #ccc",
                        background: tab === t ? "#0A589C" : "white",
                        color: tab === t ? "white" : "black",
                        cursor: "pointer"
                    }}
                >
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
            ))}

            {/* spacer */}
            <div style={{flex:1}}></div>

            {/* new task button */}

        </div>
    </div>
  );
}

export default Tasks;