import { TransactionType } from './GlobalState';

type Transaction = {
  id: string
} & NewTransaction

interface NewTransaction {
  type: TransactionType
  date: Date
  description: string
  category: string
  amount: number | ''
  account: string
}
