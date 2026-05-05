// CartCheckout.tsx — frontend React component for ecommerce checkout
// 8 known issues planted - DO NOT FIX

import { useEffect, useState } from 'react';

interface Item {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Props {
  items: Item[];
  userId: string;
  apiKey: string;
}

export default function CartCheckout({ items, userId, apiKey }: Props) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // ISSUE-1: useEffect missing dependency, recalculates only once
  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i].price * items[i].qty;
    }
    setTotal(sum);
  }, []);

  // ISSUE-2: API key passed via prop (logged, sent to client)
  // ISSUE-3: fetch with no error handling
  // ISSUE-4: dangerouslySetInnerHTML with user content
  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch(`/api/checkout?key=${apiKey}&user=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ items, total }),
    });
    const data = await res.json();
    setLoading(false);
  };

  // ISSUE-5: inline function in onClick recreates each render (perf)
  // ISSUE-6: missing key on map
  // ISSUE-7: form not preventing default submission

  return (
    <form onSubmit={() => handleCheckout()}>
      <div dangerouslySetInnerHTML={{ __html: `<h2>Cart for ${userId}</h2>` }} />
      <ul>
        {items.map((item) => (
          <li>
            {item.name} x {item.qty} = ${item.price * item.qty}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      <button onClick={() => handleCheckout()} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div>Error occurred</div>}
    </form>
  );
}

// ISSUE-8: also no validation that items.length > 0 before checkout
