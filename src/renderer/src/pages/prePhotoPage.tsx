import PageTitle from '../components/PageTitle'
import Container from '../components/Container'
import PrePhotoLayout from '../components/PrePhotoLayout'
import PrePhotoContent from '../components/PrePhotoContent'

function PrePhotoPage(): JSX.Element {
  return (
    <Container>
      <PrePhotoLayout>
        <PageTitle title="Pilih Frame & Tentukan Jumlah Orang" />
        <PrePhotoContent />
      </PrePhotoLayout>
    </Container>
  )
}

export default PrePhotoPage
