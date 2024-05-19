<template>
  <div class="button-container">
    <v-btn @click="triggerHighlightAnnotations">Add Highlight Annotations</v-btn>
    <v-btn @click="triggerDeleteAnnotations">Delete Annotations</v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { piniaStore } from '../stores/piniaStore';
import { storeToRefs } from 'pinia';
import { AnnotationFactory } from 'annotpdf';

const pdfStore = piniaStore();
const { pdfUrl } = storeToRefs(pdfStore);

const triggerHighlightAnnotations = async () => {
  const pdfViewerIframe = document.getElementById('pdfViewer');
  const viewerApp = pdfViewerIframe.contentWindow.PDFViewerApplication;
  if (viewerApp && viewerApp.pdfDocument) {
    const data = await viewerApp.pdfDocument.getData();
    const pdfFactory = new AnnotationFactory(data);
    await highlightAnnotation(viewerApp, pdfFactory);
  }
};

const triggerDeleteAnnotations = async () => {
  const pdfViewerIframe = document.getElementById('pdfViewer');
  const viewerApp = pdfViewerIframe.contentWindow.PDFViewerApplication;
  if (viewerApp && viewerApp.pdfDocument) {
    const data = await viewerApp.pdfDocument.getData();
    const pdfFactory = new AnnotationFactory(data);
    await deleteAnnotations(viewerApp, pdfFactory);
  }
};

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
    color: { r: 255, g: 255, b: 0 },
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
      const annotationIdsToDelete = flattenedAnnotations.map(annot => annot.id);
      const deletePromises = annotationIdsToDelete.map(annotationId => pdfFactory.deleteAnnotation(annotationId));

      // Delete all existing annotations
      await Promise.all(deletePromises);
      console.log('Deleted existing annotations');
      // delete annotation of the page passed and refresh
      const updatedPdfData = pdfFactory.write();
      await viewerApp.open({ data: updatedPdfData });
    }
  } else {
    console.error('PDF document is not loaded or viewerApp is not initialized correctly.');
  }
};
</script>

<style>
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  box-sizing: border-box;
  height: 120vh;
}
</style>
