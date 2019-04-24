// If we don't use the result of the import at least once, webpack will eliminate the file when tree-shaking and the css won't be present in the production builds
import transpiled from 'cozy-ui/react/stylesheet.css'
transpiled
