<template>
    <div>
        <header class="header-bar">
            <h1>Fixify</h1>
        </header>
        <article>
            <p>Please log into your spotify to gain access to Fixify</p>
            // TODO: move into .env
            <a href="http://localhost:3000/auth/login" class="rounded-button">Log In</a>
        </article>
    </div>
</template>

<style scoped>
article {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
