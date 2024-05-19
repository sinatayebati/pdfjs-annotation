<script setup>
import { piniaStore } from '../stores/piniaStore';

const store = piniaStore()
</script>

<template>
    <div class="home">
        <header>
            <h1>Vue component for Annotating PDFjs</h1>
        </header>
        <v-container class="outer-container">
            <v-row class="inner-container">
                <v-col cols="12" md="8" class="viewer">
                    <pdf-viewer @pdf-loaded="handlePdfLoaded"></pdf-viewer>
                </v-col>
                <v-col cols="12" md="4" class="tabs">
                    <tab-buttons></tab-buttons>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import pdfViewer from './pdfViewer.vue';

export default {
    name: "home",
    components: {
        pdfViewer
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
    font-family: "Robot", sans-serif;
}

header {
    background-color: #78909C;
    padding: 20px;
    text-align: center;
}

h1 {
    font-size: 50px;
    color: #fff;
    font-family: "Heebo", sans-serif;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}

.home {
    height: 200vh;
}

.outer-container {
    max-width: 100%;
    padding: 0 16px;
    margin: 0;
}

.inner-container {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    padding: 0;
    margin: 5%;
    column-gap: 20px;
}

.viewer,
.tabs {
    flex: 1;
}

@media (max-width: 1200px) {
    .viewer,
    .tabs {
        max-width: 100%;
    }
}

</style>