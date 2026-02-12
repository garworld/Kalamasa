import useScreenSize from '../helpers/UseScreenSize'
import { StyledContainer, StyledLayout } from '../Styled'

type Props = {
  children: React.ReactNode
}

function Container({ children }: Props): JSX.Element {
  const { width, height } = useScreenSize()

  return (
    <StyledContainer>
      <StyledLayout width={width} height={height}>
        {children}
      </StyledLayout>
    </StyledContainer>
  )
}

export default Container
