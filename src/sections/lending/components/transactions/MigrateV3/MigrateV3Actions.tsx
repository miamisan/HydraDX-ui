import { ProtocolAction } from "@aave/contract-helpers"

import { useTransactionHandler } from "sections/lending/helpers/useTransactionHandler"
import { useRootStore } from "sections/lending/store/root"

import { TxActionsWrapper } from "sections/lending/components/transactions/TxActionsWrapper"

export type MigrateV3ActionsProps = {
  isWrongNetwork: boolean
  blocked: boolean
}

export const MigrateV3Actions = ({
  isWrongNetwork,
  blocked,
}: MigrateV3ActionsProps) => {
  const migrateWithPermits = useRootStore((store) => store.migrateWithPermits)
  const migrateWithoutPermits = useRootStore(
    (store) => store.migrateWithoutPermits,
  )
  const getApprovePermitsForSelectedAssets = useRootStore(
    (store) => store.getApprovePermitsForSelectedAssets,
  )
  const {
    approval,
    action,
    loadingTxns,
    requiresApproval,
    mainTxState,
    approvalTxState,
  } = useTransactionHandler({
    handleGetTxns: async () => await migrateWithoutPermits(),
    handleGetPermitTxns: async (signatures, deadline) =>
      await migrateWithPermits(signatures, deadline),
    tryPermit: true,
    permitAction: ProtocolAction.migrateV3,
  })

  const handleApproval = async () => {
    const approvePermitsForSelectedAssets =
      await getApprovePermitsForSelectedAssets()
    approval(approvePermitsForSelectedAssets)
  }

  return (
    <TxActionsWrapper
      requiresApproval={requiresApproval}
      preparingTransactions={loadingTxns}
      mainTxState={mainTxState}
      approvalTxState={approvalTxState}
      isWrongNetwork={isWrongNetwork}
      handleAction={action}
      handleApproval={handleApproval}
      blocked={blocked}
      actionText={<span>Migrate</span>}
      actionInProgressText={<span>Migrating</span>}
      tryPermit
    />
  )
}
