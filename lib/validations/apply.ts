import { z } from "zod"

/** Shared by the /apply form (client) and the /api/apply route (server). */
export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit WhatsApp number"),
  college: z.string().trim().min(2, "Enter your college name"),
  year: z.enum(["1", "2", "3", "4", "graduate"], { error: "Select your year of study" }),
  github: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/, "Enter a valid GitHub username (without the URL)"),
  linkedin: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.+/i.test(value),
      "Enter a valid LinkedIn URL"
    ),
  track: z.enum(["full-stack", "backend", "frontend"], { error: "Choose a track" }),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"], { error: "Select your skill level" }),
  motivation: z
    .string()
    .trim()
    .min(30, "Tell us a bit more — at least 30 characters")
    .max(1000, "Keep it under 1000 characters"),
  agreeToTerms: z.boolean().refine((value) => value, "You need to accept the terms to continue"),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
