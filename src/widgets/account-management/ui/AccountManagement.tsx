'use client'

import { useAccountManagement } from '../model/useAccountManagement'
import { AccountManagementView } from './AccountManagementView'

/**
 * The whole `Account Management` tab. Takes no props on purpose: the settings page shell is
 * built by another developer and only has to render this inside its tab panel.
 */
export const AccountManagement = () => {
  const {
    accountType,
    currentSubscription,
    errorMessage,
    isLoading,
    isPersonalDisabled,
    selectedPlanId,
    setAccountType,
    setSelectedPlanId,
  } = useAccountManagement()

  return (
    <AccountManagementView
      accountType={accountType}
      currentSubscription={currentSubscription}
      errorMessage={errorMessage}
      isLoading={isLoading}
      isPersonalDisabled={isPersonalDisabled}
      selectedPlanId={selectedPlanId}
      onAccountTypeChange={setAccountType}
      onPlanChange={setSelectedPlanId}
    />
  )
}
