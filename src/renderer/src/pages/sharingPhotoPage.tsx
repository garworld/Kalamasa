import Container from '../components/Container'
import PageTitle from '../components/PageTitle'
import SharingPhotoLayout from '@renderer/components/SharingPhotoLayout'

function SharingPhotoPage(): JSX.Element {
  return (
    <Container>
      <div style={{ padding: '44px 0px', height: '100%' }}>
        <PageTitle title="" />
        <SharingPhotoLayout />
      </div>
    </Container>
  )
}

export default SharingPhotoPage
