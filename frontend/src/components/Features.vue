<template>
    <h1>Features</h1>
</template>

<script>
import tokenHandler from "../model/tokenHandler.js";

export default {
    created: function () {
        console.log("is this running?");
        if (!tokenHandler.getAccessToken()) {
            this.$router.push("/authorise");
        }
    },
};
</script>

<style scoped>
</style>