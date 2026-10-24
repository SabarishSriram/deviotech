import { certificates, type Certificate } from "@/data/certificates"

export function normalizeCertificateId(id: string) {
  return id.trim().toUpperCase()
}

export function findCertificate(id: string): Certificate | null {
  const normalized = normalizeCertificateId(id)
  return certificates.find((cert) => cert.id === normalized) ?? null
}
