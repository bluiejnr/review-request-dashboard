'use client';

interface PayButtonProps {
  email?: string;
  amountInNaira?: number;
  onSuccessCallback?: () => void;
}

export default function PayButton({ 
  email = 'user@example.com', 
  amountInNaira = 29000, // Equivalent for testing
  onSuccessCallback
}: PayButtonProps) {

  const handlePayment = () => {
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_cf51aded72a33f96bb3b977739f8de9e9a16d40e';

    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      try {
        const paystack = new (window as any).PaystackPop();
        paystack.newTransaction({
          key: paystackKey,
          email: email,
          amount: amountInNaira * 100,
          currency: 'NGN',
          onSuccess: (transaction: any) => {
            alert(`Payment Successful! Ref: ${transaction.reference}`);
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
          onCancel: () => {
            alert('Transaction cancelled.');
          },
        });
      } catch (error) {
        console.error('Paystack Initialization Error:', error);
        alert('Failed to launch Paystack popup. Check console.');
      }
    } else {
      alert('Paystack SDK not loaded yet. Refresh the page and try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={() => handlePayment()}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
    >
      Upgrade / Pay $29
    </button>
  );
}