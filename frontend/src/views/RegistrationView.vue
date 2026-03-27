<script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import router from '../router';
  import { RouterLink } from 'vue-router';

  const userEmailCredential = ref('');
  const userLoginCredential = ref('');
  const userPasswordCredential = ref('');
  const nullEmail = ref(false);
  const nullUser = ref(false);
  const nullPassword = ref(false);
  const emailErrMessage = ref('');
  const usernameErrMessage = ref('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const handleRegistration= () => {
    // Handles email validation
    if(userEmailCredential.value === ''){
        nullEmail.value = true; 
        emailErrMessage.value = "Missing email";
    } else if (!validateEmail(userEmailCredential.value)){
        nullEmail.value = true; 
        emailErrMessage.value = "Invalid email";
    } else {
        nullEmail.value = false;
    }

    // Handles username validation
    if(userLoginCredential.value === ''){
        nullUser.value = true;
        usernameErrMessage.value = "Missing username";
     }else {
        nullUser.value = false;
    } 

    (userPasswordCredential.value.length < 8) ? nullPassword.value = true :  nullPassword.value = false;
    if(!nullPassword.value && !nullEmail.value && !nullUser.value){
        axios.post('http://localhost:3000/signup', {
        username: userLoginCredential.value,
        email: userEmailCredential.value,
        password: userPasswordCredential.value 
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
            if(err.response.data.error.type === "username") {
                nullUser.value = true;
                usernameErrMessage.value = err.response.data.error.message;
            } else if (err.response.data.error.type === "email"){
                nullEmail.value = true; 
                emailErrMessage.value = err.response.data.error.message;
            }
        })
    }
  }

</script>


<template>
    <main>
        <div class="signup">
            <h1>Create an account to get started</h1>
            <form @submit.prevent="handleRegistration">
                <div>
                    <h3 v-if="nullUser" class="null-input">{{ usernameErrMessage }}</h3>
                    <input v-model="userLoginCredential" placeholder="username" type="text" :class="[{isNull: nullUser}]" />
                </div>
                <div>
                    <h3 v-if="nullEmail" class="null-input">{{ emailErrMessage }}</h3>
                    <input v-model="userEmailCredential" placeholder="email" type="text" :class="[{isNull: nullEmail}]" />
                </div>
                <div>
                    <h3 v-if="nullPassword" class="null-input">Password must be at least 8 characters long</h3>
                    <input v-model="userPasswordCredential" placeholder="Enter a password" type="password" :class="[{isNull: nullPassword}]" />
                </div>
                <button type="submit" id="signup-btn">Sign up</button>
            </form>
            <div class="goBack">
                <h4>Already have an account?</h4>
                <RouterLink to="/login" id="link">Go back</RouterLink>
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
    .signup {
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

    input[type="text"], input[type="password"]{
        width: 90%;
    }

    input:focus {
        outline: transparent;
    }

    #signup-btn {
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

    .goBack {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
    
        & a {
            text-decoration: none;
            color:#26879d;
        }
    }

    .isNull{
        border: 2px solid rgb(218, 73, 73);
        margin-top: 0;
    }

    .null-input{
        color: rgb(218, 73, 73);
        font-size: 13px;
        margin-bottom: 0;
    }

</style>