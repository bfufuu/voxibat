'use client'

import { useState } from 'react'
import Link from 'next/link'

const QUESTIONS = [
  {
    id: 'outil',
    question: 'Comment créez-vous actuellement vos devis et factures ?',
    emoji: '🛠️',
    options: [
      { label: 'À la main sur papier', value: 'papier', score: 0 },
      { label: 'Word ou Excel', value: 'word', score: 5 },
      { label: 'Un logiciel de facturation classique', value: 'logiciel', score: 20 },
      { label: 'Un logiciel certifié Factur-X', value: 'facturx', score: 40 },
    ],
  },
  {
    id: 'connaissance',
    question: "Saviez-vous que la facturation électronique devient obligatoire au 1er septembre 2026 ?",
    emoji: '📋',
    options: [
      { label: "Non, première nouvelle", value: 'non', score: 0 },
      { label: "J'en ai vaguement entendu parler", value: 'vague', score: 5 },
      { label: 'Oui, je suis au courant', value: 'oui', score: 10 },
      { label: 'Oui, et je suis déjà en train de me mettre en conformité', value: 'prepare', score: 20 },
    ],
  },
  {
    id: 'mentions',
    question: 'Vos factures contiennent-elles toutes les mentions légales obligatoires ?',
    emoji: '📄',
    options: [
      { label: 'Je ne sais pas ce que ça inclut', value: 'sais_pas', score: 0 },
      { label: 'Probablement pas toutes', value: 'partiel', score: 5 },
      { label: 'SIRET, TVA, date d\'échéance, conditions de paiement — oui', value: 'oui', score: 20 },
    ],
  },
  {
    id: 'envoi',
    question: 'Comment transmettez-vous vos factures à vos clients ?',
    emoji: '📨',
    options: [
      { label: 'En main propre ou par courrier papier', value: 'papier', score: 0 },
      { label: 'Par email en PDF', value: 'email', score: 10 },
      { label: 'Via un portail numérique (Chorus Pro, etc.)', value: 'portail', score: 15 },
      { label: "Je n'envoie pas encore de factures", value: 'aucun', score: 0 },
    ],
  },
  {
    id: 'tva',
    question: 'Votre activité est-elle assujettie à la TVA ?',
    emoji: '💶',
    options: [
      { label: 'Oui, je collecte la TVA', value: 'oui', score: 10 },
      { label: 'Non, je suis en franchise de TVA (auto-entrepreneur)', value: 'non', score: 5 },
      { label: 'Je ne sais pas', value: 'sais_pas', score: 0 },
    ],
  },
]

type Answer = { questionId: string; score: number; value: string }

function getResult(totalScore: number, maxScore: number): {
  niveau: string
  couleur: string
  bg: string
  border: string
  titre: string
  message: string
  points: string[]
  urgence: string
} {
  const pct = (totalScore / maxScore) * 100

  if (pct < 30) {
    return {
      niveau: 'Non conforme',
      couleur: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      titre: '🔴 Situation critique',
      message: 'Votre activité n\'est pas du tout préparée à l\'obligation de septembre 2026. Sans action rapide, vous risquez des pénalités et le refus de vos factures par vos clients professionnels.',
      points: [
        'Vos factures actuelles ne seront pas acceptées après le 1er sept. 2026',
        'Vos clients (entreprises) seront obligés de refuser vos factures papier/Word',
        'Risque de retards de paiement et de litiges',
        'Amende possible en cas de non-conformité',
      ],
      urgence: 'Il vous reste moins de 3 mois pour vous mettre en conformité.',
    }
  } else if (pct < 65) {
    return {
      niveau: 'Partiellement conforme',
      couleur: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      titre: '🟠 Des lacunes importantes',
      message: 'Vous avez pris conscience de l\'enjeu, mais votre outil actuel ne génère pas encore le format Factur-X exigé par la loi. Vous avez le temps d\'agir mais il faut le faire maintenant.',
      points: [
        'Votre logiciel actuel ne produit probablement pas de Factur-X',
        'Les mentions légales sur vos factures sont peut-être incomplètes',
        'Vos clients professionnels vont vous demander la conformité',
        'La migration peut prendre du temps — commencez maintenant',
      ],
      urgence: 'Vous êtes dans la zone à risque — agissez dans les 4 semaines.',
    }
  } else {
    return {
      niveau: 'En bonne voie',
      couleur: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      titre: '🟢 Bonne base, à finaliser',
      message: 'Vous avez de bonnes pratiques et êtes conscient de l\'enjeu. Il reste à valider que votre outil génère bien le format Factur-X EN 16931 exigé par la réglementation française.',
      points: [
        'Vérifiez que votre logiciel est certifié Factur-X EN 16931',
        'Assurez-vous d\'avoir le SIRET et toutes les mentions légales',
        'Pensez à archiver vos factures électroniques 10 ans',
        'Préparez-vous à la réception obligatoire dès septembre 2026',
      ],
      urgence: 'Vous êtes sur la bonne voie — une vérification s\'impose.',
    }
  }
}

