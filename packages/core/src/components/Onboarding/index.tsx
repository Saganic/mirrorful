import { generateDefaultColorShades } from '@core/components/ColorPalette/utils'
import { useState } from 'react'
import {
  TColorData,
  TExportFileType,
  defaultFiles,
  defaultTypography,
  TConfig,
} from '@core/types'
import { OnboardingContainer } from './OnboardingContainer'
import { ExportSettings } from './pages/ExportSettings'
import { ImportInstructions } from './pages/ImportInstructions'
import { NamePrimary } from './pages/NamePrimary'
import { OtherColors } from './pages/OtherColors'
import { PickPrimary } from './pages/PickPrimary'
import { ReviewPrimary } from './pages/ReviewPrimary'
import { Welcome } from './pages/Welcome'

export function Onboarding({
  postStoreData,
  onFinishOnboarding,
}: {
  postStoreData: (data: TConfig) => Promise<void>
  onFinishOnboarding: () => void
}) {
  const [primaryColor, setPrimaryColor] = useState<string>('#9F7AEA')
  const [primaryName, setPrimaryName] = useState<string>('')
  const [palette, setPalette] = useState<TColorData[]>([])
  const [fileTypes, setFileTypes] = useState<TExportFileType[]>(defaultFiles)

  const [page, setPage] = useState<number>(0)

  const handleExport = async (
    primaryColorHex: string,
    primaryColorName: string,
    latestPalette: TColorData[]
  ) => {
    const colors: TColorData[] = [
      {
        name: primaryColorName,
        baseColor: primaryColorHex,
        variants: generateDefaultColorShades(primaryColorHex),
      },
      ...latestPalette,
    ]

    await postStoreData({
      tokens: { colorData: colors, typography: defaultTypography },
      files: fileTypes,
    })
  }

  let content = (
    <Welcome onFinishOnboarding={onFinishOnboarding} onUpdatePage={setPage} />
  )

  if (page === 1) {
    content = (
      <PickPrimary
        initialPrimary={primaryColor}
        onUpdatePage={setPage}
        onUpdatePrimaryColor={(newColor: string) => setPrimaryColor(newColor)}
      />
    )
  } else if (page === 2) {
    content = (
      <NamePrimary
        initialName={primaryName}
        onUpdatePage={setPage}
        primaryColor={primaryColor}
        onUpdatePrimaryName={(newName: string) => setPrimaryName(newName)}
      />
    )
  } else if (page === 3) {
    content = (
      <ReviewPrimary primaryColor={primaryColor} onUpdatePage={setPage} />
    )
  } else if (page === 4) {
    content = (
      <OtherColors
        initialPalette={palette}
        onUpdatePalette={(newPalette: TColorData[]) => {
          newPalette.map((color) => {
            if (color.baseColor) {
              color.variants = generateDefaultColorShades(color.baseColor)
            }
          })
          setPalette(newPalette)
        }}
        primaryColor={primaryColor}
        primaryName={primaryName}
        onUpdatePage={setPage}
      />
    )
  } else if (page === 5) {
    content = (
      <ExportSettings
        primaryColor={primaryColor}
        fileTypes={fileTypes}
        onUpdateFileTypes={setFileTypes}
        onExport={() => {
          handleExport(primaryColor, primaryName, palette)
        }}
        onUpdatePage={setPage}
      />
    )
  } else if (page === 6) {
    content = (
      <ImportInstructions
        primaryColor={primaryColor}
        primaryName={primaryName}
        onUpdatePage={setPage}
        onFinish={onFinishOnboarding}
      />
    )
  }

  return <OnboardingContainer>{content}</OnboardingContainer>
}
