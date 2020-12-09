<template>
    <div>
        <h1>Megamix</h1>
        <router-link to="/">Home</router-link>
        <button v-on:click="createMegamix">Create playlist</button>
        <button v-on:click="toggleRegister">{{this.registerMessage}}</button>
        <p>For this to work, you need to make sure that all of your daily mixes are liked.</p>
        <p>To create a megamix, click Create Megamix</p>
        <p>To sign up for daily megamixes, click Register.</p>
        <p>If you are already registered and would like to opt out, click Deregister</p>
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