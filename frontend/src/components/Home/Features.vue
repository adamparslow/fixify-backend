<template>
    <div class="container">
        <header class="header-bar">
            <h1>Fixify</h1>
        </header>
        <article class="routes-container">
            <div v-for="feature in features" :key="feature.id" style="background: white"
                v-bind:style="{background:feature.colour}">
                <router-link  :to="feature.route" class="router-link image" v-bind:class="feature.imageClass">
                    <span>{{feature.name}}</span>
                </router-link>
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
                    name: "Collage",
                    route: "/collage",
                    imageClass: "collage-image"
                },
                {
                    id: 2,
                    name: "Megamix",
                    route: "/megamix",
                    imageClass: "megamix-image"
                },
                {
                    id: 3,
                    name: "Artist Follower",
                    route: "/",
                    colour: "#33ccff"
                },
                {
                    id: 4,
                    name: "Album Liker",
                    route: "/",
                    colour: "#ff9900"
                },
                {
                    id: 5,
                    name: "Playlist Correction",
                    route: "/",
                    colour: "#66cc66"
                },
                {
                    id: 6,
                    name: "Song Correction",
                    route: "/",
                    colour: "#33ccff"
                },
                {
                    id: 7,
                    name: "Backup",
                    route: "/",
                    colour: "#ff9900"
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
}

.header-bar h1 {
    color: #33ccff;
    font-size: 80px;
}

.routes-container {
    flex: 1;
    display: flex;
    align-items: stretch;
    flex-direction: column;
}

.image {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
}

.collage-image {
    background-image: url('../../assets/collage.png');
}

.megamix-image {
    background-image: url('../../assets/megamix.png');
}

.router-container {
    margin-bottom: 1px;
}

.router-link {
    text-decoration: none;
    color: white;
    height: 46vw;
    
    display: flex;
    align-items:flex-end;
    justify-content: flex-start;
    
    font-size: 50px;
}

.router-link span {
    opacity: 100%;
}

.router-link:hover, .router-link:active {
    opacity: 20%;
}

.router-link a:active {
    text-decoration: none;
}
</style>