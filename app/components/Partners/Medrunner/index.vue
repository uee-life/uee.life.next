<script setup>

</script>

<template>
    <div class="partner" @click="navigateTo('https://portal.medrunner.space/')">
        <a href="https://portal.medrunner.space/">
            <img class="partner-img" src="/images/partners/medrunner.png" />
        </a>
    </div>
</template>

<style scoped>
.partner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.partner-img {
    width: 150px;
}
</style>