export default {
  welcome: {
    title: 'Shorten your links in a few clicks! 🚀',
    subtitle: 'Paste your long URL below and instantly get a short, easy-to-share link.'
  },
  form: {
    url: {
      placeholder: 'Paste your URL here'
    },
    customPath: {
      label: 'Customize your link (optional):',
      placeholder: 'Ex: my-awesome-link',
      help: 'Your custom link will appear as: lnkqr.co/your-text'
    },
    expiration: {
      label: 'Link validity duration (optional):',
      help: 'The link will automatically expire after the chosen duration',
      options: {
        none: 'No expiration',
        '1h': '1 hour',
        '2h': '2 hours',
        '4h': '4 hours',
        '8h': '8 hours',
        '24h': '24 hours',
        '1w': '1 week'
      }
    },
    button: {
      shortening: 'Shortening...',
      shorten: 'Shorten URL'
    }
  },
  errors: {
    default: 'Failed to shorten URL. Please try again.',
    customPathTaken: 'This custom path is already taken',
    invalidUrl: 'Please enter a valid URL',
    missingUrl: 'Oops! Don\'t forget to enter a URL'
  },
  resultCard: {
    title: 'Shortened URL',
    copy: 'Copy',
    copied: 'Copied!'
  },
  qrCode: {
    title: 'QR Code Generator',
    color: {
      label: 'QR Color',
      background: 'Background Color'
    },
    download: 'Download QR Code'
  },
  redirect: {
    loading: 'Redirecting...',
    error: {
      title: 'Oops!',
      expired: 'This link has expired',
      notFound: 'This link does not exist',
      default: 'An error occurred',
      backHome: 'Back to Home'
    }
  },
  app: {
    lastUpdate: 'Last update: {date}'
  },
  statistics: {
    title: 'Link Statistics',
    originalUrl: 'Original URL',
    shortUrl: 'Short URL',
    clicks: 'Click Count',
    createdAt: 'Created On',
    expiresAt: 'Expires On',
    expired: 'Expired',
    active: 'Active',
    qrCode: 'QR Code',
    downloadQr: 'Download QR Code'
  }
}
