<template>
    <div class="no-results">
        <span class="text big">
            No Results
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </span>
    </div>
</template>

<style scoped>
    .no-results {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }

    .no-results>.text {
        position: relative;
        width: fit-content;
        padding-left: 20px;
        padding-right: 20px;
        margin: 20px;
    }

    .no-results>.text.big {
        font-family: 'Michroma';
        font-size: 25px;
    }
</style>