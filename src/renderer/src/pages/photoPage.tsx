import PhotoLayout from '../components/PhotoLayout'
import Container from '../components/Container'
import PageTitle from '../components/PageTitle'

function photoPage(): JSX.Element {
  return (
    <Container>
      <div style={{ padding: '44px 0px', height: '100%' }}>
        <PageTitle title="" />
        <PhotoLayout />
      </div>
    </Container>
  )
}

export default photoPage
