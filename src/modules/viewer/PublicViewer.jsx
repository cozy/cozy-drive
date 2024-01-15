// A viewer with a custom pdfjs worker that will be available on the public pages of the app
import { pdfjs } from 'react-pdf'
import createWorker from 'react-pdf/dist/esm/pdf.worker.entry'

import Viewer from 'cozy-ui/transpiled/react/Viewer'

pdfjs.GlobalWorkerOptions.workerPort = createWorker()

export default Viewer
