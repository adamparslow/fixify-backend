<template>
    <div>
        <header class="header-bar">
            <h1>Megamix</h1>
        </header>
        <router-link to="/" class="rounded-button">Home</router-link>
        <article>
            <section>
                <h2>What is a Megamix?</h2>
                <p>A megamix is a playlist that is the combination of all your daily mixes. It is ~17 hours of Spotify AI goodness, without the separation of genres and styles.</p>
            </section>
            <section>
                <h2>How to use Megamix</h2>
                <p>There are two ways to use Megamix. The first is to generate a megamix by clicking this button</p>
                <button v-on:click="createMegamix">Generate Megamix</button>
                <p>
                    The second takes a bit more work but is worth it. First you need to make sure all your daily mixes are liked in your Spotify. 
                    Any mix that you miss will not make it into the megamix. 
                    Then you simply register below, and a fresh megamix will replace the old one every night. 
                </p>
            </section>
            <section>
                <h2>Register here</h2>
                <button v-on:click="toggleRegister">{{this.registerMessage}}</button>
            </section>
        </article>
    </div>
</template>

<script>
import megamixService from "@/model/megamixService.js";

export default {
    data: function () {
        return {
            registered: false,
        };
    },
    created: async function () {
        this.registered = await megamixService.getMegamixRegistrationStatus();
    },
    methods: {
        toggleRegister: function () {
            console.log("does this come up");
            this.registered = !this.registered;
            this.registered
                ? megamixService.registerForMegamix()
                : megamixService.deregisterFromMegamix();
        },
        createMegamix: function () {
            megamixService.createMegamix();
        },
    },
    computed: {
        registerMessage: function () {
            return this.registered ? "Deregister" : "Register";
        },
    },
};
</script>