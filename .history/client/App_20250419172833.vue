<template>
    <div id="app">
        <header>
            <h1>IoT Dashboard</h1>
        </header>
        <main>
            <router-view />
        </main>
        <footer>
            <p>&copy; 2023 IoT Dashboard</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>

<style>
#app {
    font-family: Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    padding: 0;
}

header {
    background-color: #42b983;
    color: white;
    padding: 1rem;
}

footer {
    background-color: #2c3e50;
    color: white;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
}
</style></template>