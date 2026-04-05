import type { Home } from '@/payload-types'
import { HOME_DEFAULTS } from './homeDefaults'
import { HOME_SEED_DE } from './homeSeedDe'

const SHOP_HREF = '#roastery'

/** Deep-merge plain objects; arrays from `override` replace entirely. */
function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const out = { ...base } as T
  for (const key of Object.keys(override || {}) as (keyof T)[]) {
    const bv = override[key]
    if (bv === undefined) continue
    const av = base[key]
    if (Array.isArray(bv)) {
      ;(out as Record<string, unknown>)[key as string] = bv
    } else if (
      bv !== null &&
      typeof bv === 'object' &&
      !Array.isArray(bv) &&
      av !== null &&
      typeof av === 'object' &&
      !Array.isArray(av)
    ) {
      ;(out as Record<string, unknown>)[key as string] = deepMerge(
        av as Record<string, unknown>,
        bv as Record<string, unknown>,
      )
    } else {
      ;(out as Record<string, unknown>)[key as string] = bv
    }
  }
  return out
}

function localeDefaults(locale: 'de' | 'en'): typeof HOME_DEFAULTS {
  if (locale !== 'de') return HOME_DEFAULTS
  return deepMerge(
    HOME_DEFAULTS as unknown as Record<string, unknown>,
    HOME_SEED_DE as unknown as Record<string, unknown>,
  ) as unknown as typeof HOME_DEFAULTS
}

function mergeNavItems(
  cms: Home['navItems'] | null | undefined,
  defaults: NonNullable<Home['navItems']>,
): NonNullable<Home['navItems']> {
  if (!cms?.length) return defaults
  const list = [...cms]
  const shopIdx = list.findIndex(
    (i) => i.href === SHOP_HREF || String(i.label ?? '').toUpperCase() === 'SHOP',
  )
  if (shopIdx === 0) return list
  if (shopIdx > 0) {
    const [row] = list.splice(shopIdx, 1)
    return [row, ...list]
  }
  const defaultShop = defaults[0]
  if (defaultShop?.href === SHOP_HREF) return [defaultShop, ...list]
  return list
}

/**
 * Shallow-deep merge of CMS home global with defaults. For `locale: 'de'`, German
 * fallbacks (`HOME_SEED_DE`) apply when CMS fields are missing — so the DE toggle
 * actually changes copy when the DB is empty or partial.
 */
