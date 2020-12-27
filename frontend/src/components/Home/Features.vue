<template>
    <div class="container">
        <header class="header-bar">
            <h1>Fixify</h1>
        </header>
        <article class="routes-container">
            <div v-for="feature in features" :key="feature.id" class="route-box">
                <router-link :to="feature.route" class="router-link">{{feature.name}}</router-link>
            </div>
        </article>
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
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.header-bar {
    display: flex;
    justify-content: center;
    background: #33ccff;
    padding: 40px;
}

.routes-container {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 40px;
}

.route-box {
    display: flex;
}

.router-link {
    background: #33ccff;;
    padding: 10px;
    margin: 5px;
    border-radius: 40px;
    text-decoration: none;
    color: black;
}

.router-link:hover {
    background: rgba(51, 204, 255, 0.2);
}

.router-link a:active {
    text-decoration: none;
}
</style>