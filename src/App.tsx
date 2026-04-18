import { Routes, Route } from 'react-router-dom'
import { Toaster } from './components/common/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import IndustryPage from './pages/IndustryPage'
import TemplatePage from './pages/TemplatePage'
import EditorPage from './pages/EditorPage'
import FilesPage from './pages/FilesPage'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/industry" element={<IndustryPage />} />
          <Route path="/template/:industryId" element={<TemplatePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:manualId" element={<EditorPage />} />
          <Route path="/files" element={<FilesPage />} />
        </Route>
      </Routes>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App
