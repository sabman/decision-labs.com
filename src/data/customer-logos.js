import morganStanleyWebp from '../images/customers/morgan-stanley.webp'
import morganStanleyJpg from '../images/customers/morgan-stanley.jpg'
import huggingFaceWebp from '../images/customers/hugging-face.webp'
import huggingFacePng from '../images/customers/hugging-face.png'
import australianGovernmentWebp from '../images/customers/australian-government.webp'
import australianGovernmentJpg from '../images/customers/australian-government.jpg'
import esaLogo from '../images/customers/esa.svg'
import naverLogo from '../images/customers/naver.svg'

export const customerLogos = {
  'morgan-stanley': {
    webp: morganStanleyWebp,
    fallback: morganStanleyJpg,
    width: 320,
    height: 320,
  },
  'hugging-face': {
    webp: huggingFaceWebp,
    fallback: huggingFacePng,
    width: 320,
    height: 85,
  },
  'australian-government': {
    webp: australianGovernmentWebp,
    fallback: australianGovernmentJpg,
    width: 320,
    height: 240,
  },
  esa: {
    src: esaLogo,
    width: 320,
    height: 124,
  },
  naver: {
    src: naverLogo,
    width: 120,
    height: 120,
  },
}

export const logoModifiers = {
  'morgan-stanley': 'customer-logo-image--square',
  'hugging-face': 'customer-logo-image--wide',
  esa: 'customer-logo-image--wide',
  'australian-government': 'customer-logo-image--square',
  naver: 'customer-logo-image--compact',
}