export default function DiagnosticPage() {
  const [step, setStep] = useState<'intro' | number | 'result'>('intro')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  const currentQuestion = typeof step === 'number' ? QUESTIONS[step] : null
  const progress = typeof step === 'number' ? ((step) / QUESTIONS.length) * 100 : step === 'result' ? 100 : 0

  function handleSelect(value: string) {
    setSelected(value)
  }

  function handleNext() {
    if (!selected || typeof step !== 'number') return
    const q = QUESTIONS[step]
    const option = q.options.find(o => o.value === selected)!
    const newAnswers = [...answers, { questionId: q.id, score: option.score, value: selected }]
    setAnswers(newAnswers)
    setSelected(null)

    if (step + 1 >= QUESTIONS.length) {
      setStep('result')
    } else {
      setStep(step + 1)
    }
  }

  const maxScore = QUESTIONS.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0)
  const totalScore = answers.reduce((acc, a) => acc + a.score, 0)
  const result = getResult(totalScore, maxScore)
  const pct = Math.round((totalScore / maxScore) * 100)

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">Déjà client →</Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full text-center">
            <div className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              ⚠️ Obligation légale — 1er septembre 2026
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Êtes-vous prêt pour la<br />
              <span className="text-blue-600">facturation électronique ?</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              À partir du 1er septembre 2026, toutes les entreprises françaises devront
              recevoir des factures au format électronique. En 2027, l'émission sera obligatoire.
            </p>
            <p className="text-gray-500 mb-10">
              Répondez à <strong>5 questions</strong> pour connaître votre niveau de conformité
              et savoir ce que vous devez faire avant la deadline.
            </p>
            <button
              onClick={() => setStep(0)}
              className="px-10 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              Démarrer le diagnostic gratuit →
            </button>
            <p className="text-xs text-gray-400 mt-4">2 minutes · Gratuit · Sans inscription</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">Déjà client →</Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Score */}
          <div className={`rounded-2xl border-2 ${result.border} ${result.bg} p-8 mb-6 text-center`}>
            <p className="text-sm font-medium text-gray-500 mb-2">Votre score de conformité</p>
            <div className={`text-7xl font-bold ${result.couleur} mb-2`}>{pct}%</div>
            <div className="w-full bg-white rounded-full h-3 mb-4">
              <div
                className={`h-3 rounded-full transition-all ${pct < 30 ? 'bg-red-500' : pct < 65 ? 'bg-orange-400' : 'bg-green-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{result.titre}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{result.message}</p>
          </div>

          {/* Points d'attention */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">📋 Points à corriger</h3>
            <ul className="space-y-3">
              {result.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Urgence */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-yellow-800 font-medium text-sm">⏰ {result.urgence}</p>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 text-white rounded-2xl p-8 text-center">
            <p className="text-blue-200 text-sm font-medium mb-2">LA SOLUTION</p>
            <h3 className="text-2xl font-bold mb-3">Voxibat génère des factures Factur-X conformes EN 16931</h3>
            <p className="text-blue-100 text-sm mb-6">
              Chaque facture que vous créez est automatiquement au bon format.
              Téléchargez le XML Factur-X en un clic — zéro effort de votre côté.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Essayer gratuitement 14 jours →
              </Link>
            </div>
            <p className="text-blue-300 text-xs mt-4">Sans CB · Sans engagement · Annulable à tout moment</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { icon: '✅', titre: 'Conforme EN 16931', desc: 'Norme européenne exigée par la loi française' },
              { icon: '⚡', titre: 'Devis en 10 min', desc: 'L\'IA génère les lignes à partir de votre description' },
              { icon: '📧', titre: 'Relances auto', desc: '3 niveaux d\'emails si votre client ne paye pas' },
            ].map(f => (
              <div key={f.titre} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{f.titre}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            <button onClick={() => { setStep('intro'); setAnswers([]); setSelected(null) }} className="hover:underline">
              Recommencer le diagnostic
            </button>
          </p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">Voxibat</Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">Déjà client →</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Question {(step as number) + 1} sur {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 shadow-inner">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-4xl mb-4">{currentQuestion.emoji}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  selected === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {(step as number) > 0 ? (
              <button
                onClick={() => {
                  const newAnswers = answers.slice(0, -1)
                  setAnswers(newAnswers)
                  setStep((step as number) - 1)
                  setSelected(null)
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Précédent
              </button>
            ) : <div />}
            <button
              onClick={handleNext}
              disabled={!selected}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {(step as number) + 1 === QUESTIONS.length ? 'Voir mon résultat →' : 'Suivant →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
