<template>
    <div class="home">
      <header>
        <img src="../assets/Logo.webp" alt="Logo" class="logo" />
        <div class="header-text">
          <h1>Programmatic PDF Annotator</h1>
          <h2>A component based on PDF.js & pdfAnnotate</h2>
        </div>
      </header>
      <v-container class="outer-container" fluid>
        <v-row class="inner-container">
          <v-col cols="12" md="8" class="viewer">
            <pdf-viewer @pdf-loaded="handlePdfLoaded"></pdf-viewer>
          </v-col>
          <v-col cols="12" md="4" class="tabs">
            <annot-pdf></annot-pdf>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import pdfViewer from './pdfViewer.vue';
  import annotPdf from './annotPdf.vue';
  
  export default {
    name: "home",
    components: {
      pdfViewer,
      annotPdf
    },
    data() {
      return {
        text: "",
        pdfLoadMessage: "",
      };
    },
    methods: {
      handlePdfLoaded(message) {
        this.pdfLoadMessage = message;
      }
    }
  }
  </script>
  
  <style>
  @import url("https://fonts.googleapis.com/css2?family=Heebo:wght@900&family=Montserrat:wght@100&family=Roboto&display=swap");
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
  }
  
  header {
    background-color: #1565C0;
    padding: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo {
    width: 110px;
    height: auto;
    margin-right: 20px;
  }
  
  .header-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  h1 {
    font-size: 40px;
    color: #fff;
    font-family: "Heebo", sans-serif;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }
  
  h2 {
    font-size: 20px;
    color: #fff;
    font-family: "Heebo", sans-serif;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    margin-top: 10px;
  }
  
  .home {
    height: 100vh;
  }
  
  .outer-container {
    max-width: 100%;
    padding: 0 16px;
    margin: 0 20px;
  }
  
  .inner-container {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    padding: 0%;
    margin: 0;
  }
  
  .viewer,
  .tabs {
    flex: 1;
    height: 120vh;
  }
  
  .tabs {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  
  @media (max-width: 1200px) {
    .viewer,
    .tabs {
      max-width: 100%;
    }
  }
  </style>
  