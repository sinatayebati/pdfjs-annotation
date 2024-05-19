## PDF Annotator

Welcome to the PDF Annotator project! This project is built using Vue.js, PDF.js, and pdfAnnotate to provide a robust solution for viewing and annotating PDF documents. Whether you're a developer looking to integrate PDF viewing and annotation capabilities into your application or just exploring the capabilities of these powerful libraries, this guide will walk you through everything you need to get started.

As someone who found the documentation of PDF.js insufficient and faced significant challenges in programmatically adding annotations to PDF documents using a dedicated backend and database, I decided to create this project. Working with the annotation layer of PDF.js was very challenging and almost impossible to accomplish this task. Therefore, I created this small project to showcase the easiest production-level solution ([pdfAnnotate](https://github.com/highkite/pdfAnnotate)) I found for programmatic annotation and demonstrate how you can easily integrate the prebuilt PDF.js viewer into your Vue project.

### Table of Contents

1. [Getting Started](#getting-started)
   - [Using Docker](#using-docker)
   - [Manual Setup with NPM](#manual-setup-with-npm)
2. [Integrating PDF.js Viewer](#integrating-pdfjs-viewer)
3. [Annotating PDFs with pdfAnnotate](#annotating-pdfs-with-pdfannotate)

## Getting Started

### Using Docker

Setting up the project using Docker ensures a consistent environment and simplifies dependency management. Follow these steps to get started:

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-repo/pdf-annotator.git
   cd pdf-annotator
   ```

2. **Build the Docker Container**
   ```sh
   docker build -t pdf-annotator .
   ```

3. **Run the Docker Container**
   ```sh
   docker run -p 5173:5173 -v $(pwd):/app pdf-annotator
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173` to see the application in action.

### Manual Setup with NPM

If you prefer setting up the project manually using NPM, follow these steps:

1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-repo/pdf-annotator.git
   cd pdf-annotator
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Run the Development Server**
   ```sh
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173` to see the application in action.

## Integrating PDF.js Viewer

The `pdfViewer.vue` component integrates the default/prebuilt PDF.js viewer using an `iframe`. The fastest way to intergate pdfjs with your component is to use their prebuilt component. Discliamer: be cautious, the PDFjs team explicitly asks you "we do ask if you plan to embed the viewer in your own site, that it not just be an unmodified version. Please re-skin it or build upon it.". So be cautious about their terms and agreements.

Here's how simple integration with iframe works:

1. **Vue Template Structure**
   ```html
   <template>
     <div>
       <iframe ref="pdfViewerIframe" id="pdfViewer" :src="viewerUrl" style="width: 100%; height: 100vh;"></iframe>
     </div>
   </template>
   ```

2. **Vue Script Setup**
   ```javascript
   <script setup>
   import { ref, onMounted } from 'vue';
   import { piniaStore } from '../stores/piniaStore';
   import { storeToRefs } from 'pinia';

   const pdfViewerIframe = ref(null);
   const viewerUrl = ref('/pdfjs-annotation/pdfjs-4.2.67-dist/web/viewer.html');

   const pdfStore = piniaStore();
   const { pdfUrl } = storeToRefs(pdfStore);

   const loadPdf = async () => {
     if (pdfUrl.value) {
       const pdfData = await fetchPdfAsUint8Array(pdfUrl.value);
       iframeLoader(pdfData);
     } else {
       console.error("No PDF available");
     }
   };

   onMounted(() => {
     loadPdf();
   });

   async function fetchPdfAsUint8Array(pdfPath) {
     const response = await fetch(pdfPath);
     const arrayBuffer = await response.arrayBuffer();
     return new Uint8Array(arrayBuffer);
   }

   function iframeLoader(pdfData) {
     const pdfViewerIframeElement = pdfViewerIframe.value;
     if (!pdfViewerIframeElement) return;

     pdfViewerIframeElement.onload = () => {
       const viewerApp = pdfViewerIframeElement.contentWindow.PDFViewerApplication;
       if (viewerApp && viewerApp.initialized) {
         viewerApp.open({ data: pdfData });
       } else {
         console.error("Viewer is not ready or document not available");
       }
     };
     pdfViewerIframeElement.src = viewerUrl.value;
   }
   </script>
   ```

The PDF.js viewer is seamlessly integrated into the Vue component using an `iframe`, making it easy to load and display PDF documents.

## Annotating PDFs with pdfAnnotate

The `annotPdf.vue` component leverages the [pdfAnnotate](https://github.com/highkite/pdfAnnotate) library to add various types of annotations to PDF documents. The intergation of this library for programmatic annotations at least on PDFjs is seamless.
* Note: I personally tested this library in production with dedicated backend working with huge amounts of data in json format, so it's reliable. The only bug I found was that setting the appearance flag to "hidden" ony works on highlight annotation, while it's supposed to work on other markup annotations as well.
* A huge thanks to [pdfAnnotate](https://github.com/highkite/pdfAnnotate) for creating such a great tool with reliable documentation (more documentation than the entire pdfjs project, Haha!)

Here's how you can use it:

### Available Annotations

The `pdfAnnotate` library supports several types of annotations, including:
- Highlight
- Squiggly
- Underline
- Strikeout
- Square
- Oval
- and more

### Parameters Required

Each annotation type requires at least the following parameters:
- **page**: The page number where the annotation should be added.
- **rect**: The rectangle coordinates `[x1, y1, x2, y2]` defining the annotation's position.
- **contents**: The content of the annotation.
- **author**: The author of the annotation.
- **color**: The color of the annotation in `{ r, g, b }` format.
- **opacity**: The opacity of the annotation.

for details and the rest of the documentation, I urge you to read their entire documentation at [pdfAnnotate](https://github.com/highkite/pdfAnnotate).

* Note: one thing you need to be cautious is that pdfjs origin for a "rect" is top left, and pdfAnnotate origin is buttom left, so you need a simple conversion of "y" coordinates to create the list of your annotations.


### Script Setup

```javascript
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
  await deleteExistingAnnotations(viewerApp, pdfFactory);
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
  await deleteExistingAnnotations(viewerApp, pdfFactory);
};

const deleteExistingAnnotations = async (viewerApp, pdfFactory) => {
  const existingAnnotations = await pdfFactory.getAnnotations();
  const flattenedAnnotations = existingAnnotations.flat();
  if (flattenedAnnotations.length > 0) {
    const annotationIdsToDelete = flattenedAnnotations.map(annot => annot.id);
    const deletePromises = annotationIdsToDelete.map(annotationId => pdfFactory.deleteAnnotation(annotationId));

    // Delete all existing annotations
    await Promise.all(deletePromises);
    console.log('Deleted existing annotations');
    const updatedPdfData = pdfFactory.write();
    await viewerApp.open({ data: updatedPdfData });
  }
};
</script>
```

By integrating `pdfAnnotate`, you can easily add programmatic annotations to your PDF documents. This library supports various annotation types, making it flexible and powerful for different use cases.

---



Thank you for using the PDF Annotator project! We hope this guide helps you get the most out of your PDF viewing and annotation capabilities. Happy coding!