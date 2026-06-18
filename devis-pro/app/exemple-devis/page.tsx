import Link from 'next/link'
import type { Metadata } from 'next'
import PrintButton from '@/components/PrintButton'

export const metadata: Metadata = {
  title: 'Exemple de devis BTP généré par IA | Quotio',
  description: 'Découvrez un exemple de devis professionnel généré par l\'IA Quotio en moins de 10 minutes. Conforme Factur-X 2026.',
}

const DEVIS_EXEMPLE = {
  artisan: {
    company: 'Plomberie Martin & Fils',
    siret: '452 891 234 00027',
    address: '14 rue des Artisans, 69003 Lyon',
    phone: '06 12 34 56 78',
    email: 'contact@plomberie-martin.fr',
  },
  client: {
    name: 'M. et Mme Dupont',
    address: '8 allée des Roses, 69006 Lyon',
    phone: '06 98 76 54 32',
  },
  devis: {
    numero: 'DEV-0042',
    date: '12 juin 2026',
    validite: '11 août 2026',
    titre: 'Rénovation salle de bain complète',
  },
  lignes: [
    { designation: 'Dépose ancienne baignoire fonte et robinetterie', unite: 'forfait', quantite: 1, prixUnitaire: 180, totalHT: 180 },
    { designation: 'Évacuation et mise en déchetterie', unite: 'forfait', quantite: 1, prixUnitaire: 120, totalHT: 120 },
    { designation: 'Receveur de douche 90×90 cm extra-plat', unite: 'unité', quantite: 1, prixUnitaire: 340, totalHT: 340 },
    { designation: 'Paroi de douche pivotante 90 cm', unite: 'unité', quantite: 1, prixUnitaire: 285, totalHT: 285 },
    { designation: 'Mitigeur thermostatique douche', unite: 'unité', quantite: 1, prixUnitaire: 195, totalHT: 195 },
    { designation: 'Lavabo suspendu + robinet mélangeur', unite: 'unité', quantite: 1, prixUnitaire: 220, totalHT: 220 },
    { designation: 'WC suspendu avec bâti-support Geberit', unite: 'unité', quantite: 1, prixUnitaire: 480, totalHT: 480 },
    { designation: 'Alimentation eau chaude/froide cuivre', unite: 'ml', quantite: 8, prixUnitaire: 22, totalHT: 176 },
    { designation: 'Main d\'œuvre installation et raccordement', unite: 'heure', quantite: 14, prixUnitaire: 58, totalHT: 812 },
    { designation: 'Fournitures et consommables (joints, colle, etc.)', unite: 'forfait', quantite: 1, prixUnitaire: 85, totalHT: 85 },
  ],
  tva: 10,
}

