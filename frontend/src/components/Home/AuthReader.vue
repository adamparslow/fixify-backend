<template>
    <div>Getting spotify information</div>
</template>

<script>
import tokenHandler from "@/model/tokenHandler.js";

export default {
    created: function () {
        const queryString = this.$route.params.query;

        const [accessToken, refreshToken] = queryString
            .split("&")
            .map((query) => query.split("=")[1]);

        tokenHandler.setAccessToken(accessToken);
        tokenHandler.setRefreshToken(refreshToken);

        this.$router.push("/");
    },
};
</script>

<style scoped>
</style>