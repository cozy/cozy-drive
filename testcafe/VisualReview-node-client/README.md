# VisualReview-node-client
Node.js client for [VisualReview](https://github.com/xebia/VisualReview)

## Getting started
```shell
npm install visualreview-client --save-dev
```

```javascript
import VisualReview from 'visualreview-client';

const vr = new VisualReview({
  projectName: 'myProject',
  suiteName: 'myTestSuite'
});

// Create run on the VisualReview server
vr.start();

// Upload a screenshot
vr.uploadScreenshot('myscreenshot.png');
```
