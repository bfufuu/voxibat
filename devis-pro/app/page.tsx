import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

const FEATURES = [
  {
    icon: '🎙️',
    titre: 'Dictée vocale',
    desc: 'Décrivez votre chantier à voix haute depuis le camion. Le devis est prêt à votre arrivée. Aucun concurrent ne propose ça.',
    badge: null,
  },
  {
    icon: '🤖',
    titre: 'IA sur mesure',
    desc: 'L\'IA connaît vos prix. Elle utilise votre catalogue de tarifs personnalisé en priorité, pas des prix génériques.',
    badge: null,
  },
  {
    icon: '📄',
    titre: 'Factur-X EN 16931',
    desc: 'Chaque facture génère automatiquement le XML conforme à la loi française. Zéro effort de votre côté.',
    badge: 'Obligatoire sept. 2026',
  },
  {
    icon: '📧',
    titre: 'Relances automatiques',
    desc: '3 niveaux d\'escalade : courtois → ferme → mise en demeure. Vous n\'avez plus à vous battre pour être payé.',
    badge: null,
  },
  {
    icon: '💰',
    titre: 'Catalogue de tarifs',
    desc: 'Renseignez vos prix une fois. L\'IA les utilise dans chaque devis. Vos marges, pas celles du marché.',
    badge: null,
  },
  {
    icon: '🧾',
    titre: 'Devis → Facture en 1 clic',
    desc: 'Le devis est accepté ? La facture est créée instantanément, numérotée, prête à envoyer.',
    badge: null,
  },
]

const COMPARAISON = [
  { critere: 'Génération IA', word: '❌', devisia: '✅', nous: '✅' },
  { critere: 'Commande vocale', word: '❌', devisia: '❌', nous: '✅' },
  { critere: 'Export Factur-X 2026', word: '❌', devisia: '❌', nous: '✅' },
  { critere: 'Relances automatiques', word: '❌', devisia: '❌', nous: '✅' },
  { critere: 'Catalogue tarifs perso', word: '❌', devisia: '❌', nous: '✅' },
  { critere: 'Devis → Facture 1 clic', word: '❌', devisia: '✅', nous: '✅' },
  { critere: 'PDF professionnel', word: '✅', devisia: '✅', nous: '✅' },
  { critere: 'Conformité légale 2026', word: '❌', devisia: '❌', nous: '✅' },
]

const ETAPES = [
  { num: '01', titre: 'Décrivez le chantier', desc: 'À voix haute ou par écrit. "Réfection salle de bain 8m², dépose carrelage, pose nouveau carrelage, joints".' },
  { num: '02', titre: 'L\'IA génère le devis', desc: 'Toutes les lignes apparaissent avec vos prix. Vérifiez, ajustez si besoin, c\'est prêt en 2 minutes.' },
  { num: '03', titre: 'Envoyez et encaissez', desc: 'PDF professionnel, facture Factur-X en 1 clic, relances automatiques si le client tarde à payer.' },
]

