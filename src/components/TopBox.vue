<template>
 <div class="top-box">
   <p>test</p>
   <img class="main-img" alt="Vue logo" src="../assets/logo.jpg">
 </div>
</template>

<script>
export default {
  name: "TopBox"
}
</script>

<style scoped lang="less">
.top-box{
  color: @color;

  .main-img{
    width: 100px;
    height: 100px;
  }
}
</style>