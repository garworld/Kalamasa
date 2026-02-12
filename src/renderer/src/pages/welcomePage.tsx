import HowToUse from '@renderer/components/HowToUse'
import BeginButton from '../components/BeginButton'
import Container from '../components/Container'

function WelcomePage(): JSX.Element {
  return (
    <Container>
      <HowToUse />
      <BeginButton />
    </Container>
  )
}

export default WelcomePage
