<template>
    <div>
        <h1>Features</h1>
        <div v-for="feature in features" :key="feature.id">
            <router-link :to="feature.route">{{feature.name}}</router-link>
        </div>
    </div>
</template>

<script>
import tokenHandler from "@/model/tokenHandler.js";

export default {
    data: function () {
        return {
            features: [
                {
                    id: 1,
                    name: "Collage Generator",
                    route: "/collage",
                },
                {
                    id: 2,
                    name: "Megamix",
                    route: "/megamix",
                },
            ],
        };
    },
    created: function () {
        if (!tokenHandler.getAccessToken()) {
            this.$router.push("/authorise");
        }
    },
};
</script>

<style scoped>
router-link span {
    background: red;
}
</style>