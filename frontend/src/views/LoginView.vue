<script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import router from '../router';
  import { RouterLink } from 'vue-router';
import { isWorker } from '@vueuse/core';

  const userLoginCredential = ref('');
  const userPasswordCredential = ref('');
  const nullUser = ref(false);
  const nullPassword = ref(false);
  const incorrectCredetials = ref(false);

  const keepLoggedIn = ref(true);

  const handleLogin = () => {
    (userLoginCredential.value === '') ? nullUser.value = true : nullUser.value = false;
    (userPasswordCredential.value === '') ? nullPassword.value = true :  nullPassword.value = false;
    if(incorrectCredetials.value === true)  incorrectCredetials.value = false;
    if(nullPassword.value === false && nullUser.value === false){
        axios.post('http://localhost:3000/login', {
        username: userLoginCredential.value,
        password: userPasswordCredential.value,
        keepSession: keepLoggedIn.value
        }, {
            withCredentials: true,
            headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173', 
            'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
            router.push({path:'/'})
        }).catch(err => {
            console.log(err.response)
            incorrectCredetials.value = true;
        })
    }
  }

</script>


<template>
    <main>
        <div class="login">
            <h1> Please log in to continue </h1>
            <form @submit.prevent="handleLogin">
                <div>
                    <h3 v-if="incorrectCredetials" class="wrong-credentials">Wrong credentials</h3>
                    <h3 v-if="nullUser" class="wrong-input">Missing username or email</h3>
                    <input v-model="userLoginCredential" placeholder="email" type="text" :class="[{isWrong: nullUser}, {isWrong: incorrectCredetials}]" />
                </div>
                <div>
                    <h3 v-if="nullPassword" class="wrong-input">Missing username or email</h3>
                    <input v-model="userPasswordCredential" placeholder="password" type="password" :class="[{isWrong: nullPassword}, {isWrong: incorrectCredetials}]" />
                </div>
                <div class="keepLoggedIn">
                    <input v-model="keepLoggedIn" type="checkbox" name="keepLoggedIn" id="keepLoggedIn" />
                    <label for="keepLoggedIn">Keep me logged in</label>
                </div>
                <button type="submit" id="login-btn">Login</button>
            </form>
            <div class="register">
                <h4>Don't have an accout?</h4>
                <RouterLink to="/register" id="link">Create an account</RouterLink>
            </div>
        </div>
    </main>
</template>

<style scoped>
    main{
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
    }
    .login {
        position: fixed;
        top: 20%;
        color: #ddd;
        width: 24em;
        padding-top: 20px;
        padding-left: 25px;
        padding-right: 25px;
        padding-bottom: 20px;
        background-color: rgba(0, 0, 0, 0.25);
    }
    form {
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    input::placeholder {
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        line-height: 1.15;
    }

    input {
        background-color: rgba(0,0,0,0.25);
        border-radius: 6px;
        border-width: 0;
        height: 20px;
        font-size: 100%;
        padding: 15px;
        color: #eee;
    }

    input:focus {
        outline: transparent;
    }

    input[type="text"], input[type="password"]{
        width: 90%;
    }

    #login-btn {
        background-color: #5acee8;
        border-radius: 6px;
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

    .keepLoggedIn{
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: center;
        gap: 5px;
        font-size: 14px;
    }

    .register {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
    
        & a {
            text-decoration: none;
            color:#26879d;
        }
    }

    .isWrong {
        border: 2px solid rgb(218, 73, 73);
        margin-top: 0;
    }

    .wrong-input, .wrong-credentials{
        color: rgb(218, 73, 73);
        font-size: 13px;
        margin-bottom: 0;
    }

</style>