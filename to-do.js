let tasks=JSON.parse(localStorage.getItem("tasks")) || []
let editIndex=null
let currentSearch=""
const taskInput=document.getElementById("added-tasks")
const addBtn=document.getElementById("add")
const prioritySelect=document.getElementById("priority")
const dueDateInput=document.getElementById("dueDate")
const today=new Date().toISOString().split("T")[0]
const display=document.getElementById("display")
//display task
function renderTasks(){
    display.innerHTML=""
    const  filteredTask=tasks
        .filter(filterTask)
        .filter(task=>
      task.task.toLowerCase().includes(currentSearch))
       filteredTask.forEach((task,index)=> {
        const taskCard=document.createElement("div")
        taskCard.classList.add("task-card")
        taskCard.innerHTML=
        `<input type="checkbox" ${task.complete ? "checked" : ""} onchange="toggleTask(${index})" name="taskdone" value="completed" >
        <span class="task-text">${task.task}</span>
        <span class="priority- ${task.priority.toLowerCase()}
        ">${task.priority}</span>
        <span class="dueDate">📅 ${task.dueDate}</span>
         <button id="edit-Btn" onclick="editTask(${index})">✏️</button>
        <button id="delete-Btn" onclick="deleteTask(${index})">🗑️</button>  
         `
         display.appendChild   (taskCard)
         localStorage.setItem("tasks",JSON.stringify(tasks))
        
    })
    if(filteredTask.length===0){
        display.innerHTML="<p>No tasks found</p>"
    }
     tasksStatus()
}
//add button
addBtn.addEventListener("click",function(){
   if(dueDateInput.value<today){
      alert("Please select today's date or a future date.")
      return
   }
        
     if(editIndex !==null){
        
         tasks[editIndex]={
            task:taskInput.value.trim(),
            priority:prioritySelect.value,
            dueDate:dueDateInput.value,
            complete:tasks[editIndex].complete
        } 
        tasks.splice(editIndex,1,tasks[editIndex])
         editIndex=null
          taskInput.value=""
        addBtn.textContent="Add"    
    }else{
         const priority=prioritySelect.value
    const dueDate=dueDateInput.value
     const input=taskInput.value.trim();
     if(input===""){
        alert("Enter a valid value")
        return
     }
      let taskObject={
            task:input,
            priority:priority,
            dueDate:dueDate,
            complete:false
        }
        tasks.push(taskObject)
     }
     taskInput.value=""
     renderTasks()
})
//delete button
 function deleteTask(index){
    tasks.splice(index,1)
    renderTasks()
 }
 //edit button 
 function editTask(index){
    taskInput.value=tasks[index].task
    prioritySelect.value=tasks[index].priority
    dueDateInput.value=tasks[index].dueDate
    editIndex=index
    document.getElementById("add").textContent="Update"
 }
 //mode
 const mode=document.getElementById("mode")
 mode.addEventListener("click",function(){
   document.body.classList.toggle("dark")
   resetFilterButtonStyles()
   if(document.body.className.contains("dark")){
   mode.textContent="☀️ Light Mode"
   }else{
     mode.textContent="🌙 Dark Mode"
   }
   
 })
 //Filter buttons
 let currentFilter="all" 
 document.querySelectorAll("#filterBtn button").forEach((Btn)=>{
    Btn.addEventListener("click",function(){
       currentFilter= Btn.dataset.filter
      resetFilterButtonStyles()
       console.log(currentFilter)
       renderTasks()
    })
    })
    // Reset filter button styles
    function resetFilterButtonStyles() {
        document.querySelectorAll("#filterBtn button").forEach((btn) => {
         if(btn.dataset.filter === currentFilter) {
                btn.style.backgroundColor="#0EA5E9"
                btn.style.color="white"
           }else{ 
            const isDarkMode = document.body.classList.contains("dark");
            if(isDarkMode) {
                btn.style.backgroundColor="#1E2939"
                btn.style.color="white"
            }else{
                btn.style.backgroundColor="white"
                btn.style.color="black"
            }
         }
   })
}
//  Filter Buttons
 function filterTask (task){
    switch(currentFilter){
        case "completed":
         return task.complete===true
        case "active":
         return task.complete===false
       
        case "high":
            return  task.priority.toLowerCase()===currentFilter
        case "medium":
              return task.priority.toLowerCase()===currentFilter
        case "low":
             return  task.priority.toLowerCase()===currentFilter
        default :
              return true       
    }
 }
//  SearchText
 const search=document.getElementById("searchtext")
 search.addEventListener("input",function(){
   const searched=search.value
    currentSearch=searched.toLowerCase()
    renderTasks()
 })
// toggle of checkbox complete
function toggleTask(index){
   tasks[index].complete=! tasks[index].complete
   renderTasks()
}
// status
function tasksStatus(){
const total=tasks.length
 document.getElementById("total").textContent= total
 const completed=tasks.filter(task=>task.complete===true).length
document.getElementById("completed").textContent= completed
document.getElementById("remaining").textContent=total - completed
progress(total,completed)
} 
function progress(total,completed) {
const percentage=total===0 ? 0 : Math.round((completed/total)*100)
document.getElementById("progress-text").textContent= `${completed}/${total} (${percentage}%)`
document.getElementById("progress-bar").style.width=`${percentage}%`
}
//Event delegation for footer buttons
   document.querySelector("#footer").addEventListener('click',(e)=>{
      console.log("parent element clicked")
      e.target.style.backgroundColor=""
      if(e.target.matches("#sortpriority")){
         const order={high:1,medium:2,low:3}
         tasks.sort((a,b)=>
         order[a.priority.toLowerCase()]-order[b.priority.toLowerCase()]
      )
      }
      if(e.target.matches("#sortdate")){
         tasks.sort((a,b)=>
         new Date(a.dueDate)-new Date(b.dueDate))
      }
      if(e.target.matches("#clear")){
          tasks=tasks.filter(task =>task.complete!==true)
       }
      if(e.target.matches("#delete"))
      {
          tasks.splice(0,tasks.length)  
      }
      renderTasks()
   })
   //Load tasks from local storage on page load
renderTasks()

