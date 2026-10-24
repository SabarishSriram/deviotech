"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { applyPage, tracks } from "@/data/site"
import { submitApplication } from "@/lib/applications"
import { handlePayment } from "@/lib/payment"
import { trackIcons } from "@/lib/track-icons"
import { applicationSchema, type ApplicationInput } from "@/lib/validations/apply"

const MOTIVATION_MIN = 30

export function ApplyForm() {
  const router = useRouter()

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      college: "",
      github: "",
      linkedin: "",
      motivation: "",
      agreeToTerms: false,
    },
  })

  const motivation = useWatch({ control: form.control, name: "motivation" }) ?? ""
  const { isSubmitting, isSubmitSuccessful } = form.formState

  async function onSubmit(values: ApplicationInput) {
    try {
      const { applicationId } = await submitApplication(values)

      // Razorpay checkout will open here once integrated — see lib/payment.ts
      await handlePayment({
        applicationId,
        applicant: { fullName: values.fullName, email: values.email, phone: values.phone },
      })

      toast.success(applyPage.successToast)
      router.push("/apply/success")
    } catch (error) {
      console.error(error)
      toast.error(applyPage.errorToast)
      // Re-enable the form so the user can retry
      form.reset(values, { keepValues: true })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="sr-only">About you</legend>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (WhatsApp)</FormLabel>
                <FormControl>
                  <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College name</FormLabel>
                <FormControl>
                  <Input autoComplete="organization" placeholder="Where you study" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of study</FormLabel>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full" onBlur={field.onBlur} ref={field.ref}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {applyPage.yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub username</FormLabel>
                <FormControl>
                  <Input autoCapitalize="none" spellCheck={false} placeholder="octocat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  LinkedIn URL <span className="font-normal text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input type="url" inputMode="url" placeholder="https://linkedin.com/in/you" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <FormField
          control={form.control}
          name="track"
          render={({ field }) => (
            <FormItem className="gap-3">
              <FormLabel id="track-label">Track</FormLabel>
              <FormControl>
                <RadioGroup
                  aria-labelledby="track-label"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  className="grid gap-3 sm:grid-cols-3"
                >
                  {tracks.items.map((track) => {
                    const Icon = trackIcons[track.id]
                    const id = `track-${track.id}`
                    return (
                      <label
                        key={track.id}
                        htmlFor={id}
                        className="relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-data-[state=checked]:border-brand has-data-[state=checked]:bg-brand/5"
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="size-5 text-brand-text" aria-hidden="true" />
                          <RadioGroupItem id={id} value={track.id} />
                        </div>
                        <div>
                          <p className="font-medium">{track.name}</p>
                          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                            {track.stack.slice(0, 3).join(" · ")}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skillLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill level</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-1/2" onBlur={field.onBlur} ref={field.ref}>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {applyPage.skillOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to join?</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="What do you want to build, and what do you hope to get better at?"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription className="font-mono text-xs">
                {motivation.trim().length < MOTIVATION_MIN
                  ? `${MOTIVATION_MIN - motivation.trim().length} more characters needed`
                  : `${motivation.trim().length} characters`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="mt-0.5"
                  />
                </FormControl>
                <FormLabel className="leading-snug font-normal">
                  <span>
                    {applyPage.terms.prefix}{" "}
                    <Link
                      href={applyPage.terms.termsLink.href}
                      target="_blank"
                      className="underline underline-offset-4 hover:text-brand-text"
                    >
                      {applyPage.terms.termsLink.label}
                    </Link>{" "}
                    {applyPage.terms.joiner}{" "}
                    <Link
                      href={applyPage.terms.refundLink.href}
                      target="_blank"
                      className="underline underline-offset-4 hover:text-brand-text"
                    >
                      {applyPage.terms.refundLink.label}
                    </Link>
                  </span>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || isSubmitSuccessful}
          className="group h-12 w-full rounded-full text-base"
        >
          {isSubmitting || isSubmitSuccessful ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              {applyPage.submittingLabel}
            </>
          ) : (
            <>
              {applyPage.submitLabel}
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
