<style>
.resume-lhs {
    height: 100%;
    width: 100%;
    border-right: 1px solid;
}

.resume-lhs-wrapper {
    margin: 2rem;
    display: flex;
    flex-flow: column;
    align-items: flex-end;
}

.resume-lhs-wrapper div {
    white-space: pre-line;
    margin: 1rem 0;
    text-align: right;
}

.resume-lhs-wrapper h3 {
    text-align: right;
    margin-bottom: 1rem;
}
</style>

<template>
<section class="resume-lhs">

  <div class="resume-lhs-wrapper">

    <div v-for="item in data">
      <h3>{{ item.title }}</h3>
      <p>{{ item.content }}</p>      
    </div>

  </div>

  </section>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            required: true
        }
    },
}
</script>
