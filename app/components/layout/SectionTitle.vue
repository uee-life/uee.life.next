<template>
    <div :class="computedClass">
        <span class="text">
            {{ text }}
            <div class="endcap left"></div>
            <div class="endcap right"></div>
        </span>
    </div>
</template>

<script>
export default {
    name: "section-title",
    props: {
        text: {
            type: String,
            required: true
        },
        visibility: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    computed: {
        computedClass() {
            return `section-title ${this.size} ${this.visibility}`
        }
    }
}
</script>

<style scoped>
    .section-title {
        font-family: 'Michroma';
        position:absolute;
        left: 0;
        width: 100%;
        display: flex;
        text-transform: uppercase;
        word-spacing:3px;
    }

    .section-title.hidden {
      opacity: 0;
    }

    .section-title .text {
        position: relative;
        padding-left: 10px;
        padding-right: 10px;
        text-shadow: 0px 0px 15px rgba(57, 206, 216, 0.5);
        color: #dbf3ff;
    }

    .section-title.small {
      top: -10px;
    }
    .section-title.small>.text {
      font-size: 10px;
      margin-left: 30px;
    }

    .section-title.medium {
        top: -15px;
    }
    .section-title.medium>.text {
        font-size: 14px;
        margin-left: 30px;
    }

    .section-title.large {
        top: -22px;
    }
    .section-title.large>.text {
        font-size: 18px;
        margin-left: 20px;
    }
</style>