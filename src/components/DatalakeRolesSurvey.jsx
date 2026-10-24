import * as React from 'react'
import { Link } from 'gatsby'
import { useForm, ValidationError } from '@formspree/react'
import Footer from './Footer'

const WORK_TODAY = [
  'I collect data in the settlement (surveys, photos, walks)',
  'I check other people’s data before it is used',
  'I make maps',
  'I write reports or present to the community or the municipality',
  'I look after computers, accounts, or backups',
  'I decide what our federation is willing to share',
]

const STEPS = [
  'Put data in',
  'Check a batch before anyone else uses it',
  'Approve what leaves our city',
  'Make a report or map from data that is already approved',
  'Look after who can log in',
]

const SKIP_NONE = 'No step I want to refuse'

const WILLING = [
  'Settlement name and counts',
  'A map outline',
  'Photos of places',
  'Photos of people',
  'Names and phone numbers',
]

export const copy = {
  en: {
    title: 'Who owns which step',
    pageTitle: 'Datalake roles',
    lede:
      'This is for people who were in the Nairobi datalake sessions. Incoming data stays with your city until someone from your city checks it, and someone from your city says it can be shared.',
    otherLang: 'Version française',
    otherHref: '/datalake-roles-fr/',
    name: 'Your name',
    email: 'Email',
    city: 'Your city',
    federation: 'Your federation',
    workLegend: 'What do you do today? Tick any that fit.',
    work: [
      'I collect data in the settlement (surveys, photos, walks)',
      'I check other people’s data before it is used',
      'I make maps',
      'I write reports or present to the community or the municipality',
      'I look after computers, accounts, or backups',
      'I decide what our federation is willing to share',
    ],
    ownLegend: 'On the datalake, which step do you want to own?',
    steps: [
      'Put data in',
      'Check a batch before anyone else uses it',
      'Approve what leaves our city',
      'Make a report or map from data that is already approved',
      'Look after who can log in',
    ],
    skipLegend: 'Which step do you not want?',
    skipNone: 'No step I want to refuse',
    dataset: 'Have you already shared a dataset with us, or can you send one in the next two weeks?',
    datasetHint: ' What is it, and which settlement?',
    approver: 'Who in your city should be allowed to approve sharing?',
    approverHint: ' Name one person. If that is you, say so.',
    willingLegend: 'Which of these are you willing to see in a file you check? Tick any.',
    willing: [
      'Settlement name and counts',
      'A map outline',
      'Photos of places',
      'Photos of people',
      'Names and phone numbers',
    ],
    language: 'What language should the screen and the short training be in?',
    send: 'Send',
    sending: 'Sending…',
    thanksTitle: 'Thank you',
    thanks:
      'We will use this to see who can check data in your city, and who can say it may be shared.',
    nameError: 'Name',
    emailError: 'Email',
  },
  fr: {
    title: 'Qui tient quelle étape',
    pageTitle: 'Rôles du datalake',
    lede:
      'Ce formulaire est pour les personnes qui étaient aux sessions datalake à Nairobi. Les données qui arrivent restent dans votre ville jusqu’à ce que quelqu’un de votre ville les vérifie, et que quelqu’un de votre ville dise qu’on peut les partager.',
    otherLang: 'English version',
    otherHref: '/datalake-roles/',
    name: 'Votre nom',
    email: 'Adresse e-mail',
    city: 'Votre ville',
    federation: 'Votre fédération',
    workLegend: 'Que faites-vous aujourd’hui ? Cochez tout ce qui vous correspond.',
    work: [
      'Je collecte des données dans le quartier (enquêtes, photos, visites)',
      'Je vérifie les données des autres avant qu’on s’en serve',
      'Je fais des cartes',
      'J’écris des rapports ou je présente à la communauté ou à la municipalité',
      'Je m’occupe des ordinateurs, des comptes et des sauvegardes',
      'Je décide ce que notre fédération accepte de partager',
    ],
    ownLegend: 'Dans le datalake, quelle étape voulez-vous tenir ?',
    steps: [
      'Mettre les données',
      'Vérifier un lot avant que quelqu’un d’autre s’en serve',
      'Approuver ce qui sort de notre ville',
      'Faire un rapport ou une carte à partir de données déjà approuvées',
      'Gérer qui peut se connecter',
    ],
    skipLegend: 'Quelle étape ne voulez-vous pas tenir ?',
    skipNone: 'Aucune étape que je veux refuser',
    dataset:
      'Avez-vous déjà partagé un jeu de données avec nous, ou pouvez-vous en envoyer un dans les deux prochaines semaines ?',
    datasetHint: ' De quoi s’agit-il, et quel quartier ?',
    approver: 'Qui, dans votre ville, doit pouvoir approuver le partage ?',
    approverHint: ' Donnez un nom. Si c’est vous, dites-le.',
    willingLegend:
      'Lesquelles de ces informations acceptez-vous de voir dans un fichier que vous vérifiez ? Cochez celles qui conviennent.',
    willing: [
      'Nom du quartier et effectifs',
      'Un contour sur la carte',
      'Photos de lieux',
      'Photos de personnes',
      'Noms et numéros de téléphone',
    ],
    language: 'Dans quelle langue doivent être l’écran et la courte formation ?',
    send: 'Envoyer',
    sending: 'Envoi…',
    thanksTitle: 'Merci',
    thanks:
      'Nous nous en servirons pour voir qui peut vérifier les données dans votre ville, et qui peut dire qu’on peut les partager.',
    nameError: 'Nom',
    emailError: 'E-mail',
  },
}

