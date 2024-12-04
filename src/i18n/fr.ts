export default {
  welcome: {
    title: 'Raccourcissez vos liens en quelques clics ! 🚀',
    subtitle: 'Collez votre URL longue ci-dessous et obtenez instantanément un lien court et facile à partager.'
  },
  form: {
    url: {
      placeholder: 'Collez votre URL ici'
    },
    customPath: {
      label: 'Personnalisez votre lien (optionnel) :',
      placeholder: 'Ex: mon-super-lien',
      help: 'Votre lien personnalisé apparaîtra comme : lnkqr.co/votre-texte'
    },
    expiration: {
      label: 'Durée de validité du lien (optionnel) :',
      help: 'Le lien expirera automatiquement après la durée choisie',
      options: {
        none: 'Pas d\'expiration',
        '1h': '1 heure',
        '2h': '2 heures',
        '4h': '4 heures',
        '8h': '8 heures',
        '24h': '24 heures',
        '1w': '1 semaine'
      }
    },
    button: {
      shortening: 'Création en cours...',
      shorten: 'Créer le lien court'
    }
  },
  errors: {
    default: 'Impossible de raccourcir l\'URL. Veuillez réessayer.',
    customPathTaken: 'Ce lien personnalisé est déjà utilisé',
    invalidUrl: 'Veuillez entrer une URL valide',
    missingUrl: 'Oops ! N\'oubliez pas d\'entrer une URL'
  },
  resultCard: {
    title: 'URL raccourcie',
    copy: 'Copier',
    copied: 'Copié !'
  },
  qrCode: {
    title: 'Générateur de QR Code',
    color: {
      label: 'Couleur du QR',
      background: 'Couleur de fond'
    },
    download: 'Télécharger le QR Code'
  },
  redirect: {
    loading: 'Redirection en cours...',
    error: {
      title: 'Oops !',
      expired: 'Ce lien a expiré',
      notFound: 'Ce lien n\'existe pas',
      default: 'Une erreur est survenue',
      backHome: 'Retour à l\'accueil'
    }
  },
  statistics: {
    title: 'Statistiques du lien',
    originalUrl: 'URL d\'origine',
    shortUrl: 'Lien court',
    clicks: 'Nombre de clics',
    createdAt: 'Créé le',
    expiresAt: 'Expire le',
    expired: 'Expiré',
    active: 'Actif',
    qrCode: 'Code QR',
    downloadQr: 'Télécharger le QR code',
    error: {
      notFound: 'Aucun lien trouvé avec ce chemin personnalisé',
      backHome: 'Créer un nouveau lien'
    }
  },
  notFound: {
    title: 'Page non trouvée',
    description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    backHome: 'Retour à l\'accueil'
  },
  app: {
    lastUpdate: 'Dernière mise à jour : {date}'
  }
}
