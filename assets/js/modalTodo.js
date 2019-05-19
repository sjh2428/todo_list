import axios from "axios";

let todoLists = document.querySelectorAll('.todo-list');
let modalOkBtn = document.querySelector(".btn-todo-ok");
let todoAddBtn = document.querySelector('.btn-todo-add-main');
let todoDeadlineChkbox = document.getElementById("todo-deadline-check");
const todoListContainer = document.querySelector(".todo-lists-container");
const modalTitle = document.getElementById("todo-modal-title");
const todoTitle = document.getElementById("todo-title");
const modalTodoContents = document.getElementById("todo-contents");
const todoPriority = document.getElementById("todo-priority");
const todoCompleted = document.getElementById("todo-completed");
const todoDeadlineContainer = document.getElementById("todo-deadline-container");
const todoDate = document.getElementById("todo-date");
const todoTime = document.getElementById("todo-time");
const errMsg = document.querySelector('.error-message');

const handleTitleVisible = (event) => {
    if (event.target.tagName === "BUTTON") {
        return;
    } else if (event.target.tagName === "I") {
        return;
    }
    const contentNode = event.target.parentElement.nextElementSibling;
    if (contentNode.style.display === "none") {
        contentNode.style.display = "block";
    } else {
        contentNode.style.display = "none";
    }
}

const refreshList = async() => {
    const response = await axios({
        url: `/api/refresh`,
        method: "POST"
    });
    if (response.status === 200) {
        const responseData = response.data.html;
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = responseData;
        tempDiv = tempDiv.querySelector(".todo-lists-container");
        todoListContainer.innerHTML = tempDiv.innerHTML;
        todoAddBtn = document.querySelector('.btn-todo-add-main');
        todoDeadlineChkbox = document.getElementById("todo-deadline-check");
        modalOkBtn = document.querySelector(".btn-todo-ok");
        todoLists = document.querySelectorAll('.todo-list');
        init();
    } else {
        errMsg.innerHTML = "서버에서 데이터를 받아오는데 오류가 발생했습니다. 새로고침을 눌러주세요!";
    }
}

const addAction = async() => {
    let datas = {};
    datas.title = todoTitle.value;
    datas.contents = modalTodoContents.value;
    datas.priority = todoPriority.value;
    if (todoDeadlineChkbox.checked === true) {
        datas.is_dead_line = 1;
    } else {
        datas.is_dead_line = 0;
    }
    if (todoCompleted.checked === true) {
        datas.completed = 1;
    } else {
        datas.completed = 0;
    }
    if (datas.is_dead_line === 0) {
        datas.dead_line_date = null;
        datas.dead_line_time = null;
    } else {
        datas.dead_line_date = todoDate.value;
        datas.dead_line_time = todoTime.value;
    }
    const response = await axios({
        url: `/api/todo/add`,
        method: "POST",
        data: datas
    });
    if (response.status === 200) {
        handleAddBtnOnHome();
        $('#TodoActionModal').modal('hide');
        refreshList();
    } else {
        $('#TodoActionModal').modal('hide');
        errMsg.innerHTML = "서버에 Todo를 등록하는데 실패하였습니다!";
    }
}

const modifyAction = async(id) => {
    let datas = {};
    datas.todo_id = id;
    datas.title = todoTitle.value;
    datas.contents = modalTodoContents.value;
    datas.priority = todoPriority.value;
    if (todoDeadlineChkbox.checked === true) {
        datas.is_dead_line = 1;
    } else {
        datas.is_dead_line = 0;
    }
    if (todoCompleted.checked === true) {
        datas.completed = 1;
    } else {
        datas.completed = 0;
    }
    if (datas.is_dead_line === 0) {
        datas.dead_line_date = null;
        datas.dead_line_time = null;
    } else {
        datas.dead_line_date = todoDate.value;
        datas.dead_line_time = todoTime.value;
    }
    const response = await axios({
        url: `/api/todo/modify`,
        method: "POST",
        data: datas
    });
    if (response.status === 200) {
        handleAddBtnOnHome();
        $('#TodoActionModal').modal('hide');
        refreshList();
    } else {
        $('#TodoActionModal').modal('hide');
        errMsg.innerHTML = "서버에 Todo를 수정하는데 실패하였습니다!";
    }
}

const handleOk = (event) => {
    const target = event.target;
    if (target.getAttribute("target") === "add") {
        modalOkBtn.setAttribute("data", "");
        addAction();
    } else if (target.getAttribute("target") === "modify") {
        modifyAction(target.getAttribute("data"));
    }
}

