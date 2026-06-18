import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logiciel devis peintre — Factur-X 2026 | Voxibat',
  description: 'Créez vos devis de peinture en 10 minutes avec l\'IA. Facturation électronique conforme Factur-X 2026. Essai gratuit 14 jours.',
}

const EXEMPLES_DEVIS = [
  { travaux: 'Peinture salon 30m²', lignes: ['Protection sol et mobilier', 'Sous-couche — 2 couches', 'Peinture finition — 2 couches', 'Main d\'œuvre 2 jours'], prix: '980€ HT' },
  { travaux: 'Ravalement façade 80m²', lignes: ['Montage échafaudage', 'Nettoyage haute pression', 'Traitement fissures', 'Peinture façade 2 couches'], prix: '4 200€ HT' },
  { travaux: 'Rénovation chambre enfant', lignes: ['Rebouchage et ponçage', 'Peinture plafond blanc mat', 'Peinture murs couleur', 'Nettoyage chantier'], prix: '620€ HT' },
]

export default function PeintrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 text-sm">Connexion</Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Essai gratuit</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Logiciel de devis pour peintres
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Faites vos devis de peinture<br />
            <span className="text-blue-600">en 10 minutes avec l'IA</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Mesurez, dictez à voix haute, l'IA calcule tout. Surfaces, couches, main d'œuvre.
            Factures Factur-X pour la conformité obligatoire 2026.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
              Essayer gratuitement 14 jours
            </Link>
            <Link href="/diagnostic" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors border border-blue-200">
              Tester ma conformité 2026 →
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-3">Sans CB · Sans engagement</p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Exemples de devis générés pour un peintre
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXEMPLES_DEVIS.map(ex => (
              <div key={ex.travaux} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <p className="font-semibold text-gray-900 mb-4">{ex.travaux}</p>
                <ul className="space-y-2 mb-4">
                  {ex.lignes.map(l => (
                    <li key={l} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span> {l}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Total estimé</p>
                  <p className="text-xl font-bold text-blue-600">{ex.prix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: '🎙️', titre: 'Dictée vocale', desc: 'Décrivez la surface et le type de travaux. L\'IA calcule les quantités et les prix.' },
            { icon: '📄', titre: 'Factur-X conforme 2026', desc: 'Conformité légale automatique sur chaque facture. Zéro effort de votre côté.' },
            { icon: '💰', titre: 'Catalogue prix matériaux', desc: 'Vos prix de peinture, apprêts, enduits. L\'IA les utilise dans chaque devis.' },
            { icon: '📧', titre: 'Suivi et relances', desc: 'Devis accepté ou refusé, facture en retard — Voxibat gère tout automatiquement.' },
          ].map(f => (
            <div key={f.titre} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-4">
              <span className="text-3xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.titre}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Prêt à gagner 2h par semaine ?</h2>
          <p className="text-blue-200 mb-6">14 jours gratuits. Aucune carte bancaire requise.</p>
          <Link href="/register" className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg">
            Créer mon compte gratuit →
          </Link>
        </div>
      </main>
    </div>
  )
}