const RolesForm = ({ text, formLanguage }) => {
  const [state, handleSubmit] = useForm('xkjjggrl')

  if (state.succeeded) {
    return (
      <div className="contact-form-success" role="status">
        <h2 className="contact-form-title">{text.thanksTitle}</h2>
        <p className="contact-form-success-text">{text.thanks}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="_subject" value="Datalake roles survey" />
      <input type="hidden" name="form_language" value={formLanguage} />

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-name`}>{text.name}</label>
        <input id={`${formLanguage}-name`} type="text" name="name" autoComplete="name" required />
        <ValidationError prefix={text.nameError} field="name" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-email`}>{text.email}</label>
        <input id={`${formLanguage}-email`} type="email" name="email" autoComplete="email" required />
        <ValidationError prefix={text.emailError} field="email" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-city`}>{text.city}</label>
        <input id={`${formLanguage}-city`} type="text" name="city" required />
      </div>

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-federation`}>{text.federation}</label>
        <input id={`${formLanguage}-federation`} type="text" name="federation" required />
      </div>

      <fieldset className="survey-set">
        <legend>{text.workLegend}</legend>
        {text.work.map((label, index) => (
          <label className="survey-choice" key={WORK_TODAY[index]}>
            <input type="checkbox" name="work_today" value={WORK_TODAY[index]} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="survey-set">
        <legend>{text.ownLegend}</legend>
        {text.steps.map((label, index) => (
          <label className="survey-choice" key={`own-${STEPS[index]}`}>
            <input type="radio" name="own_step" value={STEPS[index]} required />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="survey-set">
        <legend>{text.skipLegend}</legend>
        {text.steps.map((label, index) => (
          <label className="survey-choice" key={`skip-${STEPS[index]}`}>
            <input type="radio" name="skip_step" value={STEPS[index]} />
            <span>{label}</span>
          </label>
        ))}
        <label className="survey-choice">
          <input type="radio" name="skip_step" value={SKIP_NONE} />
          <span>{text.skipNone}</span>
        </label>
      </fieldset>

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-dataset`}>
          {text.dataset}
          <span className="contact-form-optional">{text.datasetHint}</span>
        </label>
        <textarea id={`${formLanguage}-dataset`} name="dataset" />
      </div>

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-approver`}>
          {text.approver}
          <span className="contact-form-optional">{text.approverHint}</span>
        </label>
        <input id={`${formLanguage}-approver`} type="text" name="approver" required />
      </div>

      <fieldset className="survey-set">
        <legend>{text.willingLegend}</legend>
        {text.willing.map((label, index) => (
          <label className="survey-choice" key={WILLING[index]}>
            <input type="checkbox" name="willing_to_see" value={WILLING[index]} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <div className="contact-form-field">
        <label htmlFor={`${formLanguage}-language`}>{text.language}</label>
        <input id={`${formLanguage}-language`} type="text" name="language" required />
      </div>

      <ValidationError errors={state.errors} className="contact-form-error" />

      <button type="submit" className="contact-form-submit" disabled={state.submitting}>
        {state.submitting ? text.sending : text.send}
      </button>
    </form>
  )
}

const DatalakeRolesSurvey = ({ location, lang }) => {
  const text = copy[lang]
  const pathname = location?.pathname || ''
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)

  React.useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let ticking = false
    const checkBackground = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headerRect = header.getBoundingClientRect()
          const headerCenterY = headerRect.top + headerRect.height / 2
          const headerCenterX = window.innerWidth / 2
          const elementBelow = document.elementFromPoint(headerCenterX, headerCenterY)
          if (!elementBelow) {
            setTextColor('black')
            ticking = false
            return
          }

          let currentElement = elementBelow
          while (currentElement && currentElement !== document.body) {
            if (currentElement.classList && currentElement.classList.contains('card-primary')) {
              setTextColor('white')
              ticking = false
              return
            }
            if (
              currentElement.classList &&
              (currentElement.classList.contains('card-secondary') ||
                currentElement.classList.contains('page-container'))
            ) {
              setTextColor('black')
              ticking = false
              return
            }
            currentElement = currentElement.parentElement
          }

          setTextColor('black')
          ticking = false
        })
        ticking = true
      }
    }

    checkBackground()
    window.addEventListener('scroll', checkBackground, { passive: true })
    window.addEventListener('resize', checkBackground, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkBackground)
      window.removeEventListener('resize', checkBackground)
    }
  }, [])

  return (
    <div className="page-container">
      <header className="header" ref={headerRef}>
        <Link to="/" className="logo" style={{ color: textColor }}>
          Decision Labs
        </Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>
            About
          </Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>
            Blog
          </Link>
          <Link
            to="/contact"
            className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}
          >
            Contact
          </Link>
          <Link
            to="/customers"
            className={pathname === '/customers' || pathname === '/customers/' ? 'active' : ''}
          >
            Customers
          </Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>
            Work
          </Link>
        </nav>
      </header>

      <main className="main-content newsletter-content">
        <div className="content-cards newsletter-cards">
          <div className="card card-primary newsletter-main-card">
            <h1 className="contact-page-title">{text.title}</h1>
            <div className="card-body">
              <p className="mission-text survey-lede">{text.lede}</p>
              <p className="survey-lang">
                <Link to={text.otherHref}>{text.otherLang}</Link>
              </p>
            </div>
          </div>

          <div className="card card-secondary newsletter-form-card">
            <RolesForm text={text} formLanguage={lang} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DatalakeRolesSurvey
