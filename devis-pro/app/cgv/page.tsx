import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | Voxibat',
  description: 'CGV de Voxibat — conditions générales de vente de l\'abonnement au logiciel de devis BTP.',
}

export default function CgvPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Retour à l'accueil</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions Générales de Vente</h1>
        <p className="text-gray-500 mb-8">En vigueur à compter de juin 2026</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Vendeur</h2>
            <div className="p-4 bg-gray-50 rounded-lg space-y-1">
              <p><strong>Benjamin Furrer</strong> — Auto-entrepreneur</p>
              <p>SIRET : <em>[À compléter]</em></p>
              <p>Email : <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Produit vendu</h2>
            <p>
              Voxibat propose un abonnement mensuel donnant accès au logiciel SaaS de création de devis et facturation pour artisans BTP, accessible sur <strong>voxibat.fr</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Prix</h2>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">49 € HT / mois</p>
              <p className="text-gray-600 text-xs mt-1">TVA non applicable — article 293 B du CGI (franchise en base de TVA)</p>
            </div>
            <p className="mt-3">
              Les prix sont susceptibles d'être modifiés. Toute modification de prix sera notifiée à l'utilisateur par email avec un préavis d'au moins 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Essai gratuit</h2>
            <p>
              Un essai gratuit de <strong>14 jours</strong> est proposé à tout nouvel utilisateur, sans carte bancaire requise. À l'issue de cette période, l'accès aux fonctionnalités est suspendu jusqu'à souscription d'un abonnement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Paiement</h2>
            <p>
              Le paiement est effectué par carte bancaire via <strong>Stripe</strong> (plateforme sécurisée PCI-DSS). L'abonnement est prélevé mensuellement à la date anniversaire de souscription.
            </p>
            <p className="mt-2">
              En cas d'échec de paiement, l'accès au service peut être suspendu après une période de grâce de 7 jours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Résiliation</h2>
            <p>
              L'abonnement est <strong>sans engagement</strong> et peut être résilié à tout moment depuis l'espace abonnement ou par email à <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a>.
            </p>
            <p className="mt-2">
              La résiliation prend effet à la fin de la période mensuelle en cours. Aucun remboursement au prorata n'est effectué pour la période restante.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Droit de rétractation</h2>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux prestations de services pleinement exécutées avant la fin du délai de rétractation, avec l'accord exprès du consommateur.
            </p>
            <p className="mt-2">
              <strong>Pour les professionnels (B2B)</strong> : le droit de rétractation de 14 jours prévu par le Code de la consommation ne s'applique pas aux achats effectués dans le cadre de l'activité professionnelle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Facturation</h2>
            <p>
              Une facture est émise automatiquement par Stripe à chaque prélèvement mensuel et envoyée à l'adresse email du compte. Ces factures sont disponibles dans votre espace Stripe (portail client).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Litiges</h2>
            <p>
              En cas de litige, l'utilisateur peut contacter Voxibat à <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a>. En l'absence de résolution amiable, le litige sera soumis aux tribunaux français compétents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Droit applicable</h2>
            <p>Les présentes CGV sont soumises au droit français.</p>
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
