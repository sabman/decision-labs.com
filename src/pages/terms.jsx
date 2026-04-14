import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import Footer from '../components/Footer'

const TermsPage = ({ location }) => {
  const pathname = location?.pathname || ''
  const [textColor, setTextColor] = React.useState('black')
  const headerRef = React.useRef(null)

  // Detect background color behind header (throttled for performance)
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
            if (currentElement.classList && (
              currentElement.classList.contains('card-secondary') ||
              currentElement.classList.contains('page-container')
            )) {
              setTextColor('black')
              ticking = false
              return
            }
            currentElement = currentElement.parentElement
          }

          const bgColor = window.getComputedStyle(elementBelow).backgroundColor
          if (bgColor) {
            const rgb = bgColor.match(/\d+/g)
            if (rgb && rgb.length >= 3) {
              const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3
              setTextColor(brightness < 128 ? 'white' : 'black')
            } else {
              setTextColor('black')
            }
          } else {
            setTextColor('black')
          }
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
        <Link to="/" className="logo" style={{ color: textColor }}>Decision Labs</Link>
        <nav className="nav">
          <Link to="/about" className={pathname === '/about' || pathname === '/about/' ? 'active' : ''}>About</Link>
          <Link to="/blog" className={pathname === '/blog' || pathname === '/blog/' ? 'active' : ''}>Blog</Link>
          <Link to="/contact" className={pathname === '/contact' || pathname === '/contact/' ? 'active' : ''}>Contact</Link>
          <Link to="/work" className={pathname === '/work' || pathname === '/work/' ? 'active' : ''}>Work</Link>
        </nav>
      </header>

      <main className="main-content terms-content">
        <div className="terms-wrapper">
          <h1 className="terms-page-title">Terms & Conditions</h1>
          <div className="terms-text">
            <p>
              Wir, die SpacialDB UG, Chausseestr 105, 10115 Berlin, sind Betreiber dieser Website und der darauf angebotenen Dienste und somit verantwortlich für die Erhebung, Verarbeitung und Nutzung von personenbezogenen Daten im Sinne des Bundesdatenschutzgesetzes (BDSG) und des Telemediengesetzes (TMG). Der ordnungsgemäße Umgang mit Ihren persönlichen Daten ist uns ein besonderes Anliegen. Daher informieren wir Sie im Folgenden gern über den Umgang mit Ihren persönlichen Daten.
            </p>

            <p>
              Wir verwenden Ihre personenbezogenen Daten unter Beachtung der geltenden datenschutzrechtlichen Bestimmungen. Im Folgenden erläutern wir, welche Daten wir erheben, wie diese durch uns verwendet werden und welche Rechte Ihnen im Hinblick auf die Verwendung Ihrer Daten gegenüber uns zustehen:
            </p>

            <h2>1. Erhebung personenbezogener Daten</h2>

            <h3>a) Bei Besuch unserer Website</h3>
            <p>
              Beim Besuch unserer Website speichern unsere Server temporär jeden Zugriff in einer Protokolldatei. Folgende Daten werden dabei ohne Ihr Zutun erfasst und von uns gespeichert:
            </p>
            <ul>
              <li>die IP-Adresse des anfragenden Rechners;</li>
              <li>das Datum und die Uhrzeit des Zugriffs;</li>
              <li>der Name und die URL der abgerufenen Datei;</li>
              <li>die Website, von der aus der Zugriff erfolgt;</li>
              <li>das Betriebssystem Ihres Rechners und der von Ihnen verwendete Browser;</li>
            </ul>
            <p>
              Die Erhebung und Verarbeitung dieser Daten erfolgt zu dem Zweck, die Nutzung unserer Website zu ermöglichen (Verbindungsaufbau), die Systemsicherheit und –stabilität dauerhaft zu gewährleisten, die technische Administration der Netzinfrastruktur und die Optimierung unseres Internetangebotes zu ermöglichen, sowie zu internen statistischen Zwecken. Die IP-Adresse wird nur bei Angriffen auf unsere Netzinfrastruktur sowie zu statistischen Zwecken ausgewertet.
            </p>
            <p>
              Darüber hinaus setzen wir bei Besuch unserer Website Cookies und Webanalysedienste ein. Hierzu siehe Ziff. 5 und Ziff. 6 dieser Datenschutzerklärung.
            </p>

            <h3>b) Bei Registrierung auf unserer Website</h3>
            <p>
              Wir erheben von Ihnen im Zuge der Registrierung auf unserer Website folgende Daten:
            </p>
            <ul>
              <li>Name (Nachname, Vorname);</li>
              <li>Anschrift;</li>
              <li>Arbeitgeber, Firma;</li>
              <li>Kontaktdaten (Telefonnummer, E-Mail-Adresse);</li>
              <li>Kreditkartendaten.</li>
            </ul>
            <p>
              Die Erhebung dieser Daten erfolgt,
            </p>
            <ul>
              <li>um die Nutzung unseres Dienstes zu ermöglichen (Registrierung);</li>
              <li>um Kenntnis zu haben, wer unser Vertragspartner ist;</li>
              <li>zur Begründung, inhaltlichen Ausgestaltung, Abwicklung und Änderung von Vertragsverhältnissen mit Ihnen über die Nutzung unserer Website und der darauf angebotenen Dienste;</li>
              <li>zur Überprüfung der eingegebenen Daten auf Plausibilität und Geschäftsfähigkeit der Nutzer;</li>
              <li>zur ggf. notwendigen Kontaktaufnahme mit Ihnen bei Rückfragen.</li>
            </ul>

            <h3>c) bei der Nutzung des Portals als registrierter Nutzer</h3>
            <p>
              Während der Nutzung des Portals erheben und speichern wir Daten aus statistischen Gründen, um die reibungslose Funktionsfähigkeit des Portals zu ermöglichen, zur Ermöglichung der Verfolgung eventueller Rechtsverstöße und zur Anzeige an andere Nutzer und an Sie selbst. Dazu zählen insbesondere:
            </p>
            <ul>
              <li>die Art, Frequenz und Intensität der Nutzung;</li>
              <li>die Dauer und Art Ihrer Nutzung</li>
            </ul>

            <h3>d. bei der Bestellung unseres Newsletters</h3>
            <p>
              Sofern Sie ausdrücklich eingewilligt haben, verwenden wir Ihre E-Mail-Adresse dafür, Ihnen regelmäßig unseren Newsletter zu übersenden. Am Ende jedes Newsletters findet sich ein Link, über den Sie den Newsletter jederzeit abbestellen können.
            </p>

            <h2>2. Verwendung personenbezogener Daten</h2>
            <p>
              Die Verwendung Ihrer personenbezogenen Daten erfolgt zum Zwecke der Abwicklung des mit Ihnen bestehenden Vertragsverhältnisses.
            </p>
            <p>
              <strong>a)</strong> Ihren Namen und Ihre Anschrift benötigen wir, um Kenntnis zu haben, wer unser Vertragspartner ist, d. h. wem gegenüber wir unsere Leistungen erbringen und abrechnen. Auch wenn nicht Sie selbst, sondern eine sonstige juristische Person (z. B. Ihr Arbeitgeber) unser Vertragspartner wird, benötigen wir Ihren Namen, um Ihnen Ihre Zugangsberechtigung einrichten zu können.
            </p>
            <p>
              <strong>b)</strong> Ihre Kontaktdaten (E-Mail-Adresse und Telefonnummer) benötigen wir, um Ihnen Ihre Registrierungsbestätigung zu übersenden und für Rückfragen. Ihre E-Mail-Adresse dient zum Empfang unseres Newsletters, sofern Sie Abonnent des Newsletter sind (siehe auch Ziff. 4).
            </p>
            <p>
              <strong>c)</strong> Ihre Kreditkartendaten benötigen wir, um die Kosten für die Entgelte für kostenpflichtige Pläne abrechnen zu können.
            </p>

            <h2>3. Übermittlung personenbezogener Daten an Dritte</h2>
            <p>
              Eine Weitergabe Ihrer Daten an Dritte findet nicht statt. Ohne Ihre Zustimmung werden wir Ihre Daten nicht an Dritte verkaufen oder anderweitig weitergeben. Etwas anderes gilt nur, soweit hierfür eine gesetzliche Verpflichtung besteht oder soweit dies zur Durchsetzung unserer Rechte erforderlich ist, insbesondere zur Durchsetzung von Ansprüchen aus dem Vertragsverhältnis mit Ihnen.
            </p>

            <h2>4. Einwilligung in weitergehende Nutzung</h2>
            <p>
              Um Ihnen per E-Mail Informationen über Neuigkeiten und Angebote unseres Portals zukommen zu lassen, erhalten Sie unseren Newsletter. Der Versand des Newsletters erfolgt an die von Ihnen bei der Online-Registrierung angegebene E-Mail-Adresse. Sie können den Newsletter jederzeit abbestellen. Sie können über einen Link am Ende des Newsletters eine Stornierung vornehmen.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Cookies helfen unter vielen Aspekten, Ihren Besuch auf unserer Website einfacher, angenehmer und sinnvoller zu gestalten. Cookies sind alphanumerische Informationsdateien, die Ihr Webbrowser automatisch auf der Festplatte Ihres Computers speichert, wenn Sie unsere Internetseite besuchen.
            </p>
            <p>
              Cookies beschädigen weder die Festplatte Ihres Rechners noch werden durch die Setzung von Cookies personenbezogene Daten an uns übermittelt.
            </p>
            <p>
              Wir setzen Cookies beispielsweise ein, um Sie als Nutzer identifizieren zu können, ohne dass Sie sich gesondert einloggen müssen. Die Verwendung führt nicht dazu, dass wir neue personenbezogene Daten über Sie als Onlinebesucher erhalten. Die meisten Internet-Browser akzeptieren Cookies automatisch. Sie können Ihren Browser jedoch so konfigurieren, dass keine Cookies auf Ihrem Computer gespeichert werden oder stets ein Hinweis erscheint, wenn Sie ein neues Cookie erhalten.
            </p>
            <p>
              Die Deaktivierung von Cookies kann dazu führen, dass Sie nicht alle Funktionen unserer Website nutzen können.
            </p>

            <h2>6. Webanalysedienste</h2>
            <p>
              Zum Zwecke der bedarfsgerechten Gestaltung und fortlaufenden Optimierung unserer Seiten nutzen wir Webanalyse-Dienste („Google-Analytics"). In diesem Zusammenhang werden pseudonymisierte Nutzungsprofile erstellt und Cookies (siehe Ziff. 5) verwendet. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website wie
            </p>
            <ul>
              <li>Browser-Typ/-Version;</li>
              <li>verwendetes Betriebssystem;</li>
              <li>Referrer-URL (die zuvor besuchte Seite);</li>
              <li>Hostname des zugreifenden Rechners (IP-Adressse);</li>
              <li>Uhrzeit der Serveranfrage</li>
            </ul>
            <p>
              werden an Server in die USA übertragen und dort gespeichert. Die Informationen werden verwendet, um die Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen zu Zwecken der Marktforschung und bedarfsgerechten Gestaltung dieser Internetseiten zu erbringen. Auch werden diese Informationen gegebenenfalls an Dritte übertragen, sofern dies gesetzlich vorgeschrieben ist oder soweit Dritte diese Daten im Auftrag verarbeiten.
            </p>
            <p>
              Es wird in keinem Fall die IP-Adresse mit anderen den Nutzer betreffenden Daten in Verbindung gebracht. Die IP-Adressen werden anonymisiert, so dass eine Zuordnung nicht möglich ist (IP-Masking).
            </p>
            <p>
              Der Nutzer kann die Installation der Cookies durch eine entsprechende Einstellung der Browser-Software verhindern (siehe Ziff. 5); wir weisen jedoch darauf hin, dass in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich genutzt werden können.
            </p>
            <p>
              Der Erstellung von Nutzungsprofilen kann der Nutzer jederzeit widersprechen. Für die Mitteilung des Widerspruchs können die unter Ziff. 8 genannten Kontaktdaten verwendet werden. Alternativ folgen Sie bitte den Anweisungen unter: <a href="http://tools.google.com/dlpage/gaoptout?hl=de" target="_blank" rel="noopener noreferrer">http://tools.google.com/dlpage/gaoptout?hl=de</a>.
            </p>

            <h2>7. Sicherheit</h2>
            <p>
              Wir bedienen uns geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
            </p>

            <h2>8. Auskunft, Berichtung, Korrektur und Löschung von Daten</h2>
            <p>
              Ihnen steht ein Auskunftsrecht bezüglich der über Sie gespeicherten personenbezogenen Daten und ein Recht auf Berichtigung unrichtiger Daten sowie deren Sperrung und Löschung zu. Für eine Auskunft über Ihre personenbezogenen Daten, zur Veranlassung einer Korrektur unrichtiger Daten oder deren Sperrung bzw. Löschung sowie für weitergehende Fragen über die Verwendung Ihrer personenbezogenen Daten kontaktieren Sie bitte:
            </p>
            <p className="terms-contact-info">
              SpacialDB UG, Chausseestr 105<br />
              10115 Berlin | Deutschland<br />
              <a href="mailto:info@getgeodb.com">info@getgeodb.com</a>
            </p>
            <p>
              Sie können Ihre Daten bzw. Ihr gesamtes Benutzerprofil jederzeit löschen. Dies kann durch Verwenden der entsprechenden Option in Ihrem Benutzerprofil geschehen. Wir weisen darauf hin, dass im Falle der Löschung Ihrer Daten eine Inanspruchnahme unserer Dienste nicht oder nicht in vollem Umfang möglich ist.
            </p>

            <h2>9. Aktualität der Datenschutzerklärung</h2>
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und datiert vom 13.11.2012. Sie kann jederzeit auf unserer getgeodb.com von Ihnen abgerufen und ausgedruckt werden.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TermsPage

export const Head = () => <title>Terms & Conditions - Decision Labs</title>
