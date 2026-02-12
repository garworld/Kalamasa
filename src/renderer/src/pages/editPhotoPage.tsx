import EditPhotoLayout from '../components/EditPhotoLayout'
import Container from '../components/Container'
import PageTitle from '../components/PageTitle'

function EditPhotoPage(): JSX.Element {
  return (
    <Container>
      <div style={{ padding: '44px 0px', height: '100%' }}>
        <PageTitle title="" />
        <EditPhotoLayout />
      </div>
    </Container>
  )
}

export default EditPhotoPage
