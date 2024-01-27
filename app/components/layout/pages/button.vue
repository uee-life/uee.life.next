<template>
    <button :disabled="disabled" class="button button-scifi">
        <slot />
    </button>
</template>

<script>
export default {
    name: "page-button",
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped>
    .button {
        outline: none;
        transition: all 300ms ease-in-out;
        background: none;
        border: none;
        width: 20px;
        height: 20px;
        padding: 0;
        margin: 0;
        color: #dbf3ff;
    }

    .button:disabled {
        opacity: 0.3
    }
</style>