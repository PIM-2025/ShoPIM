import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='Aparência'
      desc='Personalize a aparência do painel. Alterne entre os temas claro e escuro.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
