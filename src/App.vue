<template>
  <IDNHeader />
  <ResourceForm />
</template>

<script>
import IDNHeader from "@/components/IDNHeader";
import ResourceForm from "@/components/ResourceForm";

export default {
  name: 'App',
  components: {
    IDNHeader,
    ResourceForm
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  margin: 0;
  background-color: #eee;
}
a {
    color: rgb(221, 37, 37);
    text-decoration: none;
}
</style>
