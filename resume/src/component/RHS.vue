<style>
.resume-rhs {
    height: 100%;
    width: 100%;
    border-left: 1px solid;
}

.resume-rhs-wrapper {
    margin: 2rem;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
}

.resume-rhs-wrapper div {
    white-space: pre-wrap;
    margin: 1rem 0;
}

.resume-rhs-wrapper h3 {
    text-align: left;
}
</style>

<template>
<section class="resume-rhs">

  <div class="resume-rhs-wrapper">

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
