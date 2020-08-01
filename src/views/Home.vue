<template>
  <div class="home">
    <h1>this is home page</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted () {
    this.$request.get('/getList', { a: 1 }, { isMessage: true }).then(res => {
      console.log(333, res)
    })
  }
}
</script>
