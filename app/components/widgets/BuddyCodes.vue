<script setup>


const {status, data, refresh} = useAPI(`/api/user/codes`)
</script>

<template>
    <panel-dock title="Buddy Codes" title-size="small">
        <div class='buddy' v-if="status == 'success'">
            <div v-for="code in data.data" :class="code.used ? 'used' : ''">
                {{ code.code }} <span v-if="code.used">- Used</span><span v-else>- Available</span>
            </div>
        </div>
        
    </panel-dock>
</template>

<style scoped>
.buddy {
    display: flex;
    flex-direction: column;
    align-items: left;
    margin-left: 10px;
}
.used {
    color: gray;
}
</style>