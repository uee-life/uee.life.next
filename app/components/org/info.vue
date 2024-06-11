<template>
    <div id="org-info" class="org-info">
        <org-content v-if="org.manifesto" title="Manifesto" :content="org.manifesto"></org-content>
        <org-content v-if="org.charter" title="Charter" :content="org.charter"></org-content>
        <org-content v-if="org.history" title="History" :content="org.history"></org-content>
    </div>
</template>
  
<script setup>
import { gsap } from 'gsap'

const props = defineProps({
    org: {
        type: Object,
        required: true
    },
    isOwner: {
        type: Boolean,
        default: false
    }
})

const tabs = ["history", "manifesto", "charter"]
const initialTab = "history"
const founders = ref({})
const orgIntro = ref("")
  
  /*
    methods: {
      citizenLink(handle) {
        return `/citizens/${handle}`
      },
      async getCitizen(handle) {
        return await this.$axios({
          url: `https://api.uee.life/citizens/${handle}/info`,
          method: 'GET'
        }).then((res) => {
          if(res.status == 200) {
            return res.data
          } else {
            return ''
          }
        }).catch((err) => {
          console.error(err)
        })
      },
      async loadFounders() {
        const founders = this.org.founders
        console.log(founders)
        for (let i in founders) {
          console.log(founders[i].handle)
          const citizen = this.getCitizen(founders[i].handle)
          founders[i].portrait = await this.getCitizen(founders[i].handle)
        }
        this.founders = founders
      }
    },
    watch: {
      org: {
          handler: async function () {
            if(this.org.founders.length > 0) {
              gsap.fromTo(".founders", {duration: 1, height: '20px'}, {'height': '145px'})
              this.loadFounders()
            }
          }
      }
    },
    mounted() {
      if(this.org && this.org.founders && this.org.founders.length > 0) {
        gsap.fromTo(".founders", {duration: 1, height: '20px'}, {'height': '145px'})
        this.loadFounders()
      }
    }
  }*/
</script>
  
<style scoped>
    .org-info {
    position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 10px;
    }

    .org-info .info {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 20px);
        margin-left: -10px;
        margin-right: -10px;
        opacity: 1;
    }

    .org-info .info .info-panel {
        flex-basis: 250px;
        margin-left: 10px;
        margin-right: 10px;
        flex-grow: 1;
    }

    ul.info-items {
    padding-left: 0;
    margin: 0 20px 0 20px;
    }

    .org-info .info .line-item {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-left: 0px;
    }
</style>