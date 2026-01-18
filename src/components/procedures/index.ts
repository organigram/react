import ERC20Vote from './erc20Vote'
import Nomination from './nomination'
import Vote from './vote'

export type ImportedReactNode = import('react').ReactNode

export {
  ERC20Vote,
  Nomination,
  Vote
}

export const secondsToHms = (d: number): string => {
  const days = Math.floor(d / 86400)
  const hours = Math.floor((d % 86400) / 3600)
  const minutes = Math.floor((d % 3600) / 60)
  const seconds = Math.floor((d % 3600) % 60)

  const dDisplay = days > 0 ? days.toString() + (days === 1 ? ' day, ' : ' days, ') : ''
  const hDisplay = hours > 0 ? hours.toString() + (hours === 1 ? ' hour, ' : ' hours, ') : ''
  const mDisplay = minutes > 0 ? minutes.toString() + (minutes === 1 ? ' minute, ' : ' minutes, ') : ''
  const sDisplay = seconds > 0 ? seconds.toString() + (seconds === 1 ? ' second' : ' seconds') : ''
  return dDisplay + hDisplay + mDisplay + sDisplay
}
