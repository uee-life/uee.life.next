<template>
    <div class="page-foot">
          <!--img class="foot-logo" alt="logo" src="@/assets/community.png"-->
          <div class="footer-text">Star Citizen®, Roberts Space Industries® and Cloud Imperium ® are registered trademarks of Cloud Imperium Rights LLC</div>
          <div class="footer-text">This is an unofficial Star Citizen fansite, not affiliated with the Cloud Imperium group of companies. All content on this site not authored by its host or users are property of their respective owners.</div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
      .page-foot {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 90px;
          display: flex;
          flex-direction: column;
          background: rgba(13, 46, 66, 0.5);
          justify-content: center; 
          text-align: center;
      }
      .page-foot .footer-text {
          font-size: 12px;
          font-family: 'Michroma';
          margin-bottom: 5px;
      }
      .foot-logo {
          height: 75px;
          align-self: center;
      }
  </style>