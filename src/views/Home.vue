<template>
  <div class="home">
    <h1>this is home page</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted () {
    this.$request.get('/getList', { a: 1, b: 2 }, { isMessage: true }).then(res => {
      console.log(333, res)
    }).catch(err => {
      console.log(111, err)
    })
    this.$request.post('/addList', { name: 'lzf' }, { isMessage: true }).then(res => {
      console.log(444, res)
    })
  }
}
</script>
