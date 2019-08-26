import { TransactionType } from './GlobalState';

interface Transaction {
  id: string
  category: string
  fromAccount: string
  amount: number
  amountTransferred?: number
  taxable: boolean
  type: TransactionType
  date: Date
  description: string
  toAccount: string
  rate?: number
  fee: number
  cashbackAccount: string
  cashbackAmount: number
  pointsAccount: string
  pointsAmount: number
  refundAmount: number
}

interface NewTransaction extends Transaction {
  id?: never
  description?: string
  category?: string
  fromAccount?: string
  toAccount?: string
  amount?: number
  fee?: number
  cashbackAccount?: string
  cashbackAmount?: number
  pointsAccount?: string
  pointsAmount?: number
  refundAmount?: number
}
