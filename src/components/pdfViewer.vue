<template>
  <div>
    <iframe ref="pdfViewerIframe" id="pdfViewer" :src="viewerUrl" style="width: 100%; height: 100vh;"></iframe>
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

const pdfPageDimensions = ref([]);

// Call the function to load the PDF when the component is mounted
onMounted(() => {
  loadPdf();
});

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
      viewerApp.open({ data: pdfData }).then(() => {
        getPdfPageDimensions(viewerApp.pdfDocument);
      });
    } else {
      console.error("Viewer is not ready or document not available");
    }
  };
  pdfViewerIframeElement.src = viewerUrl.value;
}

async function getPdfPageDimensions(pdfDocument) {
  const numPages = pdfDocument.numPages;
  const dimensions = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    dimensions.push({ width: viewport.width, height: viewport.height });
  }
  pdfPageDimensions.value = dimensions;
  console.log('Page Dimensions:', pdfPageDimensions.value);
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

</script>
