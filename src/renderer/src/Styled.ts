/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
`

const StyledLayout = styled.div<{ width: number; height: number }>`
  box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  max-width: 1280px;
  height: 100%;
  max-height: 1024px;
  overflow-y: auto;
  overflow-x: hidden;
  /* Background handled by InteractiveBackground component */
  color: #000;
  padding: 0px 84px;

  @media (max-width: 900px) {
    padding: 0px 44px;
  }
`
const StyledHowToUse = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    color: #000;
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .big {
    font-size: 64px;
  }

  .logo {
    background-color: var(--snapspot-orange);
    display: flex;
    width: 36.759px;
    height: 36.759px;
    padding: 5.321px 10.382px 4.833px 10.413px;
    justify-content: center;
    align-items: center;
    border-radius: 7.917px;
  }

  .flex {
    width: 100%;
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .steps-container {
    width: 100%;
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .steps-container {
      flex-direction: column;
      gap: 24px;
    }
  }

  .gap-16 {
    gap: 16px;
  }

  .center {
    justify-content: center;
  }

  p {
    font-size: 24px;
  }

  .step {
    display: flex;
    width: 260px;
    height: 200px;
    padding: 24px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    border-radius: 20px;
    border: 1px solid var(--snapspot-border);
    box-shadow: var(--snapspot-shadow-card);
    background: #fffdfa;
    font-size: 16px;

    @media (max-width: 768px) {
      width: 100%;
      height: auto;
      max-width: 400px; /* Limit width */
    }
  }
`

const StyledBeginButton = styled.div`
  width: '100%';
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding-top: 80px;
  gap: 20px;

  button {
    font-family: 'Poppins';
    position: relative;
    width: 450px;
    height: 80px;
    border-radius: 16px; /* Rounded rectangle, not pill */
    text-align: center;
    border: none;
    background-color: var(--snapspot-button-bg);
    color: var(--snapspot-button-text);
    z-index: 1;
    box-shadow: var(--snapspot-shadow-3d);
    transition: all 0.1s ease;
  }

  button:active {
    box-shadow: none;
    transform: translateY(5px);
  }

  .orange {
    background-color: var(--snapspot-button-bg);
  }

  .blue {
    background-color: var(--snapspot-blue);
  }

  .flex {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    width: 300px;
  }

  .devider {
    height: 10px;
    width: 100%;
    border-bottom: 3px solid black;
  }

  p {
    font-weight: 500;
  }
`

const StyledActionButton = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 12px;
  text-align: center;
  border: none;
  background-color: #000000;
  color: #ffffff;
  z-index: 10;
  box-shadow: var(--snapspot-shadow-3d);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active {
    box-shadow: none;
    transform: translateY(5px);
  }
