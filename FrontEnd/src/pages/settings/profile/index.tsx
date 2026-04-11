import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Perfil'
      desc='Veja como os outros usuários vão visualizar você no sistema.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
