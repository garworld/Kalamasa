import { StyledPrePhotoLayout } from '../Styled'

type Props = {
  children: React.ReactNode
}

function PrePhotoLayout({ children }: Props): JSX.Element {
  return <StyledPrePhotoLayout>{children}</StyledPrePhotoLayout>
}

export default PrePhotoLayout
