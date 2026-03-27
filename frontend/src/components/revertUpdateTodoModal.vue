<script setup>
    import { defineEmits, ref } from 'vue';
    const emit = defineEmits(['userWantsRevertTodo'])

    const handleRevertTodo = () => {
        emit("userWantsRevertTodo", true);
    }

    const props = defineProps({
        message: String
    })

</script>

<template>
  <div class="todo-update-overlay">
      <h1 class="overlay-message">
          {{ message }}
      </h1>
      <div class="confirm-update" @click="handleRevertTodo()"></div>
  </div>
</template>

<style scoped>
    .todo-update-overlay{
        position: fixed;
        background-color: rgba(0,0,0,0.35);
        width: 22%;
        height: 8%;
        bottom: 30px;
        z-index: 101;
        border-radius: 20px;
        display: flex;
        align-items: center;
        align-content: center;
    }

    .overlay-message {
        font-size: 25px;
        position: relative;
        margin-left: 20px;
        color: #ddd;
    }

    .confirm-update {
        user-select: none;
        border: 3px solid rgb(224, 201, 72);
        color: #fff;
        width: 40px;
        height: 40px;
        font-size: 20px;
        font-weight: bolder;
        position: absolute;
        box-shadow: 0,0,8px rgb(224,201,72), 0,0,8px rgb(224,201,72) inset;
        right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: 950ms ease;
        cursor: pointer;
    }

    .confirm-update:hover{
        background-color: rgb(224, 201, 72);
    }
</style>