<script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import Login from '../components/login.vue';
  import Todo from '../components/todo.vue';
  import hamburgerMenu from '@/components/hamburgerMenu.vue';
  import revertUpdateTodoModal from '@/components/revertUpdateTodoModal.vue';

  const todoTasks = ref([]);
  const showRevertModal = ref(false);
  const updatedTodo =  ref(null);
  const noTasks = ref(false);

  const timer = setTimeout( () => {
      showRevertModal.value = false;
  }, 5000);

  const getTodos = async () => {
    await axios.get('http://localhost:3000/api/getTodos', { withCredentials: true }).then(res => {
        todoTasks.value = res.data;
        noTasks.value = !todoTasks.value.length;
    }).catch(err => {
        console.log(err)
    });
  }

  const changeTodo = async () => {
    await axios.get(`http://localhost:3000/api/changeTodo/${updatedTodo.value}`, { withCredentials: true }).then(res => {
      getTodos();
    });
  }

  const handleUpdate = async (todoId) => {
    updatedTodo.value = todoId;
    changeTodo();
    showRevertModal.value = true;
    timer;
  }

  const handleRevertUpdate = () => {
      clearTimeout(timer);
      showRevertModal.value = false;
      changeTodo();
  }

  getTodos();

</script>

<template>
  <revertUpdateTodoModal v-if="showRevertModal" @userWantsRevertTodo="handleRevertUpdate()" message="Task completed! Undo?" />
  <div class="todo-app">
    <header class="top-menu">
        <Login />
        <h1>
        Todo tasks
        </h1>
        <hamburgerMenu @userHasAddedTodo="getTodos()" />
    </header>
    <li>
        <Todo @userHasUpdatedTodo="handleUpdate(todo.id)" @userHasDeletedTodo="getTodos()" v-for="todo in todoTasks" :key="todo.id" :todo="todo" ref="todoChildren"/>
    </li>
    <div v-if="noTasks" class="no-todos">
        <h1>
            Add a new task to get started ☝️🤓
        </h1>
        <h2>
            Click on the hamburger menu and add a new todo!
        </h2>
    </div>
</div>
</template>

<style scoped>

  @media only screen and (max-width:1000px){
    .top-menu{
      height: 180px;
      & h1{
        position: absolute;
        bottom: 0;
        margin-bottom: 0;
      }
    }
    .no-todos{
      padding-top: 100px;
      &h1{
        font-size: 12px;
        padding-top: 100px;
      }
    }
  }

  @media only screen and (min-width:1001px){
    .top-menu{
      height: 8em;
    }
    .no-todos{
        & h1{
            font-size: 50px;
        }

        & h2 {
            font-size: 40px;
        }
    }
  }

  .no-todos {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #ddd;
  }

  .top-menu{
    display: flex;
    position: relative;
    align-items: center;
    align-content: center;
    justify-content: center;
  }

  .top-menu h1{
    color: #ccc;
    font-size: 46px;
    border-bottom: 0.08em solid #5acee8;
  }

  li {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px,1fr));
    margin-left: 2%;
    margin-right: 2%;
    justify-items: center;
    margin-top: 7%;
    row-gap: 1.5em;
    & .isDone {
        cursor: pointer;
    }
    & .deleteTodo {
        cursor: pointer;
    }
    & p {
        color: #ccc;
    }
  }

</style>