`

const StyledModal = styled.div<{
  width: number | string
  height: number | string
}>`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  width: ${(props) => props.width};
  height: ${(props) => props.height};

  max-width: 920px;
  max-height: 90vh;
  overflow-y: auto;

  outline: none;
  border-radius: 20px;
  transition: height 0.2s ease;
  background-color: #ffffff;
  color: var(--snapspot-text);
  padding: 40px;

  display: flex;
  flex-direction: column;
  gap: 30px;

  border: 1px solid var(--snapspot-border);
  box-shadow: var(--snapspot-shadow-card);

  &::-webkit-scrollbar {
    display: none;
  }

  /* ===== Header ===== */
  .title {
    color: #000;
    font-size: 24px;
    font-weight: 500;
    line-height: normal;
  }

  .flex {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .close {
    width: 40px;
    height: 40px;
    object-fit: contain;
    cursor: pointer;
  }

  /* ===== Content Grid ===== */
  .payment-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 30px;
    height: 100%;
  }

  .payment-item {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      color: #000;
      font-size: 20px;
      font-weight: 500;
      margin-top: 16px;
    }

    h2 {
      font-size: 16px;
      font-weight: 300;
      margin-top: 24px;
    }

    p {
      word-break: break-word; /* biar qrData ga bikin overflow */
    }

    .refresh {
      color: var(--snapspot-orange);
      font-size: 16px;
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
    }

    .e-wallet {
      padding: 0 40px;
      display: flex;
      flex-direction: column;
      gap: 40px;
      text-align: left;

      .images-box {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .images {
        display: flex;
        flex-wrap: wrap; /* penting biar logo ga ngeluber */
        gap: 14px;
        align-items: center;
        justify-content: center;
      }

      img {
        height: 32px;
        max-width: 110px;
        object-fit: contain;
      }
    }
  }

  /* tombol area (item ke-3) */
  .payment-item:nth-child(3) {
    grid-column: span 2;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    font-family: 'Poppins';
    width: 300px;
    height: 50px;
    border-radius: 12px;
    border: none;

    background-color: var(--snapspot-button-bg);
    color: var(--snapspot-button-text);

    box-shadow: var(--snapspot-shadow-3d);
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease;
    cursor: pointer;
  }

  button:active {
    box-shadow: none;
    transform: translateY(5px);
  }

  /* ===== Voucher (tetap) ===== */
  .voucher-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .voucher-input {
    border-radius: 16px;
    border: 1px solid #000;
    background: #fff;
    width: 100%;
    display: flex;
    padding: 20px 24px;
    align-items: center;
    gap: 10px;
    font-family: 'Poppins', sans-serif;
  }

  .uppercase {
    text-transform: uppercase;
  }

  .voucher-input::placeholder {
    font-family: 'Poppins', sans-serif;
    color: #999;
    text-transform: lowercase;
  }

  .warning {
    color: #000;
    font-size: 32px;
    font-weight: 500;
  }

  .font-20 {
    font-size: 20px;
  }

  .text-center {
    text-align: center;
  }

  /* =========================
     Responsive Breakpoints
     ========================= */

  /* Tablet */
  @media (max-width: 900px) {
    width: min(92vw, 720px);
    padding: 28px;

    .payment-content {
      grid-template-columns: 1fr; /* jadi 1 kolom */
    }

    .payment-item:nth-child(3) {
      grid-column: span 1;
    }

    button {
      width: 100%;
      max-width: 360px;
    }

    .e-wallet {
      padding: 0 12px !important;
      gap: 24px !important;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    width: 94vw;
    padding: 18px;
    gap: 18px;
    border-radius: 16px;

    .title {
      font-size: 18px;
    }

    .close {
      width: 28px;
      height: 28px;
    }

    .payment-content {
      gap: 18px;
    }

    .payment-item {
      h1 {
        font-size: 18px;
      }
      h2 {
        font-size: 14px;
        margin-top: 16px;
      }
      .refresh {
        font-size: 14px;
      }
    }

    button {
      height: 46px;
      border-radius: 12px;
      width: 100%;
    }
  }
`

const StyledPrePhotoLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 40px;
  padding: 56px 0px;
`

const StyledPageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 40px;

  .title {
    color: #000;
    font-family: Poppins;
    font-size: 28px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .timer {
    width: 120px;
    display: inline-flex;
    padding: 12px 23px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border-radius: 999px;
    background: #404040;
    color: #fffdfa;
    font-family: Poppins;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`
const StyledFrameListBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  width: 100%;
  height: 100%;
  border: 1px solid var(--snapspot-border);
  background: #fff;
  box-shadow: var(--snapspot-shadow-card);
  border-radius: 20px;

  .tab-panel-box {
    flex-grow: 1;
    padding: 16px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const StyledPrePhotoContent = styled.div`
  display: flex;
  gap: 20px;
  height: 100%;
  max-height: 90%;

  .selected-frame {
    height: 60%;
    border: 1px solid var(--snapspot-border);
    background: #fff;
    box-shadow: var(--snapspot-shadow-card);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 40px;

    .frame {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 100%;
      }
    }
  }

  .flex {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    width: 100%;

    button {
      display: flex;
      width: 78px;
      height: 64px;
      justify-content: center;
      align-items: center;
      border: none;
      box-shadow: var(--snapspot-shadow-card);
      background: var(--snapspot-blue);
      border-radius: 100%;
      font-size: 32px;
    }
  }

  .show-amount {
    width: 100%;
    height: 64px;
    border: 1px solid var(--snapspot-border);
    background: #fff;
    box-shadow: var(--snapspot-shadow-card);
    border-radius: 10px;
    text-align: center;
    align-content: center;
    font-size: 28px;
    font-weight: bold;
  }

  p {
    color: #000;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-align: center;
  }

  .button {
    font-family: 'Poppins';
    font-size: 18px;
    color: #fff;
    position: relative;
    width: 100%;
    height: 50px;
    border-radius: 12px;
    text-align: center;
    border: none;
    background-color: var(--snapspot-button-bg);
    color: var(--snapspot-button-text);
    z-index: 1;
    box-shadow: var(--snapspot-shadow-3d);
    transition: all 0.1s ease;
    /* border-bottom: 6px solid black; */
  }

  .orange {
    background-color: var(--snapspot-orange);
  }

  .button:active {
    box-shadow: none;
    transform: translateY(3px);
  }
`

const StyledPhotoLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  padding: 44px 0px;

  .countdown-overlay {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    font-size: 92px;
    font-family: 'Poppins';
    color: white;
    border-radius: 100%;
    opacity: 0.5;
    background: #bcbcbc;
    width: 150px;
    height: 150px;
    padding: 10.974px;
  }

  .photo-session {
    display: flex;
    gap: 20px;
    height: 100%;
    width: 100%;
  }

  .photo-box {
    border: 1px solid var(--snapspot-border);
    background: #fff;
    box-shadow: var(--snapspot-shadow-card);
    border-radius: 20px;
    height: 100%;
    width: 70%;
  }

  .flex-column {
    display: flex;
    gap: 20px;
    flex-direction: column;
    width: 30%;
  }

  .photo-guide {
    position: relative;
    border: 1px solid var(--snapspot-border);
    background: #fff;
    box-shadow: var(--snapspot-shadow-card);
    border-radius: 20px;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    gap: 12px;

    .title {
      color: #000;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    .pose-image {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .blank {
      background: rgba(234, 234, 234, 0.8);
      border-radius: 8px;
    }

    .slider {
      position: absolute;
      width: 100%;
      height: 48%;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0px 4px;

      .button-slider {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      .button-retake {
        display: flex;
        justify-content: center;

        button {
          font-family: 'Poppins';
          font-size: 14px;
          color: #fff;
          position: relative;
          width: 60%;
          height: 40px;
          border-radius: 12px;
          text-align: center;
          border: none;
          background-color: var(--snapspot-button-bg);
          box-shadow: var(--snapspot-shadow-3d);
          z-index: 1;
        }

        .orange {
          background-color: var(--snapspot-orange);
        }
      }
    }
  }

  .controls {
    position: absolute;
    left: 30%;
    top: 85%;
  }

  .retake-button-include {
    left: 17%;
  }

  .button-gap {
    display: flex;
    gap: 20px;
  }

  .flex-right {
    display: flex;
    width: 100%;
    justify-content: right;
    align-items: right;
  }

  .button {
    font-family: 'Poppins';
    font-size: 18px;
    color: #fff;
    position: relative;
    width: 320px;
    height: 50px;
    border-radius: 12px;
    text-align: center;
    border: none;
    background-color: var(--snapspot-button-bg);
    color: var(--snapspot-button-text);
    z-index: 1;
    box-shadow: var(--snapspot-shadow-3d);
    transition: all 0.1s ease;
    /* border-bottom: 6px solid black; */
  }

  .orange {
    background-color: var(--snapspot-orange);
  }

  .blue {
    background-color: var(--snapspot-blue);
  }

  .button:active {
    box-shadow: none;
    transform: translateY(3px);
  }

  .edit-box {
    border: 1px solid var(--snapspot-border);
    background: #fff;
    box-shadow: var(--snapspot-shadow-card);
    border-radius: 20px;
    height: 100%;
    padding: 20px 34px;
    display: flex;
    flex-direction: column;
    gap: 25px;

    .title {
      color: #000;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    .filter-list {
      width: 105%;
      display: flex;
      padding-bottom: 5px;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .flex {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-content: space-between;
      gap: 10px;
    }

    @media (max-width: 1024px) {
      .flex {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .button-filter {
      width: 72px;
      height: 72px;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #fff;
      text-align: center;
      border: none; /* Removed thick border */
      box-shadow: var(--snapspot-shadow-3d);
      color: #000;
    }

    .border {
      border: 6px solid rgba(0, 0, 0, 0.64);
    }

    .edit-position {
      width: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .width-30 {
    width: 30%;
  }

  .width-70 {
    width: 70%;
  }

  /* Tablet / iPad Portrait Styles */
  @media (max-width: 1024px) {
    padding: 20px 0px;
    height: auto;

    .photo-session {
      height: auto;
      gap: 20px;
    }

    .photo-session-column {
      flex-direction: column;
      gap: 0px;
    }

    .photo-box {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      min-height: 400px;
    }

    .controls {
      position: static;
      margin-top: 20px !important; /* Override inline styles if any */
      transform: none;
      width: 100%;
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
    }

    .retake-button-include {
      left: 0;
    }

    .flex-column {
      width: 100%;
      flex-direction: row; /* Side by side on tablet? */
      gap: 10px;
    }

    .photo-guide {
      width: 50%;
      height: auto;
      aspect-ratio: 1;
    }

    /* Adjust countdown overlay for smaller screens */
    .countdown-overlay {
      width: 100px;
      height: 100px;
      font-size: 60px;
      left: 50%;
      top: 30%;
    }

    /* Hide desktop finish button on tablet/iPad */
    .desktop-finish-btn {
      display: none !important;
    }

    /* Show mobile finish button on tablet/iPad */
    .mobile-finish-btn {
      display: block !important;
    }
  }

  /* Default hide mobile finish button on desktop */
  .mobile-finish-btn {
    display: none;
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .flex-column {
      flex-direction: column;
    }
    .photo-guide {
      width: 100%;
    }
  }
`

const StyledLoadingLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 44px 0px 44px 0px;

  .loading-screen {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 100px;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 36px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .border {
    border: 1px solid var(--snapspot-border);
    background: #fff;
    box-shadow: var(--snapspot-shadow-card);
  }

  .loading-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;

    .bar {
      position: relative;
      width: 100%;
      height: 30px;
      border-radius: 15px;
      border: 1px solid var(--snapspot-border);
      background: #e0e0e0;
    }

    .bar-overlay {
      width: 20%;
      height: 27px;
      border-top-left-radius: 14px;
      border-bottom-left-radius: 14px;
      background-color: var(--snapspot-orange);
      transition:
        width 0.5s ease-in-out,
        border-radius 0.3s ease-in-out;
    }
  }
`

const StyledSharingPhoto = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 44px 0px;

  .flex {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

  .flex-right {
    display: flex;
    width: 100%;
    justify-content: right;
    align-items: right;
  }

  .content {
    display: flex;
    gap: 40px;
    border: 2px solid #000;
    width: 80%;
    border-radius: 20px;
    padding: 16px 24px;

    .view {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      max-height: 550px;
      padding: 20px;
      overflow: hidden;
    }

    .border {
      border: 2px solid #000;
      border-radius: 20px;
    }
  }

  .select-result {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .active {
      border: 4px solid rgba(0, 0, 0, 0.5);
      background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
        url(<path-to-image>) lightgray 50% / cover no-repeat;
    }
  }

  .round-button {
    border-radius: 999px;
    border: 2px solid #000;
    background: #4fb1bf;
    display: flex;
    width: 130px;
    height: 130px;
    padding: 28px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    color: #fff;
  }

  .button {
    font-family: 'Poppins';
    font-size: 18px;
    color: #fff;
    position: relative;
    width: 320px;
    height: 50px;
    border-radius: 40px;
    text-align: center;
    border: 2px solid black;
    z-index: 1;
    box-shadow: 0px 6px #000;
    /* border-bottom: 6px solid black; */
  }

  .orange {
    background-color: #ff4000;
  }

  .button:active {
    box-shadow: none;
    transform: translateY(3px);
  }
`

const StyledOutro = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 44px;
  gap: 60px;

  .logo {
    background-color: var(--snapspot-orange);
    display: flex;
    width: 36.759px;
    height: 36.759px;
    padding: 5.321px 10.382px 4.833px 10.413px;
    justify-content: center;
    align-items: center;
    border-radius: 7.917px;
  }

  .flex {
    width: 100%;
    display: flex;
    gap: 50px;
    align-items: center;
  }

  .gap-6 {
    gap: 6px;
  }

  .center {
    justify-content: center;
  }

  .column {
    flex-direction: column;
  }

  button {
    font-family: 'Poppins';
    font-size: 18px;
    color: #fff;
    position: relative;
    width: 320px;
    height: 50px;
    border-radius: 40px;
    text-align: center;
    border: 2px solid black;
    z-index: 1;
    box-shadow: 0px 6px #000;
    /* border-bottom: 6px solid black; */
  }

  .orange {
    background-color: #ff4000;
  }

  button:active {
    box-shadow: none;
    transform: translateY(3px);
  }
`

export {
  StyledContainer,
  StyledLayout,
  StyledBeginButton,
  StyledModal,
  StyledPrePhotoLayout,
  StyledActionButton,
  StyledPageTitle,
  StyledFrameListBox,
  StyledPrePhotoContent,
  StyledPhotoLayout,
  StyledHowToUse,
  StyledLoadingLayout,
  StyledSharingPhoto,
  StyledOutro
}
