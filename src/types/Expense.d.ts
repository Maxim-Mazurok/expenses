import { TransactionType } from './GlobalState';

type Transaction = {
  id: string
} & NewTransaction

interface NewTransaction {
  type: TransactionType
  date: Date
  description: string
  category: string | undefined
  amount: number | ''
  account: string
}
