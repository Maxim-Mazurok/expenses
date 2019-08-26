import { TransactionType } from './GlobalState';

type Transaction = {
  id: string
  category: string
  account: string
  amount: number
} & NewTransaction

interface NewTransaction {
  type: TransactionType
  date: Date
  description: string
  category: string | undefined
  account: string | undefined
  amount: number | ''
}
