import React from 'react'
import { Switch } from '@nextui-org/react'
import { MoonIcon } from '../icons/MoonIcon'
import { SunIcon } from '../icons/SunIcon'

interface DarkModeSwitchProps {
  onChange: () => void
  checked: boolean
}

const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({ onChange, checked }) => {
  return (
    <Switch
      isSelected={checked}
      size="lg"
      color="success"
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
      onChange={onChange}
    >
    </Switch>
  )
}

export default DarkModeSwitch
