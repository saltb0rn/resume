<style>

#resume {
    width: 100vw;
    height: 100vh;
    display: flex;
}

.resume-body {
    display: flex;
    justify-content: space-around;
    margin: auto;

}

.resume-lhs {
    width: 48%;
    border-right: 1px solid;
}

.resume-rhs {
    width: 48%;
    border-left: 1px solid;
}
</style>

<template>

<div id="resume">
  <!-- <div class="resume-head"></div> -->
  <div class="resume-body">
    <LHS :data="lhsData"></LHS>
    <RHS :data="rhsData"></RHS>
  </div>
</div>

</template>

<script>
import LHS from "../component/LHS.vue";
import RHS from "../component/RHS.vue";

export default {
    props: {
        lhsData: {
            type: Array,
            required: true
        },
        rhsData: {
            type: Array,
            required: true
        }
    },

    components: {
        LHS,
        RHS
    }
}
</script>
