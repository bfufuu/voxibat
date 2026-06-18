import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

type RelanceEmailParams = {
  to: string
  clientName: string
  artisanName: string
  artisanEmail: string
  artisanPhone?: string
  factureNumero: string
  montantTTC: number
  dateEcheance: Date
  joursRetard: number
  numeroRelance: number
}

export function getRelanceEmailHTML(params: RelanceEmailParams): string {
  const {
    clientName, artisanName, artisanEmail, artisanPhone,
    factureNumero, montantTTC, dateEcheance, joursRetard, numeroRelance
  } = params

  const montantFormate = montantTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  const dateFormatee = new Date(dateEcheance).toLocaleDateString('fr-FR')

  const niveauUrgence = numeroRelance === 1
    ? { couleur: '#f59e0b', titre: 'Rappel de paiement', ton: 'courtois' }
    : numeroRelance === 2
    ? { couleur: '#ef4444', titre: '2ème relance — Facture impayée', ton: 'ferme' }
    : { couleur: '#7f1d1d', titre: 'MISE EN DEMEURE', ton: 'formel' }

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <div style="background:${niveauUrgence.couleur};padding:24px 32px;">
      <h1 style="color:white;margin:0;font-size:20px;">${niveauUrgence.titre}</h1>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Facture ${factureNumero}</p>
    </div>

    <div style="padding:32px;">
      <p style="color:#374151;font-size:16px;">Bonjour ${clientName},</p>

      ${numeroRelance === 1 ? `
      <p style="color:#6b7280;">Sauf erreur de notre part, nous n'avons pas encore reçu le règlement de la facture suivante :</p>
      ` : numeroRelance === 2 ? `
      <p style="color:#6b7280;">Malgré notre premier rappel, la facture suivante reste impayée. Nous vous invitons à régulariser cette situation dans les meilleurs délais.</p>
      ` : `
      <p style="color:#6b7280;">Après deux relances restées sans suite, nous vous mettons en demeure de régler la facture suivante sous 8 jours, faute de quoi nous nous verrons contraints d'engager une procédure de recouvrement.</p>
      `}

      <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:24px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#6b7280;padding:4px 0;font-size:14px;">Numéro de facture</td>
            <td style="color:#111827;font-weight:bold;text-align:right;font-size:14px;">${factureNumero}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;padding:4px 0;font-size:14px;">Date d'échéance</td>
            <td style="color:#111827;text-align:right;font-size:14px;">${dateFormatee}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;padding:4px 0;font-size:14px;">Retard</td>
            <td style="color:#ef4444;font-weight:bold;text-align:right;font-size:14px;">${joursRetard} jours</td>
          </tr>
          <tr style="border-top:2px solid #e5e7eb;">
            <td style="color:#111827;font-weight:bold;padding:8px 0 0;font-size:16px;">Montant TTC</td>
            <td style="color:#2563eb;font-weight:bold;text-align:right;font-size:18px;padding-top:8px;">${montantFormate}</td>
          </tr>
        </table>
      </div>

      <p style="color:#6b7280;font-size:14px;">Pour tout règlement ou question, n'hésitez pas à nous contacter :</p>
      <p style="color:#374151;font-size:14px;">
        <strong>${artisanName}</strong><br>
        📧 ${artisanEmail}
        ${artisanPhone ? `<br>📞 ${artisanPhone}` : ''}
      </p>

      ${numeroRelance >= 3 ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-top:24px;">
        <p style="color:#991b1b;font-size:13px;margin:0;">
          <strong>Avertissement légal :</strong> En application de l'article L441-10 du Code de commerce, des pénalités de retard au taux de 3 fois le taux d'intérêt légal sont applicables, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.
        </p>
      </div>
      ` : ''}

      <p style="color:#9ca3af;font-size:12px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">
        Si vous avez déjà effectué ce règlement, veuillez ignorer ce message et nous en informer.
      </p>
    </div>
  </div>
</body>
</html>`
}

export function getRelanceEmailSubject(factureNumero: string, montantTTC: number, numeroRelance: number): string {
  const montant = montantTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  if (numeroRelance === 1) return `Rappel de paiement — Facture ${factureNumero} (${montant})`
  if (numeroRelance === 2) return `2ème relance — Facture ${factureNumero} impayée (${montant})`
  return `MISE EN DEMEURE — Facture ${factureNumero} (${montant})`
}
