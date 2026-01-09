import { useState } from 'react'
import styles from './home.module.css'
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button/Button';

function HomePage() {
  const { t } = useTranslation("home");

  return (
    <>
      <h1>HomePage</h1>
      <Button>Click for funnsies</Button>
      <Button variant='primary'>Click for funnsies</Button>
      <Button variant='ghost'>Click for funnsies</Button>
    </>
  )
}

export default HomePage
