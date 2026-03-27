<script setup>
  import { RouterView } from "vue-router";
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style>
  body {
    background-color: #222;
    font-family:Arial, Helvetica, sans-serif;
  }
  main {
    margin-top: 0;
    padding-top: 0;
  }
</style>