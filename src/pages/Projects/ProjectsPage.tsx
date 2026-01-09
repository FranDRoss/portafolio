import { useState } from 'react'
import styles from './projects.module.css'
import { useTranslation } from 'react-i18next';

function ProjectsPage() {
  const { t } = useTranslation("projects");

  return (
    <>
      <h1>ProjectsPage</h1>
    </>
  )
}

export default ProjectsPage
