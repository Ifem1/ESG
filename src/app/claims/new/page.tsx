import type { Metadata } from 'next'
import { ClaimForm } from '@/components/claims/ClaimForm'

export const metadata: Metadata = {
  title: 'Submit ESG Claim',
}

export default function NewClaimPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Submit ESG Claim</h1>
        <p className="text-sm text-text-secondary mt-1">
          Submit a sustainability claim for decentralized AI consensus verification.
          Your claim will be analysed by independent AI validators on the GenLayer network.
        </p>
      </div>
      <ClaimForm />
    </div>
  )
}