const FAQ = [
  {
    q: 'Est-ce vraiment conforme à l\'obligation de 2026 ?',
    r: 'Oui. Chaque facture générée inclut un fichier XML Factur-X au format EN 16931, la norme imposée par la loi française pour la réception obligatoire au 1er septembre 2026.',
  },
  {
    q: 'Je ne suis pas à l\'aise avec la technologie, c\'est pour moi ?',
    r: 'C\'est fait pour vous. Si vous savez envoyer un email, vous savez utiliser Voxibat. La moyenne d\'âge de nos utilisateurs est 47 ans.',
  },
  {
    q: 'Mes anciens devis Word/Excel, je peux les importer ?',
    r: 'Vous pouvez créer votre catalogue de tarifs en quelques minutes et l\'IA les utilisera immédiatement. L\'import d\'anciens fichiers arrive en V2.',
  },
  {
    q: 'Est-ce que ça marche pour tous les corps de métier ?',
    r: 'Oui : plomberie, électricité, peinture, maçonnerie, menuiserie, carrelage, chauffage, isolation, et plus. L\'IA s\'adapte à votre secteur.',
  },
  {
    q: 'Que se passe-t-il après les 14 jours d\'essai ?',
    r: '49€/mois sans engagement. Résiliable à tout moment en un clic. Aucun frais caché.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    r: 'Vos données sont stockées en France, chiffrées, et n\'appartiennent qu\'à vous. Elles ne sont jamais partagées ni revendues.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navigation — fond sombre sur le hero */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold text-white">Voxibat</h1>
            <div className="hidden md:flex gap-6 text-sm text-gray-300">
              <a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a>
              <a href="#comparaison" className="hover:text-white transition-colors">Comparaison</a>
              <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white text-sm transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 text-sm font-medium transition-colors">
              Essai gratuit →
            </Link>
          </div>
        </div>
      </nav>

      {/* Bandeau urgence 2026 */}
      <div className="bg-red-600 text-white text-center py-2.5 text-sm font-medium">
        ⚠️ Facturation électronique obligatoire au <strong>1er septembre 2026</strong> —{' '}
        <Link href="/diagnostic" className="underline hover:text-red-200">
          Testez votre conformité gratuitement →
        </Link>
      </div>

      {/* Hero — fond sombre avec blobs animés */}
      <section className="relative bg-gray-950 pt-24 pb-28 px-4 overflow-hidden">

        {/* Blobs animés */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000" />

        {/* Grille décorative subtile */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/10">
            <span>✅</span> Conforme Factur-X EN 16931 — Obligatoire 2026
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Vos devis BTP en <span className="text-blue-400">10 minutes</span>,<br />
            vos factures <span className="text-blue-400">conformes 2026</span>
          </h2>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Dictez votre chantier à voix haute. L'IA génère le devis complet avec vos prix.
            Factures Factur-X automatiques. Relances clients sans effort.
          </p>
          <p className="text-sm text-gray-500 mb-10">
            La seule solution BTP avec voix + IA + conformité légale 2026 intégrée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register" className="px-10 py-4 bg-blue-500 text-white text-lg font-bold rounded-xl hover:bg-blue-400 transition-colors shadow-lg shadow-blue-900/40">
              Essayer gratuitement 14 jours
            </Link>
            <Link href="/exemple-devis" className="px-10 py-4 bg-white/10 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              👀 Voir un exemple de devis
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="text-gray-400">✅ Sans carte bancaire</span>
            <span className="text-gray-400">✅ Sans engagement</span>
            <span className="text-gray-400">✅ 14 jours gratuits</span>
            <span className="text-gray-400">✅ Conforme Factur-X 2026</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '10 min', label: 'pour un devis complet' },
            { val: '2h', label: 'économisées par semaine' },
            { val: '100%', label: 'conforme Factur-X 2026' },
            { val: '49€', label: 'par mois tout compris' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-600 mb-1">{s.val}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Comment ça marche</h3>
            <p className="text-gray-500">De la description orale au devis envoyé — en 3 étapes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ETAPES.map(e => (
              <div key={e.num} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                <div className="text-5xl font-black text-blue-100 mb-4">{e.num}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{e.titre}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/diagnostic" className="text-sm text-blue-600 hover:underline font-medium">
              Tester ma conformité 2026 →
            </Link>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Tout ce dont un artisan a besoin</h3>
            <p className="text-gray-500">Pas un logiciel générique — un outil pensé pour le BTP</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.titre} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all bg-white">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{f.icon}</span>
                  {f.badge && (
                    <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-1 rounded-full">
                      {f.badge}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{f.titre}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparaison */}
      <section id="comparaison" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Pourquoi Voxibat ?</h3>
            <p className="text-gray-500">La seule solution qui couvre la conformité légale 2026</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-gray-500 font-medium w-1/2">Fonctionnalité</th>
                  <th className="px-4 py-4 text-center text-gray-400 font-medium">Word/Excel</th>
                  <th className="px-4 py-4 text-center text-gray-400 font-medium">Autres logiciels</th>
                  <th className="px-4 py-4 text-center text-blue-600 font-bold bg-blue-50">Voxibat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {COMPARAISON.map((row, i) => (
                  <tr key={row.critere} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3 text-gray-700 font-medium">{row.critere}</td>
                    <td className="px-4 py-3 text-center text-lg">{row.word}</td>
                    <td className="px-4 py-3 text-center text-lg">{row.devisia}</td>
                    <td className="px-4 py-3 text-center text-lg bg-blue-50 font-bold">{row.nous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Comparaison basée sur les fonctionnalités publiquement disponibles des solutions concurrentes — juin 2026
          </p>
        </div>
      </section>

      {/* Bloc conformité 2026 */}
      <section className="py-20 px-4 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-3xl font-bold mb-4">Le 1er septembre 2026, vos factures Word seront refusées</h3>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            La facturation électronique devient obligatoire en France. Vos clients professionnels
            devront légalement rejeter tout document non conforme au format Factur-X.
            Voxibat génère ce format automatiquement sur chaque facture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnostic" className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors">
              Tester ma conformité gratuit →
            </Link>
            <Link href="/register" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
              Essai gratuit 14 jours
            </Link>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20 px-4 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Un seul tarif, tout compris</h3>
          <p className="text-gray-500 mb-12">Pas de formule basique qui cache les fonctionnalités importantes</p>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-10 shadow-xl">
            <div className="text-6xl font-black mb-2">49€</div>
            <div className="text-blue-200 mb-8">par mois · sans engagement</div>
            <ul className="text-left space-y-3 mb-10">
              {[
                'Devis illimités par IA',
                'Dictée vocale',
                'Catalogue de tarifs personnalisé',
                'Factures illimitées',
                'Export Factur-X EN 16931',
                'Relances automatiques 3 niveaux',
                'Gestion clients illimitée',
                'PDF professionnels',
                'Support inclus',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="text-green-300 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg">
              Commencer l'essai gratuit 14 jours →
            </Link>
            <p className="text-blue-300 text-xs mt-4">Sans carte bancaire · Résiliable à tout moment</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Questions fréquentes</h3>
          <div className="space-y-4">
            {FAQ.map(item => (
              <div key={item.q} className="bg-white rounded-xl p-6 border border-gray-100">
                <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">Prêt à gagner 2h par semaine ?</h3>
          <p className="text-blue-200 text-lg mb-10">
            Rejoignez les artisans qui ont arrêté de passer leurs soirées sur Excel.
          </p>
          <Link href="/register" className="inline-block px-12 py-5 bg-white text-blue-600 text-xl font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-xl">
            Essai gratuit 14 jours — sans CB →
          </Link>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-300">
            <span>✓ Conforme Factur-X 2026</span>
            <span>✓ Commande vocale</span>
            <span>✓ Relances automatiques</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-white font-bold text-lg mb-1">Voxibat</p>
            <p className="text-sm">Devis et facturation pour artisans BTP · Conforme 2026</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/exemple-devis" className="hover:text-white transition-colors">Exemple de devis</Link>
            <Link href="/diagnostic" className="hover:text-white transition-colors">Diagnostic 2026</Link>
            <Link href="/plombier" className="hover:text-white transition-colors">Plombiers</Link>
            <Link href="/electricien" className="hover:text-white transition-colors">Électriciens</Link>
            <Link href="/peintre" className="hover:text-white transition-colors">Peintres</Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-gray-800 flex flex-wrap justify-center gap-6 text-xs">
          <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          <Link href="/cgu" className="hover:text-white transition-colors">CGU</Link>
          <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
          <Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          <span>© 2026 Voxibat — Benjamin Furrer</span>
        </div>
      </footer>
    </div>
  )
}
