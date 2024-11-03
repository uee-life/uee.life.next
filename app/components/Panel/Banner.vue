<script setup>
  import { gsap } from 'gsap'
  
  const props = defineProps({
      name: {
          type: String,
          required: true
      },
      tag: {
          type: String,
          default: ''
      },
      type: {
          type: String,
          default: ''
      },
      image: {
          type: String,
          default: ''
      },
      logo: {
          type: String,
          default: ''
      },
      display: {
          type: String,
          default: 'content'
      }
  })

  const img = useImage()
  
  const bannerImage = computed({
    get() {
          return `background: url("${img(`https://static.uee.life/${props.image}`)}") top center / cover`
      }
  })
  
  const bannerClass = computed({
      get() {
          return `banner content`
      }
  })
  
  onMounted(() => {
      const tl = gsap.timeline()
      tl.to(".banner", {duration: 0.5, opacity: 1})  
      if(props.logo) {
          tl.to(".banner-logo", {duration: 1, opacity: 1})
      }
      tl.to(".banner-summary", {delay: -0.5, duration: 1, opacity: 1})
  })
  </script>

  <template>
    <div>
        <div class="banner-img" :style="bannerImage"></div>
            <div class="mask" @click="$emit('clicked')">
            <div class="banner-bottom">
                <div v-if="logo" class="banner-logo" id="banner-logo">
                    <slot name="logo">
                        <img :src="logo" />
                    </slot>
                </div>
                <div class="banner-summary">
                    <h1>{{name}}<template v-if="tag"> /  <span class="tag"><slot name="tag">{{ tag.toUpperCase() }}</slot></span></template></h1>
                    <slot><div class="banner-type">{{type.toUpperCase()}}</div></slot>
                </div>
            </div>
        </div>
    </div>   
</template>
  
  <style scoped>
  
      .banner {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        max-width: calc(100vw - 20px);
        border: 1px solid #546f84;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        overflow: hidden;
        opacity: 0;
      }
  
      .banner.content {
          margin: 0 0 10px;
      }
  
      .banner.full {
          margin: 10px;
      }

  
      .banner .mask {
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: url('@/assets/fading-bars.png') repeat;
          z-index: 0;
          padding-top: 0.1px;
          padding-left: 5px;
          cursor: pointer;
      }
  
      .banner .banner-img {
        position: absolute;
        width: 100%;
        height: 250px;
        opacity: 0.8 !important;
        border-bottom: 1px dashed #546f84;
        display: block;
        background-size: cover;
        background-position: center center;
        z-index: -1;
      }

      .banner.mobile .banner-img {
        height: 130px;
      }
  
      .banner-logo{
          width: 136px;
          height: 136px;
          margin-right: 20px;
          opacity: 0;
      }
  
      .banner-bottom {
        bottom: 0;
        left: 0;
        padding: 5px;
        margin-top: 177px;
        display: flex;
      }

      .banner.mobile .banner-bottom {
        margin-top: 57px;
      }
  
      .banner h1 {
        height: fit-content;
        font-family: 'Michroma';
        letter-spacing: 1px;
        color: #dbf3ff;
        margin: 0;
      }
  
      .banner h1 .tag {
          color: #fff000;
          text-transform: uppercase;
      }
  
      .banner-logo img {
          width: 136px;
          height: 136px;
          margin-left: 5px;
      }
  
      .banner-summary {
        padding-top: 73px;
        opacity: 0;
      }
  
      .banner-summary .banner-type {
        font-family: "Michroma";
        font-size: 12px;
      }
      
      .banner-summary .banner-type::before {
        content: "[ "
      }
  
      .banner-summary .banner-type::after {
        content: " ]"
      }
  </style>