const handleDelete = async(event) => {
    const targetListContainer = event.target.parentElement.parentElement.parentElement.parentElement;
    const response = await axios({
        url: `/api/todo/remove`,
        method: "POST",
        data: {
            todo_id: event.target.getAttribute("data")
        }
    });
    if (response.status === 200) {
        targetListContainer.remove();
    } else {
        errMsg.innerHTML = "서버에서 해당 Todo를 삭제하는데 실패하였습니다!";
    }
}

const handleModify = (event) => {
    const modBtn = event.target;
    const curTodoContainer = modBtn.parentElement.parentElement.parentElement;
    const title = curTodoContainer.querySelector('.todo-title').childNodes[0].nodeValue;
    const contents = curTodoContainer.querySelector('.todo-contents').childNodes[0].nodeValue;
    const priority = curTodoContainer.querySelector('.todo-priority').childNodes[0].nodeValue;
    const isDeadLine = curTodoContainer.querySelector('.todo-is-dead-line').childNodes[0].nodeValue;
    const isCompleted = curTodoContainer.querySelector('.todo-completeds').childNodes[0].nodeValue;
    
    todoCompleted.disabled = false;
    modalTitle.childNodes[0].nodeValue = "Modify Todo";
    todoTitle.value = title;
    modalTodoContents.value = contents;
    todoPriority.value = priority;
    modalOkBtn.setAttribute("data", event.target.getAttribute("data"));
    modalOkBtn.setAttribute("target", "modify");
    modalOkBtn.childNodes[0].nodeValue = "Modify Todo";
    if (isDeadLine === "1") {
        const date = curTodoContainer.querySelector('.todo-date').childNodes[0].nodeValue;
        const time = curTodoContainer.querySelector('.todo-time').childNodes[0].nodeValue;
        todoDeadlineChkbox.checked = true;
        todoDeadlineContainer.style.display = "block";
        todoDate.value = date;
        todoTime.value = time;
    } else {
        todoDeadlineChkbox.checked = false;
        todoDeadlineContainer.style.display = "none";
        todoDate.value = "2000-01-01";
        todoTime.value = "12:00";
    }
    if (isCompleted === "1") {
        todoCompleted.checked = true;
    } else {
        todoCompleted.checked = false;
    }
}

const handleAddBtnOnHome = () => { // modal initialize
    modalTitle.childNodes[0].nodeValue = "New Todo";
    todoTitle.value = "";
    modalTodoContents.value = "";
    todoPriority.value = 3;
    todoDeadlineChkbox.checked = false;
    todoDeadlineContainer.style.display = "none";
    todoCompleted.checked = false;
    todoCompleted.disabled = true;
    todoDate.value = "2000-01-01";
    todoTime.value = "12:00";
    modalOkBtn.childNodes[0].nodeValue = "Add Todo";
    modalOkBtn.setAttribute("target", "add");
}

const handleDeadlineChkbox = (event) => {
    if (event.target.checked === true) {
        todoDeadlineContainer.style.display = "block";
    } else if (event.target.checked === false) {
        todoDeadlineContainer.style.display = "none";
    }
}

const init = () => {
    todoAddBtn.addEventListener("click", handleAddBtnOnHome);
    todoDeadlineChkbox.addEventListener("click", handleDeadlineChkbox);
    modalOkBtn.addEventListener("click", handleOk);
    todoLists.forEach((elementNode) => {
        const titlePart = elementNode.querySelector('.todo-title-part');
        const modifyBtn = elementNode.querySelector('.btn-todo-modify');
        const removeBtn = elementNode.querySelector('.btn-todo-delete');
        const completedVal = elementNode.querySelector('.todo-completeds').childNodes[0].nodeValue;
        let dateVal = elementNode.querySelector('.todo-date');
        let timeVal = elementNode.querySelector('.todo-time');
        
        if (completedVal == 0 && dateVal !== null && timeVal !== null) {
            dateVal = dateVal.childNodes[0].nodeValue;
            timeVal = timeVal.childNodes[0].nodeValue;
            const dDay = new Date(dateVal + " " + timeVal);
            const curDay = new Date();
            if (dDay < curDay) {
                elementNode.querySelector('.fa-bell').style.display = "block";
            }
        }
        titlePart.addEventListener("click", handleTitleVisible);
        modifyBtn.addEventListener("click", handleModify);
        removeBtn.addEventListener("click", handleDelete);
    });
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        init();
    }
}