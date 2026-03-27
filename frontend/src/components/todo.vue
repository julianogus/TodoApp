<script setup>

    import axios from 'axios';
    import { defineEmits, ref } from 'vue';
    import revertUpdateTodoModal from './revertUpdateTodoModal.vue';

    const emit = defineEmits(['userHasUpdatedTodo', 'userHasDeletedTodo']);
    const userWantsDelete = ref(true);
    const showRevertModal = ref(false)

    const timer = setTimeout( async () => {
        showRevertModal.value = false;
        userWantsDelete.value = true;
    }, 5000);

    const wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleTodoUpdate = async (todoId) => {
        emit('userHasUpdatedTodo', todoId);
    }

    const handleDeleteTodo =  async (todoId) => {
        showRevertModal.value = true;
        //await timer;
        wait(5000).then( () => {
            showRevertModal.value = false;
            if(userWantsDelete.value){
                axios.delete(`http://localhost:3000/api/deleteTodo/${todoId}`, { withCredentials: true }).then(res => {
                    emit('userHasDeletedTodo', true);
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }

    const handleUndelete = () => {
      //clearTimeout(timer);
      showRevertModal.value = false;
      userWantsDelete.value = false;
    }

    const props = defineProps({
        todo: Object
    });

    const color = "hsl(" + Math.random() * 360;
    const color1 = color + ", 100%, 75%)";
    const color2 = color + ", 50%, 50%)";

    const todoDate = new Date(props.todo.updatedAt).toDateString();

</script>

<template>
    <revertUpdateTodoModal v-if="showRevertModal" @userWantsRevertTodo="handleUndelete()" message="Task deleted! Undo?" />
    <div class="todo">
        <p class="todoNumber">
            {{  props.todo.id }} 
        </p>
        <p class="todoTime">
            {{  todoDate }}
        </p>
        <p class="todoDescription">
            {{ props.todo.todo }}
        </p>
        <div @click="handleTodoUpdate(props.todo.id)" class="isDone" :class="[{active: props.todo.isDone}, {notActive: !props.todo.isDone}]" >
            <div v-if="props.todo.isDone">✓</div>
        </div>
        <p @click="handleDeleteTodo(props.todo.id)" class="deleteTodo">
            Delete task
        </p>
    </div>
</template>

<style scoped>
    .todo {
        font-size: 1.35em;
        background-color: v-bind('color1');
        border-radius: 16px;
        border-width: 0;
        width: 14em;
        height: 19em;
        position: relative;
        user-select: none;
    }
  
    .isDone {
        border: 2px solid black;
        box-shadow: 0,0,8px v-bind('color2'), 0,0,8px v-bind('color2') inset;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        bottom: 20px;
        right: 10%;
    }

    .notActive::after{
        content: "✓";
        position: absolute;
        top: 50%;
        left: 50%;
        color: rgb(72, 70, 70);
        font-size: 30px;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.3s ease;
    }

    .notActive:hover::after{
        transform: translate(-50%, -50%) scale(1);
    }

    .active {
        background-color: v-bind(color2);
        font-size: 30px;
        & div {
            color: rgb(72, 70, 70);
            top: 50%;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    .todoNumber {
        position: absolute;
        left: 10%;
    }
    
    .todoTime {
        position: absolute;
        right: 10%;
    }

    .todoDescription {
        position: absolute;
        left: 10%;
        user-select: text;
        top: 20%;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 70%;
    }

    .deleteTodo {
        position: absolute;
        bottom: 0%;
        left: 10%;
    }

    .isDone, .deleteTodo {
        cursor: pointer;
    }
</style>