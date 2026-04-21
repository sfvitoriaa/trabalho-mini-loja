import { useState } from 'react'
import { products } from '../data/products'
import { CartItem } from '../types'
import { CheckoutForm } from '../components/CheckoutForm/CheckoutForm'

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [submitted, setSubmitted] = useState(false)

  const totalValue = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  function handleAddToCart(productId: number) {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === productId)
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  function handleRemove(productId: number) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  if (submitted) {
    return (
      <div className="container-store">
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          <h1>Pedido Confirmado</h1>
          <p style={{ color: 'var(--text-muted)' }}>Obrigado pela sua compra. Enviamos um e-mail com os detalhes.</p>
          <button className="btn" style={{ width: 'auto', marginTop: '2rem' }} onClick={() => setSubmitted(false)}>
            Voltar ao Catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="container-store">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ margin: 0 }}>Catálogo de Produtos</h1>
        <p style={{ color: 'var(--text-muted)' }}>Selecione os itens abaixo para compor seu pedido.</p>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{product.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {product.description}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span className="price-tag">R$ {product.price.toFixed(2)}</span>
              <button className="btn" style={{ width: 'auto' }} onClick={() => handleAddToCart(product.id)}>
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-container">
        <section className="card">
          <h2>Seu Carrinho</h2>
          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              O carrinho está vazio.
            </p>
          ) : (
            <div style={{ marginBottom: '1.5rem' }}>
              {cartItems.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.quantity} un. x R$ {item.product.price.toFixed(2)}
                    </div>
                  </div>
                  <button className="btn-remove" onClick={() => handleRemove(item.product.id)}>Remover</button>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid var(--bg-soft)' }}>
                <span style={{ fontWeight: '700' }}>Total</span>
                <span className="price-tag">R$ {totalValue.toFixed(2)}</span>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <h2>Checkout</h2>
          <CheckoutForm onSubmit={() => setSubmitted(true)} />
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-soft)', borderRadius: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              🔒 Pagamento processado em ambiente seguro.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}