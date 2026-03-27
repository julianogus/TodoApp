<script setup>

  import todoModal from './todoModal.vue';
  import {ref, defineEmits} from 'vue';
  import { RouterLink } from 'vue-router';

  const showModal = ref(false);
  const showHamburgerMenu= ref(false);
  const emit = defineEmits(['userHasAddedTodo']);
  
  const handleModal = () => {
    showModal.value = !showModal.value;
  }

  const handleHamburgerMenu = () => {
    showHamburgerMenu.value = !showHamburgerMenu.value;
  }

  const addTodo = () => {
    emit('userHasAddedTodo', true);
  }

</script>

<template>
  <todoModal v-if="showModal" @fetchTodos="addTodo()" @updateModalState="handleModal()" />
    <div class="hamburger" @click="handleHamburgerMenu()" :class="[{active: showHamburgerMenu}]">
        ☰
        <nav class="menu" v-if="showHamburgerMenu">
            <ul>
                <li @click="handleModal()">New todo</li>
                <li> <RouterLink to="/doneTodos" id="link">Done todos</RouterLink> </li>
            </ul>
        </nav>
    </div>

</template>

<style scoped>
  .hamburger {
    user-select: none;
    background-color: rgb(224, 201, 72);
    color: #fff;
    width: 40px;
    height: 40px;
    font-size: 20px;
    font-weight: bolder;
    position: absolute;
    box-shadow: 0,0,8px rgb(224,201,72), 0,0,8px rgb(224,201,72) inset;
    right: 2%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: 250ms ease;
    cursor: pointer;
  }

  .hamburger:hover, .active{
    background-color: #666;
  }

  .menu {
    cursor: default;
    z-index: 80;
    background-color: #333;
    position: absolute;
    transform: translate(-80%, 100%);
    left: 0;
    bottom: 0;
    width: 160px;
    border-width: 0;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 19px;
  }

  ul {
    padding-left: 0;
    list-style-type: none;
    gap: 20px;
    display: flex;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.15em;
  }

  li {
    cursor: pointer;
    color: #eee;
    width: 90%;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
    border-radius: 7px;
  }

  li:hover{
    background-color: rgba(224, 201, 72, 0.7);
  }

  a{
    text-decoration: none;
    color: #eee;
  }

</style>