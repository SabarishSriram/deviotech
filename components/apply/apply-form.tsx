"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { applyPage } from "@/data/site"
import { trackShortName, tracks, type TrackSlug } from "@/data/tracks"
import { submitApplication } from "@/lib/applications"
import { trackColorStyle, trackIcons } from "@/lib/track-icons"
import { cn } from "@/lib/utils"
import { applicationSchema, type ApplicationInput } from "@/lib/validations/apply"

const MOTIVATION_MIN = 30

/** Numbered group header — mirrors the step numbering used on the home page. */
function Group({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t pt-7 first:border-t-0 first:pt-0">
      <legend className="float-left mb-5 flex w-full items-center gap-2.5 label-mono text-muted-foreground">
        <span className="text-brand-text">{number}</span>
        {title}
      </legend>
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  )
}

export function ApplyForm({ initialTrack }: { initialTrack?: TrackSlug }) {
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
      track: initialTrack,
      motivation: "",
      agreeToTerms: false,
    },
  })

  const motivation = useWatch({ control: form.control, name: "motivation" }) ?? ""
  const { isSubmitting, isSubmitSuccessful } = form.formState

  async function onSubmit(values: ApplicationInput) {
    try {
      // Applying is free — payment happens later, after the 1:1 session (see lib/payment.ts)
      await submitApplication(values)

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
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-7">
        <Group number="01" title="About you">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="Your full name" className="h-11" {...field} />
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
                    <Input type="email" autoComplete="email" placeholder="you@example.com" className="h-11" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Your login credentials are sent here.</FormDescription>
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
                    <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" className="h-11" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">To schedule your 1:1 session.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College</FormLabel>
                  <FormControl>
                    <Input autoComplete="organization" placeholder="Where you study" className="h-11" {...field} />
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
                      <SelectTrigger className="h-11! w-full" onBlur={field.onBlur} ref={field.ref}>
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
                  <div className="flex h-11 items-center rounded-md border border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive dark:bg-input/30">
                    <span className="pl-3 font-mono text-xs text-muted-foreground" aria-hidden="true">
                      github.com/
                    </span>
                    <FormControl>
                      <input
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="octocat"
                        className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm outline-none placeholder:text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                  </div>
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
                    <Input type="url" inputMode="url" placeholder="https://linkedin.com/in/you" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Group>

        <Group number="02" title="Your track">
          <FormField
            control={form.control}
            name="track"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you want to build?</FormLabel>
                <FormControl>
                  <div role="radiogroup" aria-label="Track" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {tracks.map((track, index) => {
                      const Icon = trackIcons[track.slug]
                      const checked = field.value === track.slug
                      return (
                        <label
                          key={track.slug}
                          style={trackColorStyle(track.slug)}
                          className={cn(
                            "track-color group relative flex cursor-pointer items-center gap-2.5 rounded-2xl border p-2.5 transition-all duration-200 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                            checked
                              ? "border-(--tc)/60 bg-(--tc)/10 shadow-[0_8px_24px_-14px_var(--tc)]"
                              : "bg-background/40 hover:border-foreground/20"
                          )}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={track.slug}
                            checked={checked}
                            onChange={() => field.onChange(track.slug)}
                            onBlur={field.onBlur}
                            ref={index === 0 ? field.ref : undefined}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-xl border text-(--tc) transition-colors",
                              checked ? "border-(--tc)/50 bg-(--tc)/15" : "bg-muted/40"
                            )}
                          >
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 truncate text-sm font-medium">{trackShortName(track)}</span>
                          {checked && <Check className="ml-auto size-4 shrink-0 text-(--tc)" aria-hidden="true" />}
                        </label>
                      )
                    })}
                  </div>
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
                <FormLabel>Your skill level</FormLabel>
                <FormControl>
                  <div role="radiogroup" aria-label="Skill level" className="grid grid-cols-3 gap-1 rounded-2xl border bg-background/40 p-1">
                    {applyPage.skillOptions.map((option, index) => {
                      const checked = field.value === option.value
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "cursor-pointer rounded-xl px-3 py-2.5 text-center text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                            checked ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            checked={checked}
                            onChange={() => field.onChange(option.value)}
                            onBlur={field.onBlur}
                            ref={index === 0 ? field.ref : undefined}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      )
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Group>

        <Group number="03" title="Your goals">
          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why do you want to join?</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="What do you want to build, and what do you hope to get better at?"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex items-center justify-between font-mono text-xs">
                  <span>Your mentor reads this before your 1:1.</span>
                  <span className={cn(motivation.trim().length >= MOTIVATION_MIN && "text-brand-text")}>
                    {motivation.trim().length < MOTIVATION_MIN
                      ? `${MOTIVATION_MIN - motivation.trim().length} more to go`
                      : `${motivation.trim().length} ✓`}
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Group>

        <div className="space-y-5 border-t pt-7">
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
        </div>
      </form>
    </Form>
  )
}
