import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/welcomePage'
import PrePhotoPage from './pages/prePhotoPage'
import PhotoPage from './pages/photoPage'
import EditPhotoPage from './pages/editPhotoPage'
import LoadingPage from './pages/loadingPage'
import SharingPhotoPage from './pages/sharingPhotoPage'
import FinishPage from './pages/finishPage'
import { Bounce, ToastContainer } from 'react-toastify'
import InteractiveBackground from './components/InteractiveBackground'

function App(): JSX.Element {
  const routeList = [
    {
      path: '/',
      element: <WelcomePage />
    },
    {
      path: '/pre-photo',
      element: <PrePhotoPage />
    },
    {
      path: '/photo-session',
      element: <PhotoPage />
    },
    {
      path: '/photo-edit',
      element: <EditPhotoPage />
    },
    {
      path: '/loading',
      element: <LoadingPage />
    },
    {
      path: '/share-photo',
      element: <SharingPhotoPage />
    },
    {
      path: '/thanks',
      element: <FinishPage />
    }
  ]

  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Bounce}
        icon={false}
      />
      <InteractiveBackground />
      <Routes>
        {routeList.map((val) => (
          <Route key={val.path} path={val.path} element={val.element} />
        ))}
      </Routes>
    </Router>
  )
}

export default App