export default function ExempleDevisPage() {
  const totalHT = DEVIS_EXEMPLE.lignes.reduce((acc, l) => acc + l.totalHT, 0)
  const montantTVA = totalHT * DEVIS_EXEMPLE.tva / 100
  const totalTTC = totalHT + montantTVA

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Quotio</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">Exemple de devis généré par l'IA</span>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
              Créer le mien →
            </Link>
          </div>
        </div>
      </nav>

      {/* Bandeau "généré par IA" */}
      <div className="bg-blue-600 text-white py-3 px-4 text-center text-sm print:hidden">
        ⚡ Ce devis a été généré par l'IA Quotio en <strong>47 secondes</strong> à partir d'une description vocale —{' '}
        <Link href="/register" className="underline font-medium hover:text-blue-200">
          Essayez gratuitement 14 jours →
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Exemple de devis</h1>
            <p className="text-sm text-gray-500">Rénovation salle de bain — généré par l'IA en 47 secondes</p>
          </div>
          <div className="flex gap-3">
            <PrintButton />
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Créer mon compte →
            </Link>
          </div>
        </div>

        {/* Document devis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none print:p-0">

          {/* En-tête */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {DEVIS_EXEMPLE.artisan.company}
              </h2>
              <p className="text-sm text-gray-500">SIRET : {DEVIS_EXEMPLE.artisan.siret}</p>
              <p className="text-sm text-gray-500">{DEVIS_EXEMPLE.artisan.address}</p>
              <p className="text-sm text-gray-500">{DEVIS_EXEMPLE.artisan.phone}</p>
              <p className="text-sm text-gray-500">{DEVIS_EXEMPLE.artisan.email}</p>
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-bold text-gray-900 mb-1">DEVIS</h3>
              <p className="font-semibold text-blue-600 text-lg">{DEVIS_EXEMPLE.devis.numero}</p>
              <p className="text-sm text-gray-500 mt-1">Établi le {DEVIS_EXEMPLE.devis.date}</p>
              <p className="text-sm text-gray-500">Valable jusqu'au {DEVIS_EXEMPLE.devis.validite}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                En attente de validation
              </span>
            </div>
          </div>

          {/* Objet */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Objet</p>
            <p className="font-semibold text-gray-900">{DEVIS_EXEMPLE.devis.titre}</p>
          </div>

          {/* Client */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Devis établi pour</p>
            <p className="font-semibold text-gray-900">{DEVIS_EXEMPLE.client.name}</p>
            <p className="text-sm text-gray-600">{DEVIS_EXEMPLE.client.address}</p>
            <p className="text-sm text-gray-600">{DEVIS_EXEMPLE.client.phone}</p>
          </div>

          {/* Lignes */}
          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-4 py-3 text-left font-medium rounded-tl-lg">Désignation</th>
                <th className="px-4 py-3 text-center font-medium w-20">Unité</th>
                <th className="px-4 py-3 text-right font-medium w-16">Qté</th>
                <th className="px-4 py-3 text-right font-medium w-28">Prix unit. HT</th>
                <th className="px-4 py-3 text-right font-medium w-28 rounded-tr-lg">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {DEVIS_EXEMPLE.lignes.map((ligne, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-900">{ligne.designation}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{ligne.unite}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{ligne.quantite}</td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {ligne.prixUnitaire.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {ligne.totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totaux */}
          <div className="flex justify-end mb-10">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total HT</span>
                <span className="font-medium">
                  {totalHT.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA ({DEVIS_EXEMPLE.tva}% — taux réduit travaux)</span>
                <span className="font-medium">
                  {montantTVA.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-gray-200 pt-3 mt-1">
                <span>Total TTC</span>
                <span className="text-blue-600">
                  {totalTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-6">Bon pour accord — Date et signature du client</p>
              <div className="border-t border-dashed border-gray-200 pt-4">
                <p className="text-xs text-gray-300">Signature précédée de la mention "Bon pour accord"</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-400 mb-6">Cachet et signature de l'entreprise</p>
              <div className="border-t border-dashed border-gray-200 pt-4">
                <p className="text-xs font-medium text-gray-500">{DEVIS_EXEMPLE.artisan.company}</p>
              </div>
            </div>
          </div>

          {/* Mentions légales */}
          <div className="pt-6 border-t border-gray-200 text-xs text-gray-400 space-y-1">
            <p>Ce devis est valable 60 jours à compter de sa date d'émission.</p>
            <p>TVA à 10% applicable aux travaux de rénovation de logements de plus de 2 ans (Art. 279-0 bis du CGI).</p>
            <p>En cas d'acceptation, un acompte de 30% sera demandé au démarrage des travaux.</p>
            <p className="mt-2">SIRET : {DEVIS_EXEMPLE.artisan.siret}</p>
          </div>
        </div>

        {/* CTA bas de page */}
        <div className="mt-8 bg-blue-600 text-white rounded-2xl p-8 text-center print:hidden">
          <p className="text-blue-200 text-sm mb-2">Ce devis a été généré en 47 secondes</p>
          <h3 className="text-2xl font-bold mb-3">Générez vos propres devis avec l'IA</h3>
          <p className="text-blue-100 mb-6 text-sm max-w-lg mx-auto">
            Décrivez votre chantier à voix haute. L'IA génère toutes les lignes avec vos prix.
            Factures conformes Factur-X 2026 incluses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Essai gratuit 14 jours — sans CB →
            </Link>
            <Link
              href="/diagnostic"
              className="px-8 py-3 border border-blue-400 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tester ma conformité 2026
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
