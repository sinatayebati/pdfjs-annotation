<template>
  <div class="button-container">
    <v-row class="button-row">
      <v-col cols="6">
        <v-btn @click="setAnnotationType('highlight', { r: 255, g: 255, b: 0 })" block color="yellow darken-1">Add Highlight</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="triggerDeleteAnnotations" block color="red darken-1">Delete Annotations</v-btn>
      </v-col>
    </v-row>
    <v-row class="button-row">
      <v-col cols="6">
        <v-btn @click="setAnnotationType('squiggly', { r: 255, g: 0, b: 0 })" block color="green darken-1">Add Squiggly</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="triggerDeleteAnnotations" block color="red darken-1">Delete Annotations</v-btn>
      </v-col>
    </v-row>
    <v-row class="button-row">
      <v-col cols="6">
        <v-btn @click="setAnnotationType('underline', { r: 0, g: 255, b: 0 })" block color="blue darken-1">Add Underline</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="triggerDeleteAnnotations" block color="red darken-1">Delete Annotations</v-btn>
      </v-col>
    </v-row>
    <v-row class="button-row">
      <v-col cols="6">
        <v-btn @click="setAnnotationType('strike', { r: 255, g: 0, b: 0 })" block color="purple-lighten-1">Add Strike</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="triggerDeleteAnnotations" block color="red darken-1">Delete Annotations</v-btn>
      </v-col>
    </v-row>
    <v-row class="button-row">
      <v-col cols="6">
        <v-btn @click="setAnnotationType('square', { r: 0, g: 255, b: 0 })" block color="pink-lighten-1">Add Square</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="triggerDeleteAnnotations" block color="red darken-1">Delete Annotations</v-btn>
      </v-col>
    </v-row>
    <v-row class="button-row">
      <v-col cols="6">
        <v-btn @click="setAnnotationType('oval', { r: 0, g: 0, b: 255 })" block color="amber-lighten-1">Add Oval</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="triggerDeleteAnnotations" block color="red darken-1">Delete Annotations</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { piniaStore } from '../stores/piniaStore';
import { storeToRefs } from 'pinia';
import { AnnotationFactory } from 'annotpdf';

const pdfStore = piniaStore();
const { pdfUrl } = storeToRefs(pdfStore);

const annotationType = ref('highlight');
const annotationColor = ref({ r: 255, g: 255, b: 0 });

const setAnnotationType = (type, color) => {
  annotationType.value = type;
  annotationColor.value = color;
  triggerHighlightAnnotations();
};

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
  // First, delete all existing annotations
  const existingAnnotations = await pdfFactory.getAnnotations();
  const flattenedAnnotations = existingAnnotations.flat();
  if (flattenedAnnotations.length > 0) {
    const annotationIdsToDelete = flattenedAnnotations.map(annot => annot.id);
    const deletePromises = annotationIdsToDelete.map(annotationId => pdfFactory.deleteAnnotation(annotationId));
    await Promise.all(deletePromises);
    console.log('Deleted existing annotations');
  }

  // Then add new annotations
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
    color: annotationColor.value,
    opacity: 0.7,
  });

  annotations.forEach(annotation => {
    if (annotationType.value === 'highlight') {
      pdfFactory.createHighlightAnnotation(annotation);
    } else if (annotationType.value === 'squiggly') {
      pdfFactory.createSquigglyAnnotation(annotation);
    } else if (annotationType.value === 'underline') {
      pdfFactory.createUnderlineAnnotation(annotation);
    } else if (annotationType.value === 'strike') {
      pdfFactory.createStrikeOutAnnotation(annotation);
    } else if (annotationType.value === 'square') {
      pdfFactory.createSquareAnnotation(annotation);
    } else if (annotationType.value === 'oval') {
      pdfFactory.createCircleAnnotation(annotation);
    }
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
  gap: 0px;
  margin-bottom: 10px;
  width: 100%;
  padding: 10px;
  background-color: #F5F5F5;
  border: 1px solid #ddd;
  box-sizing: border-box;
  height: 100%;
}

.button-row {
  margin-bottom: 5px;
}

.v-btn {
  height: 50px;
  font-size: 16px;
}
</style>
