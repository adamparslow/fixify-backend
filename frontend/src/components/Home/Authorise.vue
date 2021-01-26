<template>
    <div>
        <header class="header-bar">
            <h1>Fixify</h1>
        </header>
        <article>
            <p>Please log into your spotify to gain access to Fixify</p>
            <a href="/auth/login" class="rounded-button">Log In</a>
        </article>
    </div>
</template>

<style scoped>
a {
}

article {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
