import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Voxibat',
  description: 'Politique de confidentialité et protection des données personnelles de Voxibat.',
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Retour à l'accueil</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-gray-500 mb-8">Conforme au Règlement Général sur la Protection des Données (RGPD)</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <div className="p-4 bg-gray-50 rounded-lg space-y-1">
              <p><strong>Voxibat</strong> — Auto-entrepreneur</p>
              <p>Email : <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-3">Voxibat collecte les données suivantes :</p>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">Données de compte</p>
                <p className="text-gray-600 mt-1">Nom, adresse email, mot de passe hashé (jamais stocké en clair), SIRET, adresse professionnelle, téléphone.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">Données d'activité</p>
                <p className="text-gray-600 mt-1">Devis, factures, clients, catalogue de tarifs que vous créez dans l'application.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">Données de paiement</p>
                <p className="text-gray-600 mt-1">Gérées exclusivement par Stripe. Voxibat ne stocke jamais vos coordonnées bancaires.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">Données techniques</p>
                <p className="text-gray-600 mt-1">Adresse IP, type de navigateur, pages consultées (via cookies analytics si acceptés).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="space-y-2">
              {[
                'Fournir le service de création de devis et facturation',
                'Gérer votre compte et votre abonnement',
                'Envoyer les emails de relance à vos clients (en votre nom)',
                'Améliorer le service et corriger les bugs',
                'Respecter nos obligations légales (comptabilité, fiscalité)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Base légale</h2>
            <ul className="space-y-2">
              <li><strong>Exécution du contrat</strong> — pour fournir le service souscrit</li>
              <li><strong>Intérêt légitime</strong> — pour améliorer le service et prévenir les fraudes</li>
              <li><strong>Obligation légale</strong> — pour les données comptables et fiscales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Durée de conservation</h2>
            <ul className="space-y-2">
              <li><strong>Données de compte actif</strong> — durée de l'abonnement</li>
              <li><strong>Données de compte résilié</strong> — 3 ans après résiliation (obligation légale)</li>
              <li><strong>Factures</strong> — 10 ans (obligation fiscale française)</li>
              <li><strong>Données techniques</strong> — 13 mois maximum</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Partage des données</h2>
            <p className="mb-3">Vos données ne sont jamais vendues. Elles sont partagées uniquement avec :</p>
            <ul className="space-y-2">
              <li><strong>Supabase</strong> (hébergement base de données) — serveurs en Union Européenne</li>
              <li><strong>Stripe</strong> (paiement) — certifié PCI-DSS</li>
              <li><strong>Anthropic</strong> (IA Claude) — uniquement la description de chantier que vous dictez</li>
              <li><strong>Vercel</strong> (hébergement) — serveurs aux USA, couvert par les clauses contractuelles types de la CE</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Vos droits (RGPD)</h2>
            <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="space-y-2">
              {[
                'Droit d\'accès à vos données',
                'Droit de rectification',
                'Droit à l\'effacement ("droit à l\'oubli")',
                'Droit à la portabilité de vos données',
                'Droit d\'opposition au traitement',
                'Droit de limitation du traitement',
              ].map(droit => (
                <li key={droit} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span> {droit}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous : <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a>. Réponse sous 30 jours.
            </p>
            <p className="mt-2">
              En cas de litige, vous pouvez saisir la <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Cookies</h2>
            <p>
              Voxibat utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session de connexion). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Sécurité</h2>
            <p>
              Nous mettons en œuvre les mesures techniques appropriées : chiffrement des mots de passe (bcrypt), connexions HTTPS, cookies httpOnly, accès aux données restreint par utilisateur.
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
