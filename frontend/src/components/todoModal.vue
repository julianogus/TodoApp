<script setup>

    import axios from 'axios';
    import { ref, defineEmits } from 'vue';

    const emit = defineEmits(['fetchTodos', 'updateModalState']);
    const inputText = ref('');
    
    const fetchTodos = () => {
        emit('fetchTodos', true)
    }

    const updateDOM = () => {
        emit('updateModalState', true);
    }

    const handleTodoSubmit = () => {
    axios.post('http://localhost:3000/api/addTodo', {
        title: inputText.value
    }, { withCredentials: true }).then(res => {
        //console.log(res)
        fetchTodos();
        inputText.value = '';
        updateDOM();
    }).catch(err => {
        console.log(err)
    })
    }

</script>

<template>
  <div ref="modal" class="overlay">
      <div class="overlay-menu">
          <form @submit.prevent="handleTodoSubmit">
              <textarea v-model="inputText" placeholder="Your awesome new todo" type="text" />
              <div>
                <button id="cancel-btn" type="reset" @click="updateDOM">Cancel</button>
                <button type="submit" id="create-todo">Create new todo</button>
              </div>
          </form>
      </div>
  </div>
</template>

<style scoped>

  .overlay{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 100;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
  }

  .overlay-menu{
        width: 50%;
        border-radius: 16px;
        border-width: 0;
        background-color: rgba(0,0,0,0.90);
        display: flex;
        flex-direction: column;
        position: relative;
    }

    textarea{
        resize: none;
        scrollbar-width: none;
        background-color: transparent;
        border-radius: 16px;
        border-width: 0;
        padding: 25px;
        font-size: 100%;
        padding-bottom: 100px;
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        color: #eee;
    }

    textarea:focus {
        outline: transparent;
    }

    textarea::-webkit-scrollbar {
        display: none;
    }

    form {
        padding-bottom: 20px;
        & div {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            margin-right: 30px;
            gap: 20px;
        }
    }

    button {
        background-color: #089a6e;
        border-radius: 26px;
        border-width: 0;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        font-size: 100%;
        height: 44px;
        line-height: 1.15;
        margin: 12px 0 0;
        outline: none;
        overflow: hidden;
        padding: 0 25px;
    }

    #cancel-btn {
        background-color: rgb(141, 3, 3);
    }

    p {
        position: absolute;
        right: 2%;
        cursor: pointer;
        top: 10px;
        margin-top: 0;
        color: #eee;
        font-size: 20px;
        font-weight: bold;
    }
</style>