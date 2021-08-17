<template>
    <div v-if="this.isVisible" class="modal-container">
        <Spinner /> 
    </div>
</template>

<script>
import Spinner from "@/components/LoadingSpinner/Spinner.vue";

export default {
    components: {
        Spinner
    }, 
    props: ['isVisible']
}
</script>

<style scoped>
.modal-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;

    background: rgba(0, 0, 0, 0.7);
}
</style>