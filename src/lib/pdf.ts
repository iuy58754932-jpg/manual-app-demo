import { jsPDF } from 'jspdf'
import { fabric } from 'fabric'

export type PaperSize = 'A4' | 'A3' | 'B4'

interface PaperDimensions {
  width: number  // mm
  height: number // mm
}

const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 },
  B4: { width: 250, height: 353 },
}

// Canvas pixel dimensions for rendering (A4 ratio)
const CANVAS_WIDTH = 595
const CANVAS_HEIGHT = 842

export async function generatePDF(
  pagesJson: string[],
  paperSize: PaperSize = 'A4',
): Promise<jsPDF> {
  const { width, height } = PAPER_SIZES[paperSize]
  const pdf = new jsPDF('p', 'mm', [width, height])

  for (let i = 0; i < pagesJson.length; i++) {
    if (i > 0) pdf.addPage()

    const canvas = new fabric.StaticCanvas(null, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    })

    const pageData = JSON.parse(pagesJson[i])
    // Fix Fabric.js v5 textbox styles bug
    if (pageData.objects) {
      pageData.objects.forEach((obj: Record<string, unknown>) => {
        if ((obj.type === 'textbox' || obj.type === 'i-text') && !obj.styles) {
          obj.styles = {}
        }
      })
    }
    await new Promise<void>((resolve) => {
      canvas.loadFromJSON(pageData, () => {
        canvas.renderAll()
        resolve()
      })
    })

    const dataUrl = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.92,
      multiplier: 2,
    })

    pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height)
    canvas.dispose()
  }

  return pdf
}

export function downloadPDF(pdf: jsPDF, filename: string) {
  pdf.save(`${filename}.pdf`)
}

export function printPDF(pdf: jsPDF) {
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
  iframe.onload = () => {
    iframe.contentWindow?.print()
    setTimeout(() => {
      document.body.removeChild(iframe)
      URL.revokeObjectURL(url)
    }, 1000)
  }
}
