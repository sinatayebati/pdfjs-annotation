<template>
  <div>
    <iframe ref="pdfViewerIframe" id="pdfViewer" :src="viewerUrl" style="width: 100%; height: 120vh;"></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { piniaStore } from '../stores/piniaStore';
import { storeToRefs } from 'pinia';

const pdfViewerIframe = ref(null);
const viewerUrl = ref('/pdfjs-annotation/pdfjs-4.2.67-dist/web/viewer.html');

const pdfStore = piniaStore();
const { pdfUrl } = storeToRefs(pdfStore);

// Function to load the PDF file as Uint8Array
async function fetchPdfAsUint8Array(pdfPath) {
  const response = await fetch(pdfPath);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

// Function to load the PDF into the viewer
function iframeLoader(pdfData) {
  const pdfViewerIframeElement = pdfViewerIframe.value;
  if (!pdfViewerIframeElement) return;

  pdfViewerIframeElement.onload = () => {
    const viewerApp = pdfViewerIframeElement.contentWindow.PDFViewerApplication;
    if (viewerApp && viewerApp.initialized) {
      viewerApp.open({ data: pdfData }); // Pass pdfData as an object
    } else {
      console.error("Viewer is not ready or document not available");
    }
  };

  // Trigger the iframe load
  pdfViewerIframeElement.src = viewerUrl.value;
}

// Function to load the PDF when the component is mounted
async function loadPdf() {
  if (pdfUrl.value) {
    const pdfData = await fetchPdfAsUint8Array(pdfUrl.value);
    iframeLoader(pdfData);
  } else {
    console.error("No PDF available");
  }
}

// Call the function to load the PDF when the component is mounted
onMounted(() => {
  loadPdf();
});
</script>
