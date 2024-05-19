<template>
  <div class="switch-button">
    <v-btn @click="triggerHighlightAnnotations">Add Highlight Annotations</v-btn>
    <v-btn @click="triggerDeleteAnnotations">Delete Annotations</v-btn>
  </div>

  <div>
    <iframe ref="pdfViewerIframe" id="pdfViewer" :src="viewerUrl" style="width: 100%; height: 100vh;"></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { piniaStore } from '../stores/piniaStore';
import { storeToRefs } from 'pinia';
import { AnnotationFactory } from 'annotpdf';

const pdfViewerIframe = ref(null);
const viewerUrl = ref('/pdfjs-annotation/pdfjs-4.2.67-dist/web/viewer.html');

const pdfStore = piniaStore();
const { pdfUrl } = storeToRefs(pdfStore);
const pdfPageDimensions = ref([]);

// Call the function to load the PDF when the component is mounted
onMounted(() => {
  loadPdf();
});

const triggerHighlightAnnotations = async () => {
  const viewerApp = pdfViewerIframe.value.contentWindow.PDFViewerApplication;
  if (viewerApp && viewerApp.pdfDocument) {
    const data = await viewerApp.pdfDocument.getData();
    const pdfFactory = new AnnotationFactory(data);
    await highlightAnnotation(viewerApp, pdfFactory);
  }
};

const triggerDeleteAnnotations = async () => {
  const viewerApp = pdfViewerIframe.value.contentWindow.PDFViewerApplication;
  if (viewerApp && viewerApp.pdfDocument) {
    const data = await viewerApp.pdfDocument.getData();
    const pdfFactory = new AnnotationFactory(data);
    await deleteAnnotations(viewerApp, pdfFactory);
  }
};

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

const highlightAnnotation = async (viewerApp, pdfFactory) => {
  const annotations = [];
    const page = 0;
    const contents = 'Trace-based Just-in-Time Type Specialization for Dynamic';
    const author = 'Auto Generated';
    const rect = [
      530, // x1
      792 - 94.99, // y1
      80.56, // x2
      792 - 77.06 // y2
    ];
    annotations.push({
      page,
      rect,
      contents,
      author,
      color: {r: 255, g: 255, b: 0},
      opacity: 0.7,
    });

  annotations.forEach(annotation => {
    pdfFactory.createHighlightAnnotation(annotation);
  });
  const updatedPdfData = pdfFactory.write();
  viewerApp.open({ data: updatedPdfData });
  console.log('Added new annotations');
};

const deleteAnnotations = async (viewerApp, pdfFactory) => {
  if (viewerApp && viewerApp.pdfDocument) {
    const existingAnnotations = await pdfFactory.getAnnotations();
    const flattenedAnnotations = existingAnnotations.flat();
    if (flattenedAnnotations.length > 0) {
      const annotationIdsToDelete = flattenedAnnotations
        .map(annot => annot.id);
      const deletePromises = annotationIdsToDelete.map(annotationId => pdfFactory.deleteAnnotation(annotationId));

      // Delete all existing annotations
      await Promise.all(deletePromises);
      console.log('Deleted existing annotations');
      // delete annotation of the page passed and refresh
      const updatedPdfData = pdfFactory.write();
      await viewerApp.open({ data: updatedPdfData })
    }
  } else {
    console.error('PDF document is not loaded or viewerApp is not initialized correctly.');
  }
};
</script>

<style>
.switch-button {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
