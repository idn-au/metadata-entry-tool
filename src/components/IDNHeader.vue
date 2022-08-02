<template>
  <header>
    <img src="@/assets/idn-logo-250.png" alt="IDN Logo"/>
    <h1>Indigenous Data Network</h1>
  </header>
</template>

<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL
    }
  }
}
</script>

<style>
  header {
    margin: 0 auto;
    width: 60%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center
  }
  img {
    margin-right: 20px;
  }
  h1 {
    font-family: sans-serif;
    font-size: 4em;
    font-weight: 400;
    color: #2f2f2f;
    display:inline;
  }
</style>