export function mergeHome(h: Home | null, locale: 'de' | 'en' = 'en'): Home {
  const d = localeDefaults(locale)
  const x = h ?? ({} as Home)

  return {
    id: x.id ?? 'home',
    siteName: x.siteName ?? d.siteName!,
    siteLogo: x.siteLogo ?? d.siteLogo,
    skipLinkLabel: x.skipLinkLabel ?? d.skipLinkLabel,
    navItems: mergeNavItems(x.navItems, d.navItems!),
    accountAriaLabel: x.accountAriaLabel ?? d.accountAriaLabel,
    cartAriaLabel: x.cartAriaLabel ?? d.cartAriaLabel,
    heroBackground: x.heroBackground ?? d.heroBackground,
    heroKicker: x.heroKicker ?? d.heroKicker,
    heroTitleLine1: x.heroTitleLine1 ?? d.heroTitleLine1,
    heroTitleLine2: x.heroTitleLine2 ?? d.heroTitleLine2,
    heroSubtitle: x.heroSubtitle ?? d.heroSubtitle,
    heroAccentWord1: x.heroAccentWord1 ?? d.heroAccentWord1,
    heroAccentWord2: x.heroAccentWord2 ?? d.heroAccentWord2,
    heroPrimaryCtaLabel: x.heroPrimaryCtaLabel ?? d.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: x.heroPrimaryCtaHref ?? d.heroPrimaryCtaHref,
    heroSecondaryCtaLabel: x.heroSecondaryCtaLabel ?? d.heroSecondaryCtaLabel,
    heroSecondaryCtaHref: x.heroSecondaryCtaHref ?? d.heroSecondaryCtaHref,
    laboratoryPhase: x.laboratoryPhase ?? d.laboratoryPhase,
    laboratoryTitle: x.laboratoryTitle ?? d.laboratoryTitle,
    laboratoryIntro: x.laboratoryIntro ?? d.laboratoryIntro,
    laboratoryEmptyFilter: x.laboratoryEmptyFilter ?? d.laboratoryEmptyFilter,
    laboratoryPriceLabel: x.laboratoryPriceLabel ?? d.laboratoryPriceLabel,
    laboratoryAddToCartAriaTemplate: x.laboratoryAddToCartAriaTemplate ?? d.laboratoryAddToCartAriaTemplate,
    storeFilters: x.storeFilters?.length ? x.storeFilters : d.storeFilters,
    storeProducts: x.storeProducts?.length ? x.storeProducts : d.storeProducts,
    labStats: x.labStats?.length ? x.labStats : d.labStats,
    protocolEyebrow: x.protocolEyebrow ?? d.protocolEyebrow,
    protocolTitle: x.protocolTitle ?? d.protocolTitle,
    brewEspressoLabel: x.brewEspressoLabel ?? d.brewEspressoLabel,
    brewFilterLabel: x.brewFilterLabel ?? d.brewFilterLabel,
    geneticSection: { ...d.geneticSection, ...x.geneticSection },
    thermalSection: { ...d.thermalSection, ...x.thermalSection },
    valueSection: { ...d.valueSection, ...x.valueSection },
    precisionPhase: x.precisionPhase ?? d.precisionPhase,
    precisionTitle: x.precisionTitle ?? d.precisionTitle,
    precisionIntro: x.precisionIntro ?? d.precisionIntro,
    precisionPanelTitle: x.precisionPanelTitle ?? d.precisionPanelTitle,
    precisionStatusPrefix: x.precisionStatusPrefix ?? d.precisionStatusPrefix,
    axisRoast: x.axisRoast ?? d.axisRoast,
    axisAcidity: x.axisAcidity ?? d.axisAcidity,
    axisBody: x.axisBody ?? d.axisBody,
    axisSweetness: x.axisSweetness ?? d.axisSweetness,
    axisComplexity: x.axisComplexity ?? d.axisComplexity,
    matrixHeading: x.matrixHeading ?? d.matrixHeading,
    matrixTagsEspresso: x.matrixTagsEspresso?.length ? x.matrixTagsEspresso : d.matrixTagsEspresso,
    matrixTagsFilter: x.matrixTagsFilter?.length ? x.matrixTagsFilter : d.matrixTagsFilter,
    synthesizeButton: x.synthesizeButton ?? d.synthesizeButton,
    scanStats: x.scanStats?.length ? x.scanStats : d.scanStats,
    roastSliderLabel: x.roastSliderLabel ?? d.roastSliderLabel,
    radarAriaLabel: x.radarAriaLabel ?? d.radarAriaLabel,
    flavorNote: x.flavorNote ?? d.flavorNote,
    blendingPhase: x.blendingPhase ?? d.blendingPhase,
    blendingTitle: x.blendingTitle ?? d.blendingTitle,
    blendingIntro: x.blendingIntro ?? d.blendingIntro,
    blendingTabExpert: x.blendingTabExpert ?? d.blendingTabExpert,
    blendingTabManual: x.blendingTabManual ?? d.blendingTabManual,
    blendingExpertCards: x.blendingExpertCards?.length ? x.blendingExpertCards : d.blendingExpertCards,
    manualAssemblerTitle: x.manualAssemblerTitle ?? d.manualAssemblerTitle,
    manualAssemblerProtocolPrefix: x.manualAssemblerProtocolPrefix ?? d.manualAssemblerProtocolPrefix,
    manualRecalibrate: x.manualRecalibrate ?? d.manualRecalibrate,
    manualRowsEspresso: x.manualRowsEspresso?.length ? x.manualRowsEspresso : d.manualRowsEspresso,
    manualRowsFilter: x.manualRowsFilter?.length ? x.manualRowsFilter : d.manualRowsFilter,
    saturationLabel: x.saturationLabel ?? d.saturationLabel,
    stabilityLabel: x.stabilityLabel ?? d.stabilityLabel,
    stabilityLocked: x.stabilityLocked ?? d.stabilityLocked,
    stabilityCalibrating: x.stabilityCalibrating ?? d.stabilityCalibrating,
    finalizeAssembly: x.finalizeAssembly ?? d.finalizeAssembly,
    vaultPhase: x.vaultPhase ?? d.vaultPhase,
    vaultTitle: x.vaultTitle ?? d.vaultTitle,
    vaultIntro: x.vaultIntro ?? d.vaultIntro,
    vaultCuppingLabel: x.vaultCuppingLabel ?? d.vaultCuppingLabel,
    vaultSpecimenYear: x.vaultSpecimenYear ?? d.vaultSpecimenYear,
    vaultMetadataLabel: x.vaultMetadataLabel ?? d.vaultMetadataLabel,
    vaultMetadataValue: x.vaultMetadataValue ?? d.vaultMetadataValue,
    vaultPriceLabel: x.vaultPriceLabel ?? d.vaultPriceLabel,
    vaultCards: x.vaultCards?.length ? x.vaultCards : d.vaultCards,
    genomePhase: x.genomePhase ?? d.genomePhase,
    genomeTitle: x.genomeTitle ?? d.genomeTitle,
    genomeIntro: x.genomeIntro ?? d.genomeIntro,
    genomeTabGallery: x.genomeTabGallery ?? d.genomeTabGallery,
    genomeTabDetailed: x.genomeTabDetailed ?? d.genomeTabDetailed,
    genomeBackLabel: x.genomeBackLabel ?? d.genomeBackLabel,
    genomeBackHref: x.genomeBackHref ?? d.genomeBackHref,
    genomeGalleryIntro: x.genomeGalleryIntro ?? d.genomeGalleryIntro,
    genomeGalleryCta: x.genomeGalleryCta ?? d.genomeGalleryCta,
    genomeMutationLabel: x.genomeMutationLabel ?? d.genomeMutationLabel,
    genomeExtractionGradeLabel: x.genomeExtractionGradeLabel ?? d.genomeExtractionGradeLabel,
    genomeExtractionGradeValue: x.genomeExtractionGradeValue ?? d.genomeExtractionGradeValue,
    genomeSpecimenTitle: x.genomeSpecimenTitle ?? d.genomeSpecimenTitle,
    genomeSpecimenCode: x.genomeSpecimenCode ?? d.genomeSpecimenCode,
    genomeSpecimenStatus: x.genomeSpecimenStatus ?? d.genomeSpecimenStatus,
    genomeGeneticSequenceLabel: x.genomeGeneticSequenceLabel ?? d.genomeGeneticSequenceLabel,
    genomeGeneticSequenceText: x.genomeGeneticSequenceText ?? d.genomeGeneticSequenceText,
    genomeSensoryLabel: x.genomeSensoryLabel ?? d.genomeSensoryLabel,
    genomeSensoryQuote: x.genomeSensoryQuote ?? d.genomeSensoryQuote,
    genomeMetrics: x.genomeMetrics?.length ? x.genomeMetrics : d.genomeMetrics,
    genomeStabilityLabel: x.genomeStabilityLabel ?? d.genomeStabilityLabel,
    genomeStabilityPercent: x.genomeStabilityPercent ?? d.genomeStabilityPercent,
    genomeStabilityStatus: x.genomeStabilityStatus ?? d.genomeStabilityStatus,
    genomeStabilityBar: x.genomeStabilityBar ?? d.genomeStabilityBar,
    genomeRoastProfileLabel: x.genomeRoastProfileLabel ?? d.genomeRoastProfileLabel,
    genomeRoastProfileValue: x.genomeRoastProfileValue ?? d.genomeRoastProfileValue,
    genomeMethodologyLabel: x.genomeMethodologyLabel ?? d.genomeMethodologyLabel,
    genomeMethodologyValue: x.genomeMethodologyValue ?? d.genomeMethodologyValue,
    genomeComplexityLabel: x.genomeComplexityLabel ?? d.genomeComplexityLabel,
    genomeComplexityValue: x.genomeComplexityValue ?? d.genomeComplexityValue,
    genomeSpecimenCostLabel: x.genomeSpecimenCostLabel ?? d.genomeSpecimenCostLabel,
    genomePriceDisplay: x.genomePriceDisplay ?? d.genomePriceDisplay,
    genomePerUnit: x.genomePerUnit ?? d.genomePerUnit,
    genomeAddToCartLabel: x.genomeAddToCartLabel ?? d.genomeAddToCartLabel,
    genomeLabNotesLabel: x.genomeLabNotesLabel ?? d.genomeLabNotesLabel,
    genomeLabNotes: x.genomeLabNotes ?? d.genomeLabNotes,
    labPhase: x.labPhase ?? d.labPhase,
    labTitle: x.labTitle ?? d.labTitle,
    labSubtitle: x.labSubtitle ?? d.labSubtitle,
    labBody: x.labBody ?? d.labBody,
    labGridCards: x.labGridCards?.length ? x.labGridCards : d.labGridCards,
    archivesListPhase: x.archivesListPhase ?? d.archivesListPhase,
    archivesListTitle: x.archivesListTitle ?? d.archivesListTitle,
    archivesListIntro: x.archivesListIntro ?? d.archivesListIntro,
    archivesPhilosophyTitle: x.archivesPhilosophyTitle ?? d.archivesPhilosophyTitle,
    archivesPhilosophyBody: x.archivesPhilosophyBody ?? d.archivesPhilosophyBody,
    archivesFilterTabs: x.archivesFilterTabs?.length ? x.archivesFilterTabs : d.archivesFilterTabs,
    archivesListRows: x.archivesListRows?.length ? x.archivesListRows : d.archivesListRows,
    footerTagline: x.footerTagline ?? d.footerTagline,
    footerMission: x.footerMission ?? d.footerMission,
    footerMapTitle: x.footerMapTitle ?? d.footerMapTitle,
    footerMapLinks: x.footerMapLinks?.length ? x.footerMapLinks : d.footerMapLinks,
    footerOpsTitle: x.footerOpsTitle ?? d.footerOpsTitle,
    footerOpsLinks: x.footerOpsLinks?.length ? x.footerOpsLinks : d.footerOpsLinks,
    footerFeedTitle: x.footerFeedTitle ?? d.footerFeedTitle,
    footerFeedDescription: x.footerFeedDescription ?? d.footerFeedDescription,
    footerFeedPlaceholder: x.footerFeedPlaceholder ?? d.footerFeedPlaceholder,
    footerFeedSubmit: x.footerFeedSubmit ?? d.footerFeedSubmit,
    footerFeedEncryption: x.footerFeedEncryption ?? d.footerFeedEncryption,
    footerFeedSuccess: x.footerFeedSuccess ?? d.footerFeedSuccess,
    footerCopyright: x.footerCopyright ?? d.footerCopyright,
    neuralFeedMailSubject: x.neuralFeedMailSubject ?? d.neuralFeedMailSubject,
    neuralFeedMailBodyIntro: x.neuralFeedMailBodyIntro ?? d.neuralFeedMailBodyIntro,
    updatedAt: x.updatedAt,
    createdAt: x.createdAt,
  }
}
