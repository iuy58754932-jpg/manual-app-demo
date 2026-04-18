import QRCode from 'qrcode'

export interface QrOptions {
  size: number          // pixels
  margin?: number       // quiet zone (modules)
  darkColor?: string    // foreground
  lightColor?: string   // background
  errorLevel?: 'L' | 'M' | 'Q' | 'H'
}

/**
 * Generate a QR code as a PNG data URL.
 */
export async function generateQrDataUrl(
  text: string,
  options: QrOptions = { size: 400 },
): Promise<string> {
  if (!text.trim()) throw new Error('QR_EMPTY_TEXT')
  return QRCode.toDataURL(text, {
    width: options.size,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorLevel ?? 'M',
    color: {
      dark: options.darkColor ?? '#000000',
      light: options.lightColor ?? '#FFFFFF',
    },
  })
}
