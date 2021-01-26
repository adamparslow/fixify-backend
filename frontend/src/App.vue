<template>
    <router-view />
</template>

<style>
@font-face {
    font-family: Gotham;
    src: url(./assets/HomepageBaukasten-Book.woff);
}

@font-face {
    font-family: Gotham-Bold;
    src: url(./assets/HomepageBaukasten-Bold.ttf)
}

body {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    background: #333333;
    color: white;

    font-family: Gotham;
}

.header-bar {
    display: flex;
    justify-content: center;
}

.header-bar h1 {
    color: #33ccff;
    font-size: 80px;
}

.rounded-button {
    background: #33ccff;
    padding: 10px;
    border-radius: 20px;
    text-decoration: none;
    color: black;
}

</style>
