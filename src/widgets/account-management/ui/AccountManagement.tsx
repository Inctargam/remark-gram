'use client'

import {
  PaymentConsentModal,
  PaymentResultModal,
  useBuySubscription,
} from '@/features/buy-subscription'
import { AutoRenewalCheckbox } from '@/features/cancel-auto-renewal'

import { useAccountManagement } from '../model/useAccountManagement'
import { AccountManagementView } from './AccountManagementView'

/**
 * The whole `Account Management` tab. Takes no props on purpose: the settings page shell is
 * built by another developer and only has to render this inside its tab panel.
 */
export const AccountManagement = () => {
  const {
    accountType,
    errorMessage,
    isAutoRenewalOn,
    isLoading,
    isPersonalDisabled,
    selectedPlanId,
    subscriptionQueue,
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
        autoRenewalSlot={<AutoRenewalCheckbox checked={isAutoRenewalOn} />}
        errorMessage={errorMessage}
        isLoading={isLoading}
        isPersonalDisabled={isPersonalDisabled}
        selectedPlanId={selectedPlanId}
        subscriptionQueue={subscriptionQueue}
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
