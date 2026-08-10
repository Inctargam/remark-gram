'use client'

import {
  PaymentConsentModal,
  PaymentResultModal,
  useBuySubscription,
} from '@/features/buy-subscription'

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

  const {
    consentProvider,
    isCheckoutPending,
    paymentResult,
    cancelPayment,
    closePaymentResult,
    confirmPayment,
    startPayment,
  } = useBuySubscription({ planId: selectedPlanId })

  return (
    <>
      <AccountManagementView
        accountType={accountType}
        currentSubscription={currentSubscription}
        errorMessage={errorMessage}
        isLoading={isLoading}
        isPersonalDisabled={isPersonalDisabled}
        selectedPlanId={selectedPlanId}
        onAccountTypeChange={setAccountType}
        onPlanChange={setSelectedPlanId}
        onProviderSelect={startPayment}
      />

      <PaymentConsentModal
        open={consentProvider !== null}
        isPending={isCheckoutPending}
        onConfirm={confirmPayment}
        onOpenChange={cancelPayment}
      />

      <PaymentResultModal outcome={paymentResult} onClose={closePaymentResult} />
    </>
  )
}
