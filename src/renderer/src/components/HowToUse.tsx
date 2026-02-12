import images from '../assets/images'
import { StyledHowToUse } from '../Styled'

function HowToUse(): JSX.Element {
  const array = [
    { image: images.step1, prompt: '1. Bayar dengan QRIS atau masukkan voucher' },
    { image: images.step2, prompt: '2. Pilih frame & isi jumlah orang' },
    { image: images.step3, prompt: '3. Siapkan pose terbaikmu dan cekrek!' },
    { image: images.step4, prompt: '4. Simpan dan print foto kamu' }
  ]
  return (
    <StyledHowToUse>
      <div className="flex center">
        <img src={images.logo} className="logo" />
        <p>Kalamasa</p>
      </div>
      <div className="flex">
        <h1>
          Selamat datang di <span className="big">Kalamasa</span>
          <img src={images.sparkle} />
          <img src={images.pin} />
        </h1>
      </div>
      <div className="steps-container">
        {array.map((val, id) => {
          return (
            <div className="step" key={id}>
              <img src={val.image} />
              <div>{val.prompt}</div>
            </div>
          )
        })}
      </div>
    </StyledHowToUse>
  )
}

export default HowToUse
