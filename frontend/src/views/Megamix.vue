<template>
    <div class="outer-container">
        <div class="container">
            <header class="header-bar">
                <h1>Megamix</h1>
            </header>
            <router-link to="/" class="rounded-button">Home</router-link>
            <article>
                <section>
                    <h2>What is a Megamix?</h2>
                    <hr>
                    <p>A megamix is a playlist that is the combination of all your daily mixes. It is ~17 hours of Spotify AI goodness, without the separation of genres and styles.</p>
                    <aside>
                        <h3>IMPORTANT!</h3>
                        <p><i>You must have all of your daily mixes liked within your spotify account or this will not work</i></p>
                    </aside>
                </section>
                <section>
                    <h2>Once-Only</h2>
                    <hr>
                    <p>The below button instantly creates a megamix playlist in your spotify account. It does this once only, and will need to be pressed again to get a new playlist.</p>
                    <div class="once-only-button-container">
                        <button v-on:click="createMegamix" class="once-only-button">GENERATE MEGAMIX</button>
                    </div>
                </section>
                <section>
                    <h2>Daily</h2>
                    <hr>
                    <p>If you would rather have a new megamix playlist everyday, click register.</p>
                    <p> 
                        Currently you are {{this.registerTextMessage}}. Press the button to
                        <button class="once-only-button" v-on:click="toggleRegister">{{this.registerButtonMessage}}</button>
                    </p>
                    <a v-if="megamixUrl != ''" v-bind:href="megamixUrl">Link to megamix playlist</a>
                </section>
            </article>
            <LoadingSpinnerModal :is-visible="this.isCreatingMegamix" />
        </div>
    </div>
</template>

<script>
import megamixService from "@/model/megamixService.js";
import LoadingSpinnerModal from "@/components/LoadingSpinner/Modal.vue";

export default {
    data: function () {
        return {
            registered: false,
            isCreatingMegamix: false,
            megamixUrl: ""
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
        createMegamix: async function () {
            this.isCreatingMegamix = true;
            this.megamixUrl = await megamixService.createMegamix();
            this.isCreatingMegamix = false;
        },
    },
    computed: {
        registerButtonMessage: function () {
            return this.registered ? "Deregister" : "Register";
        },
        registerTextMessage: function () {
            return this.registered ? "registered" : "not registered";
        },
        // onceOnlyText: function () {
        //     return this.isCreatingMegamix ? "GENERATING MEGAMIX..." : "GENERATE MEGAMIX";
        // }
    },
    components: {
        LoadingSpinnerModal
    }
};
</script>

<style scoped>
.outer-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.container {
    margin: 5px;
    max-width: 960px;
}

.header-bar h1 {
    color: #66cc66;
}

h2 {
    margin-bottom: 0px;
    font-family: Gotham-Bold;
}

aside {
    display: flex;
    flex-direction: column;
    align-items: center;

    border: 5px solid #66cc66;
    border-radius: 10px;
    background: #b3e6b3; /**50% opacity of border with white background */
    color: black;

    margin: 0px 20px;
    padding: 0px 10px;
}

aside h3 {
    margin-bottom: 0px;
}

.once-only-button-container {
    display: flex;
    justify-content: center;
}

.once-only-button {
    /* border: 5px solid #66cc66; */
    border: none;
    border-radius: 20px;
    background: #478f47; /**50% opacity of border with white background */
    padding: 10px;
    color: white;
    margin-top: 2px;
    margin-bottom: 3px;
    font-size: 14px;
}

.once-only-button:hover, .once-only-button:active {
    background: #66cc66; /**50% opacity of border with white background */
    padding: 12px;
    margin: 0px;
    font-size: 15px;
}

</style>