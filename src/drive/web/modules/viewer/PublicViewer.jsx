// A viewer with a custom pdfjs worker that will be available on the public pages of the app
import { Viewer } from 'cozy-ui/transpiled/react'
import createWorker from 'react-pdf/dist/esm/pdf.worker.entry'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerPort = createWorker()

export default Viewer
