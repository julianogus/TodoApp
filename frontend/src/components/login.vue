<script setup>

  import { ref } from 'vue';
  import axios from 'axios';
  import router from '../router';

  const userName = ref('');

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  })

  const handleLogout = () => {
    api.post('/logout').then(res => {
        router.push({path: '/login'});
    })
  }

  api.get('/login/checkAuth').then(res =>{
      userName.value = res.data.username;
  })



</script>

<template>
    <div class="loginBlock">
        <h1>
            Hello, {{ userName }}
        </h1>
        <h2 @click="handleLogout"> Logout </h2>
    </div>
</template>

<style>

  @media only screen and (max-width:1000px){
    .loginBlock{
        width: 95%;
        height: 120px;
    }
  }

  @media only screen and (min-width:1001px){
    .loginBlock{
        height: 100%;
        width: 27em;
    }
  }

.loginBlock{
    position: absolute;
    left: 2%;
    top: 0;
    overflow: hidden;
    & h1 {
        position: absolute;
        top: 0;
        color: #eee;
    }
    & h2 {
        position: absolute;
        bottom: 0;
        color: #ccc;
    }
    & #login, h2{
        cursor: pointer;
    }
}

</style>