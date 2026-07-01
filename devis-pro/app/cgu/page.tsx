import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation | Voxibat',
  description: 'CGU de Voxibat — conditions d\'utilisation du logiciel de devis et facturation pour artisans BTP.',
}

export default function CguPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Retour à l'accueil</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-500 mb-8">En vigueur à compter de juin 2026</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service Voxibat, logiciel SaaS de création de devis et facturation destiné aux artisans du bâtiment (BTP), édité par Benjamin Furrer, auto-entrepreneur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Accès au service</h2>
            <p>
              L'accès au service est réservé aux professionnels (artisans, entreprises du BTP). L'utilisateur doit être majeur et disposer de la capacité juridique pour s'engager contractuellement.
            </p>
            <p className="mt-2">
              Un essai gratuit de <strong>14 jours</strong> est proposé sans carte bancaire. À l'issue de l'essai, l'accès est conditionné à la souscription d'un abonnement payant.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Création de compte</h2>
            <p>L'utilisateur s'engage à :</p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start gap-2"><span className="text-blue-500">•</span> Fournir des informations exactes et complètes lors de l'inscription</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">•</span> Maintenir à jour ses informations (SIRET, adresse, email)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">•</span> Garder son mot de passe confidentiel</li>
              <li className="flex items-start gap-2"><span className="text-blue-500">•</span> Ne pas partager son compte avec des tiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Description du service</h2>
            <p>Voxibat propose les fonctionnalités suivantes :</p>
            <ul className="mt-2 space-y-1">
              {[
                'Génération de devis par intelligence artificielle (dictée vocale ou texte)',
                'Gestion des clients et du catalogue de tarifs personnalisé',
                'Conversion devis → facture en 1 clic',
                'Export au format Factur-X (norme EN 16931)',
                'Relances automatiques par email en cas de non-paiement',
                'Tableau de bord de suivi d\'activité',
              ].map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-blue-500">•</span> {f}</li>
              ))}
            </ul>
            <p className="mt-3 text-gray-500 text-xs">
              Voxibat est un outil d'aide à la création de documents. L'utilisateur reste seul responsable de la vérification et de la conformité légale de ses devis et factures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Intelligence artificielle</h2>
            <p>
              Voxibat utilise Claude (Anthropic) pour générer des suggestions de lignes de devis. Ces suggestions sont fournies à titre indicatif. L'utilisateur est seul responsable de vérifier l'exactitude des prix, quantités et désignations avant d'envoyer tout document à ses clients.
            </p>
            <p className="mt-2">
              Les descriptions de chantier dictées sont transmises à Anthropic pour traitement. Évitez d'y inclure des données personnelles sensibles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Obligations de l'utilisateur</h2>
            <p>L'utilisateur s'interdit notamment de :</p>
            <ul className="mt-2 space-y-2">
              {[
                'Utiliser le service à des fins illicites',
                'Tenter de contourner les mécanismes de sécurité',
                'Revendre ou sous-licencier l\'accès au service',
                'Introduire des virus ou codes malveillants',
                'Utiliser le service pour envoyer des communications non sollicitées (spam)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2"><span className="text-red-400">✗</span> {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Disponibilité du service</h2>
            <p>
              Voxibat s'efforce d'assurer une disponibilité du service 24h/24, 7j/7. Cependant, des interruptions peuvent survenir pour maintenance, mises à jour ou causes indépendantes de notre volonté.
            </p>
            <p className="mt-2">
              Voxibat ne saurait être tenu responsable des dommages résultant d'une interruption temporaire du service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Propriété des données</h2>
            <p>
              Les données que vous créez dans Voxibat (devis, factures, clients, tarifs) vous appartiennent. Voxibat n'utilise pas vos données commerciales à d'autres fins que la fourniture du service.
            </p>
            <p className="mt-2">
              Vous pouvez exporter ou supprimer vos données à tout moment en nous contactant à <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Limitation de responsabilité</h2>
            <p>
              Voxibat est un outil d'aide à la gestion administrative. En aucun cas, Voxibat ne saurait être tenu responsable des conséquences fiscales, juridiques ou commerciales découlant de l'utilisation des devis et factures générés par le service.
            </p>
            <p className="mt-2">
              La responsabilité de Voxibat est limitée au montant des sommes effectivement versées par l'utilisateur au cours des 3 derniers mois précédant le litige.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Modification des CGU</h2>
            <p>
              Voxibat se réserve le droit de modifier les présentes CGU à tout moment. L'utilisateur sera informé par email au moins 30 jours avant l'entrée en vigueur des modifications. La poursuite de l'utilisation du service vaut acceptation des nouvelles CGU.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Résiliation</h2>
            <p>
              L'utilisateur peut résilier son compte à tout moment depuis son espace abonnement ou en contactant <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a>.
            </p>
            <p className="mt-2">
              Voxibat se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution sera soumis à la compétence exclusive des tribunaux français.
            </p>
          </section>

          <p className="text-xs text-gray-400 border-t border-gray-100 pt-6">Dernière mise à jour : juin 2026</p>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
          <Link href="/cgu" className="hover:text-white">CGU</Link>
          <Link href="/cgv" className="hover:text-white">CGV</Link>
          <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
        </div>
      </footer>
    </div>
  )
}
