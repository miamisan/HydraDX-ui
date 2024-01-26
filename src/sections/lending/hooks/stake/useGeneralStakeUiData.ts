import { Stake } from "@aave/contract-helpers"
import { useQuery } from "@tanstack/react-query"
import { MarketDataType } from "sections/lending/ui-config/marketsConfig"
import {
  POLLING_INTERVAL,
  queryKeysFactory,
} from "sections/lending/ui-config/queries"
import { useSharedDependencies } from "sections/lending/ui-config/SharedDependenciesProvider"

import { getStakeIndex, oracles, stakedTokens } from "./common"

export const useGeneralStakeUiData = (
  marketData: MarketDataType,
  select?: Stake,
) => {
  const { uiStakeDataService } = useSharedDependencies()

  return useQuery({
    queryFn: () =>
      uiStakeDataService.getGeneralStakeUIDataHumanized(
        marketData,
        stakedTokens,
        oracles,
      ),
    queryKey: queryKeysFactory.generalStakeUiData(
      marketData,
      stakedTokens,
      oracles,
    ),
    refetchInterval: POLLING_INTERVAL,
    select: (data) => {
      if (data && select) {
        return {
          ...data,
          stakeData: [data.stakeData[getStakeIndex(select)]],
        }
      }
      return data
    },
  })
}
