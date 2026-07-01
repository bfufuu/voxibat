import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales | Voxibat',
  description: 'Mentions légales de Voxibat — logiciel de devis et facturation pour artisans BTP.',
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">← Retour à l'accueil</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Éditeur du site</h2>
            <p>Le site <strong>voxibat.fr</strong> est édité par :</p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg space-y-1">
              <p><strong>Benjamin Furrer</strong></p>
              <p>Auto-entrepreneur</p>
              <p>SIRET : <em>[À compléter après création de l'auto-entreprise]</em></p>
              <p>Email : contact@voxibat.fr</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Hébergement</h2>
            <div className="p-4 bg-gray-50 rounded-lg space-y-1">
              <p><strong>Vercel Inc.</strong></p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              <p>Site : <a href="https://vercel.com" className="text-blue-600 hover:underline">vercel.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site Voxibat (textes, images, graphismes, logo, icônes, logiciels) est la propriété exclusive de Benjamin Furrer et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Benjamin Furrer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Limitation de responsabilité</h2>
            <p>
              Voxibat s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, Voxibat ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
            </p>
            <p className="mt-2">
              Voxibat décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Contact</h2>
            <p>
              Pour toute question relative au site ou aux présentes mentions légales, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@voxibat.fr" className="text-blue-600 hover:underline">contact@voxibat.fr</a>
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
