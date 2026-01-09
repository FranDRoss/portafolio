import { useState } from 'react'
import styles from './about.module.css'
import { useTranslation } from 'react-i18next';

function AboutPage() {
  const { t } = useTranslation("about");

  return (
    <>
      <h1>AboutPage</h1>
    </>
  )
}

export default AboutPage
