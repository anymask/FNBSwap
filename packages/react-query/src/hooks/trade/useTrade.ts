import { useQuery } from '@tanstack/react-query'
import { Amount, Native, Price, Type } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { Trade } from './types'
import { useCallback } from 'react'
import { usePrices } from '../usePrices'
import { Fraction, Percent } from '@sushiswap/math'
import { calculateSlippageAmount } from '../../../../exchange/dist'

interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: number | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
}

const INITIAL_DATA: UseTradeReturn = {
  swapPrice: undefined,
  priceImpact: undefined,
  amountOut: undefined,
  minAmountOut: undefined,
  gasSpent: undefined,
}

interface UseTrade {
  chainId: ChainId
  fromToken: Type
  toToken: Type
  amount: Amount<Type> | undefined
  gasPrice?: number
  slippagePercentage: string
}

const _hydrate = (
  { chainId, toToken, amount, slippagePercentage }: UseTrade,
  prices: Record<string, Fraction> | undefined,
  data: Trade
): UseTradeReturn => {
  if (!data || !amount) return INITIAL_DATA

  const amountOut = Amount.fromRawAmount(toToken, Math.floor(data.getBestRoute.totalAmountOut))
  const minAmountOut = Amount.fromRawAmount(
    toToken,
    calculateSlippageAmount(amountOut, new Percent(Math.floor(+slippagePercentage * 100), 10_000))[0]
  )
  const gasSpentInGwei = Amount.fromRawAmount(Native.onChain(chainId), data.getBestRoute.gasSpent * 1e9)
  const gasSpent =
    prices && gasSpentInGwei
      ? gasSpentInGwei.multiply(prices?.[Native.onChain(chainId).wrapped.address].asFraction).toFixed(2)
      : undefined

  return {
    swapPrice: new Price({ baseAmount: amount, quoteAmount: amountOut }),
    priceImpact: data.getBestRoute.priceImpact,
    amountOut,
    minAmountOut,
    gasSpent,
  }
}

export const useTrade = (variables: UseTrade) => {
  const { chainId, fromToken, toToken, amount, gasPrice = 50 } = variables
  const { data: prices } = usePrices({ chainId })

  return useQuery<unknown, unknown, UseTradeReturn>(
    ['getTrade', { chainId, fromToken, toToken, amount, gasPrice }],
    () =>
      fetch(
        `https://swap.sushi.com/?chainId=${chainId}&fromToken=${
          fromToken.isNative ? 'ETH' : fromToken.wrapped.address
        }&toToken=${
          toToken.isNative ? 'ETH' : toToken.wrapped.address
        }&amount=${amount?.quotient.toString()}&gasPrice=${gasPrice}`
      ).then((res) => res.json()),
    {
      staleTime: 2000,
      initialData: INITIAL_DATA,
      enabled: Boolean(chainId && fromToken && toToken && amount && gasPrice),
      select: (data) => _hydrate(variables, prices, data as Trade),
    }
  )
}