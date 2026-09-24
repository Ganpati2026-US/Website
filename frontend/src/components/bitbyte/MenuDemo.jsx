import { useState } from 'react';
import { Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Check, UtensilsCrossed } from 'lucide-react';
import { Button } from '../ui/button';

const dishes = [
  { id: 'pizza', name: 'Margherita Pizza', category: 'Pizza', detail: 'Fresh basil, mozzarella, tomato', price: 349, image: 'https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?auto=format&fit=crop&w=500&q=80', position: '75% 50%' },
  { id: 'pasta', name: 'Creamy Alfredo', category: 'Pasta', detail: 'Parmesan, cream, a little magic', price: 299, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=80', position: '50% 50%' },
  { id: 'special', name: 'Garden Fresh Pizza', category: 'Pizza', detail: 'Seasonal vegetables, herbs, cheese', price: 379, image: 'https://images.pexels.com/photos/14966000/pexels-photo-14966000.jpeg?auto=compress&cs=tinysrgb&w=500', position: '35% 65%' },
  { id: 'sides', name: 'Sharing Platter', category: 'Sides', detail: 'A little something for the table', price: 249, image: 'https://images.unsplash.com/photo-1532117472055-4d0734b51f31?auto=format&fit=crop&w=500&q=80', position: '50% 75%' },
];

export const BitByteWordmark = ({ id = 'bitbyte-wordmark' }) => <span className="bitbyte-wordmark" data-testid={id}><UtensilsCrossed size={22} strokeWidth={2.5} />BitByte<span className="bitbyte-wordmark-dot">®</span></span>;

export const MenuDemo = ({ prefix = 'menu', compact = false }) => {
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [screen, setScreen] = useState('menu');
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = dishes.reduce((sum, d) => sum + d.price * (cart[d.id] || 0), 0);
  const update = (id, amount) => setCart(old => ({ ...old, [id]: Math.max(0, (old[id] || 0) + amount) }));
  return <div className={`menu-device ${compact ? 'compact-menu' : ''}`} data-testid={`${prefix}-demo`}><div className="device-status" aria-hidden="true"><span>9:41</span><span>▰</span></div><div className="menu-header"><BitByteWordmark id={`${prefix}-wordmark`} /><span className="table-badge" data-testid={`${prefix}-table`}>Table 07</span></div>
    <div className="menu-content">
    {screen === 'menu' && <><div className="menu-greeting"><span>GOOD FOOD. GOOD MOOD.</span><h3 data-testid={`${prefix}-greeting`}>What are you<br />craving today?</h3></div><div className="menu-categories" role="group" aria-label="Menu categories">{['All', 'Pizza', 'Pasta', 'Sides'].map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)} data-testid={`${prefix}-category-${c.toLowerCase()}`}>{c}</button>)}</div><div className="dish-list">{dishes.filter(d => category === 'All' || d.category === category).slice(0, compact ? 2 : 4).map(d => <div className="dish" key={d.id}><img src={d.image} style={{ objectPosition: d.position }} alt={d.name} loading="lazy" /><div className="dish-copy"><span className="veg-mark" aria-label="Vegetarian" /><h4 data-testid={`${prefix}-dish-${d.id}`}>{d.name}</h4><p>{d.detail}</p><div className="dish-bottom"><strong data-testid={`${prefix}-price-${d.id}`}>₹{d.price}</strong><button onClick={() => update(d.id, 1)} data-testid={`${prefix}-add-${d.id}`} aria-label={`Add ${d.name}`}>{cart[d.id] ? cart[d.id] : <Plus size={15} />}</button></div></div></div>)}</div></>}
    {screen === 'cart' && <div className="cart-screen"><button className="menu-back" onClick={() => setScreen('menu')} data-testid={`${prefix}-back-to-menu`}><ArrowLeft size={15} />Back to menu</button><h3 data-testid={`${prefix}-cart-heading`}>Good choices.</h3><p className="demo-note">Your illustrative order · Table 07</p>{dishes.filter(d => cart[d.id]).map(d => <div className="cart-row" key={d.id}><div><h4>{d.name}</h4><span>₹{d.price * cart[d.id]}</span></div><div className="quantity-controls"><button onClick={() => update(d.id, -1)} aria-label={`Remove one ${d.name}`} data-testid={`${prefix}-remove-${d.id}`}><Minus size={13} /></button><span data-testid={`${prefix}-quantity-${d.id}`}>{cart[d.id]}</span><button onClick={() => update(d.id, 1)} aria-label={`Add one ${d.name}`} data-testid={`${prefix}-increase-${d.id}`}><Plus size={13} /></button></div></div>)}{count === 0 && <p data-testid={`${prefix}-empty-cart`}>Your cart is empty. Find something delicious on the menu.</p>}<div className="cart-total" data-testid={`${prefix}-total`}><span>Total</span><strong>₹{total}</strong></div><p className="demo-note">Demo prices. No payment or real order.</p></div>}
    {screen === 'done' && <div className="order-success" data-testid={`${prefix}-order-success`}><span className="success-icon"><Check /></span><h3>That’s the idea.</h3><p>From your table to your order, in a few simple steps.</p><p className="demo-note">Preview complete. No real order was sent.</p><button className="menu-back" data-testid={`${prefix}-restart`} onClick={() => { setScreen('menu'); setCart({}); }}>Explore the menu again <ArrowRight size={14} /></button></div>}
    </div>
    {screen !== 'done' && <Button className="menu-order-button" data-testid={`${prefix}-${screen === 'cart' ? 'place-order' : 'view-cart'}`} disabled={screen === 'cart' && count === 0} onClick={() => setScreen(screen === 'cart' ? 'done' : 'cart')}><ShoppingBag size={16} /><span>{screen === 'cart' ? 'Preview order' : `View your order${count ? ` (${count})` : ''}`}</span><span>₹{total}</span><ArrowRight size={15} /></Button>}
    <div className="device-home" aria-hidden="true" />
  </div>;
};
