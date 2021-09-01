<template>
    <div class="container">
        <header class="header-bar">
            <h1>Fixify</h1>
        </header>
        <button class="rounded-button" v-on:click="logOut">Log Out</button> 
        <article class="routes-container">
            <router-link  v-for="feature in features" :key="feature.id" :to="feature.route" class="router-link image" v-bind:class="feature.imageClass">
                <span>{{feature.name}}</span>
            </router-link>
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
                    name: "Search",
                    route: "/search",
                    imageClass: "green-background"
                },
                {
                    id: 4,
                    name: "Artist Follower",
                    route: "/",
                    imageClass: "blue-background"
                },
                {
                    id: 5,
                    name: "Album Liker",
                    route: "/",
                    imageClass: "yellow-background"
                },
                {
                    id: 6,
                    name: "Playlist Correction",
                    route: "/",
                    imageClass: "green-background"
                },
                {
                    id: 7,
                    name: "Song Correction",
                    route: "/",
                    imageClass: "blue-background"
                },
                {
                    id: 8,
                    name: "Backup",
                    route: "/",
                    imageClass: "yellow-background"
                },
            ],
        };
    },
    methods: {
        logOut: function () {
            tokenHandler.setAccessToken(null);
            tokenHandler.setRefreshToken(null);
            this.$router.push("/authorise");
        }
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
    align-items: center;
}

.routes-container {
    flex: 1;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    width: 100%;
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

.blue-background {
    background: #33ccff;
}

.yellow-background {
    background: #ff9900;
}

.green-background {
    background: #66cc66;
}

.router-link {
    text-decoration: none;
    color: white;
    height: 46vw;
    
    display: flex;
    align-items:flex-end;
    justify-content: flex-start;
    
    font-size: 10vw;
}
/* 
.router-link:hover::before {
    background: white;
} */

.router-link:hover, .router-link:active {
    opacity: 0.2;
}

.router-link a:active {
    text-decoration: none;
}

@media only screen and (min-width: 401px) and (max-width: 1200px) {
    .routes-container {
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;
    }    

    .router-link {
        width: 50%;
        height: 23vw; /** half the mobile height */
        
        font-size: 5vw;
    }    
}

@media only screen and (min-width: 1201px) {
    .routes-container {
        flex-direction: row;
        flex-wrap: wrap;
        width: 1200px;
    }
    
    .router-link {
        height: 277px; /** 13:6 ratio, length of 1200px */
        width: 600px;
        
        font-size: 60px;
    }
}
</style>