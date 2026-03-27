<script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import Login from '../components/login.vue';
  import Todo from '../components/todo.vue';
  import revertUpdateTodoModal from '@/components/revertUpdateTodoModal.vue';

  const todoTasks = ref([]);
  const showRevertModal = ref(false);
  const updatedTodo =  ref(null);
  const noTasks = ref(false);

  const timer = setTimeout( () => {
      showRevertModal.value = false;
  }, 5000);

  const getDoneTodos = async () => {
    await axios.get('http://localhost:3000/api/getDoneTodos', { withCredentials: true }).then(res => {
        todoTasks.value = res.data;
        noTasks.value = !todoTasks.value.length;
    }).catch(err => {
        console.log(err)
    });
  }

  const changeTodo = async () => {
    axios.get(`http://localhost:3000/api/changeTodo/${updatedTodo.value}`, { withCredentials: true }).then(res => {
      getDoneTodos();
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
      //handleTodoUpdate(updatedTodo.value);
  }

  getDoneTodos();

</script>

<template>
  <revertUpdateTodoModal v-if="showRevertModal" @userWantsRevertTodo="handleRevertUpdate()" message="Task updated. Undo?" />
  <div class="todo-app">
    <header class="top-menu">
        <Login />
        <h1>
            Done Todos
        </h1>
        <a class="go-back" @click="$router.go(-1)">Go back</a>
    </header>
    <div v-if="noTasks" class="no-todos">
        <h1>
            No tasks completed 😔 
        </h1>
        <h2>
            Time to get busy!
        </h2>
    </div>
    <li v-else>
        <Todo @userHasUpdatedTodo="handleUpdate(todo.id)" v-for="todo in todoTasks" :key="todo.id" :todo="todo" />
    </li>
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

    .no-todos{
      padding-top: 100px;
      &h1{
        font-size: 12px;
        padding-top: 100px;
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

  .go-back{
    user-select: none;
    color: #fff;
    font-size: 20px;
    font-weight: bolder;
    padding: 2px;
    position: absolute;
    right: 2%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 250ms ease;
    cursor: pointer;
    border-bottom: 0.08em solid rgb(224, 201, 72);
  }

</style>