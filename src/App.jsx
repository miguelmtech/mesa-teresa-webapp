import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ══════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════
const style = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --chukum:#c4a882;--chukum-dk:#a8896a;--chukum-lt:#e8d9c5;--cream:#f5ede0;--sand:#dbc9af;
  --bark:#5c4033;--espresso:#2c1810;--sage:#7a8c6e;--sage-lt:#b5c4a8;
  --terra:#c4704a;--gold:#c9a84c;--white:#faf8f4;--text:#2c1810;--muted:#7a6655;
  --shadow:rgba(44,24,16,0.15);--r:16px;--rs:10px;
}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);min-height:100vh;overflow-x:hidden}
.app{min-height:100vh;background:radial-gradient(ellipse at 20% 20%,rgba(196,168,130,.3) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(122,140,110,.2) 0%,transparent 60%),url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c4a882' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E"),var(--cream)}
/* NAV TOP BAR */
.nav{background:var(--espresso);padding:0 14px;display:flex;align-items:center;gap:8px;height:68px;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,.3)}
.nav-logo{font-family:'Playfair Display',serif;font-size:17px;color:var(--chukum-lt);font-style:italic;white-space:nowrap;padding-right:12px;border-right:1px solid rgba(255,255,255,.12)}
/* SIDEBAR NAV */
.sidebar-nav{display:flex;gap:3px;overflow-x:auto;flex:1;align-items:center;padding:0 4px}
.sidebar-nav::-webkit-scrollbar{height:3px}
.sidebar-nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}
.snav-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 13px;border-radius:12px;border:none;background:transparent;color:rgba(219,201,175,.7);font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;cursor:pointer;transition:all .18s;white-space:nowrap;min-width:62px;min-height:52px;justify-content:center;position:relative}
.snav-item .snav-icon{font-size:22px;line-height:1;transition:transform .18s}
.snav-item .snav-label{font-size:10px;letter-spacing:.2px;font-weight:600}
.snav-item.active{background:rgba(196,168,130,.25);color:var(--chukum-lt)}
.snav-item.active .snav-icon{transform:scale(1.12)}
.snav-item:hover:not(.active){background:rgba(196,168,130,.14);color:var(--chukum-lt)}
.snav-item.danger{color:rgba(255,160,140,.8)}
.snav-item.danger:hover{background:rgba(224,85,85,.2);color:#ffb3a7}
.snav-item.danger.active{background:rgba(224,85,85,.28);color:#ffb3a7}
.snav-item.success{color:rgba(160,220,150,.8)}
.snav-item.success:hover{background:rgba(74,140,63,.2);color:#b3ffb0}
.snav-divider{width:1px;height:36px;background:rgba(255,255,255,.12);margin:0 4px;flex-shrink:0}
.role-badge{background:var(--terra);color:#fff;font-size:10px;padding:4px 9px;border-radius:20px;font-weight:700;white-space:nowrap}
.shift-badge{font-size:10px;padding:4px 9px;border-radius:20px;font-weight:600;white-space:nowrap}
.shift-open{background:rgba(122,140,110,.3);color:#6fcc6a}
.shift-closed{background:rgba(224,85,85,.2);color:#ff9090}
/* keep old .nav-tab for any legacy usage */
.nav-tab{padding:6px 11px;border-radius:16px;border:none;background:transparent;color:var(--sand);font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap}
.nav-tab.active{background:var(--chukum);color:var(--espresso);font-weight:700}
.nav-tab:hover:not(.active){background:rgba(196,168,130,.2);color:var(--chukum-lt)}
/* LAYOUT */
.sp{padding:16px;max-width:1280px;margin:0 auto}
.card{background:rgba(255,255,255,.72);backdrop-filter:blur(10px);border-radius:var(--r);border:1px solid rgba(196,168,130,.3);box-shadow:0 4px 24px var(--shadow);padding:18px}
.sec-title{font-family:'Playfair Display',serif;font-size:21px;color:var(--bark);margin-bottom:4px}
.sec-sub{color:var(--muted);font-size:13px;margin-bottom:16px}
/* GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
@media(max-width:900px){.g4{grid-template-columns:repeat(3,1fr)}.g3{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.g4{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr}.g2{grid-template-columns:1fr}}
/* BUTTONS */
.btn{padding:9px 18px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:var(--espresso);color:var(--chukum-lt)}
.btn-primary:hover{background:var(--bark);transform:translateY(-1px)}
.btn-accent{background:var(--terra);color:#fff}
.btn-accent:hover{background:#b05e3a;transform:translateY(-1px)}
.btn-sage{background:var(--sage);color:#fff}
.btn-sage:hover{background:#697a5e}
.btn-gold{background:var(--gold);color:var(--espresso)}
.btn-gold:hover{background:#b8963e}
.btn-outline{background:transparent;border:2px solid var(--chukum);color:var(--bark)}
.btn-outline:hover{background:var(--chukum-lt)}
.btn-danger{background:#e05555;color:#fff}
.btn-danger:hover{background:#c03030}
.btn-green{background:#4a8c3f;color:#fff}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:8px}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important}
/* INPUTS */
.inp{width:100%;padding:9px 13px;border:1.5px solid var(--sand);border-radius:var(--rs);background:rgba(255,255,255,.85);font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);outline:none;transition:border .2s}
.inp:focus{border-color:var(--chukum-dk);box-shadow:0 0 0 3px rgba(196,168,130,.2)}
.lbl{font-size:12px;font-weight:700;color:var(--bark);margin-bottom:4px;display:block}
.fg{margin-bottom:12px}
select.inp{cursor:pointer}
/* PRODUCT BTN */
.pb{background:rgba(255,255,255,.88);border:2px solid var(--sand);border-radius:var(--r);padding:12px 8px;cursor:pointer;transition:all .18s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:5px}
.pb:hover{border-color:var(--chukum-dk);transform:translateY(-2px);box-shadow:0 6px 20px var(--shadow)}
.pb.sel{border-color:var(--terra);background:rgba(196,112,74,.07)}
.pb-em{font-size:26px;line-height:1}
.pb-nm{font-size:12px;font-weight:700;color:var(--bark);line-height:1.2}
.pb-pr{font-size:12px;color:var(--terra);font-weight:800}
/* ORDER ITEM */
.oi{display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(196,168,130,.2)}
.oi-inf{flex:1}
.oi-nm{font-size:13px;font-weight:600;color:var(--bark)}
.oi-mod{font-size:11px;color:var(--muted)}
.qb{width:26px;height:26px;border-radius:50%;border:none;background:var(--chukum-lt);color:var(--bark);font-size:15px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.qb:hover{background:var(--chukum)}
/* CAT TABS */
.ct{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.ct-btn{padding:6px 14px;border-radius:18px;border:1.5px solid var(--sand);background:transparent;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;color:var(--muted)}
.ct-btn.active{background:var(--espresso);border-color:var(--espresso);color:var(--chukum-lt);font-weight:700}
.ct-btn:hover:not(.active){background:var(--chukum-lt);border-color:var(--chukum);color:var(--bark)}
/* MODAL */
.mo{position:fixed;inset:0;background:rgba(44,24,16,.62);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
.mc{background:var(--cream);border-radius:var(--r);max-width:500px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3);border:1px solid var(--sand);padding:22px}
.mc-lg{max-width:720px}
.mc-xl{max-width:960px}
.mo-title{font-family:'Playfair Display',serif;font-size:19px;color:var(--bark);margin-bottom:14px}
/* BADGES */
.bdg{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700}
.bdg-g{background:rgba(122,140,110,.2);color:var(--sage)}
.bdg-r{background:rgba(224,85,85,.15);color:#c03030}
.bdg-o{background:rgba(196,112,74,.15);color:var(--terra)}
.bdg-au{background:rgba(201,168,76,.2);color:var(--gold)}
.bdg-b{background:rgba(44,24,16,.1);color:var(--bark)}
/* TABLE */
.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;padding:9px 11px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid var(--sand);background:rgba(196,168,130,.1)}
.tbl td{padding:9px 11px;font-size:13px;border-bottom:1px solid rgba(196,168,130,.2)}
.tbl tr:hover td{background:rgba(196,168,130,.06)}
/* TICKET */
.tkt{background:#fff;border-radius:var(--rs);padding:14px;font-size:12px;border:1px dashed var(--chukum);max-width:320px;margin:0 auto;font-family:monospace}
.tkt-h{text-align:center;margin-bottom:10px;border-bottom:1px dashed #ccc;padding-bottom:8px}
.tkt-r{display:flex;justify-content:space-between;padding:2px 0}
.tkt-tot{border-top:1px dashed #ccc;padding-top:8px;font-weight:700;display:flex;justify-content:space-between;margin-top:4px}
/* LOGIN */
.ls{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--espresso);background-image:radial-gradient(ellipse at 30% 40%,rgba(196,168,130,.2) 0%,transparent 70%)}
.lc{background:var(--cream);border-radius:24px;padding:36px 28px;max-width:340px;width:100%;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.4);border:1px solid var(--sand)}
.ll{font-family:'Playfair Display',serif;font-size:32px;font-style:italic;color:var(--bark);margin-bottom:2px}
.pn{display:flex;gap:9px;justify-content:center;margin:14px 0}
.pd{width:13px;height:13px;border-radius:50%;border:2px solid var(--chukum)}
.pd.f{background:var(--bark);border-color:var(--bark)}
.pk{padding:15px;border-radius:11px;border:1.5px solid var(--sand);background:#fff;font-size:19px;font-weight:700;color:var(--bark);cursor:pointer;transition:all .15s}
.pk:hover{background:var(--chukum-lt);border-color:var(--chukum)}
.pk:active{transform:scale(.95)}
/* STAT */
.sc{background:rgba(255,255,255,.7);border-radius:var(--r);border:1px solid rgba(196,168,130,.3);padding:14px 16px;text-align:center}
.sn{font-family:'Playfair Display',serif;font-size:24px;color:var(--bark);font-weight:700}
.sl{font-size:11px;color:var(--muted);font-weight:500;margin-top:2px}
/* MISC */
.fx{display:flex;align-items:center}
.f1{flex:1}
.g8{gap:8px}.g12{gap:12px}.g16{gap:16px}
.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}
.tc{text-align:center}.tr{text-align:right}
.div{border:none;border-top:1px solid var(--sand);margin:14px 0}
.tag{display:inline-block;padding:2px 7px;border-radius:6px;background:var(--chukum-lt);color:var(--bark);font-size:11px;font-weight:600;margin:2px}
.mb-btn{padding:7px 13px;border-radius:8px;border:1.5px solid var(--sand);background:#fff;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;color:var(--text)}
.mb-btn.sel{background:var(--sage-lt);border-color:var(--sage);color:var(--bark)}
.mb-btn:hover:not(.sel){background:var(--chukum-lt)}
.img-ph{width:54px;height:54px;border-radius:9px;background:var(--chukum-lt);display:flex;align-items:center;justify-content:center;font-size:22px;border:2px dashed var(--sand)}
.img-pv{width:54px;height:54px;border-radius:9px;object-fit:cover;border:2px solid var(--sand)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-thumb{background:var(--sand);border-radius:3px}
/* SHIFT SCREEN */
.shift-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.shift-card{background:rgba(255,255,255,.85);backdrop-filter:blur(12px);border-radius:24px;padding:36px 32px;max-width:520px;width:100%;box-shadow:0 20px 60px var(--shadow);border:1px solid var(--sand);text-align:center}
/* CORTE */
.corte{background:#fff;font-family:monospace;font-size:12px;padding:16px;border:1px dashed var(--chukum);border-radius:var(--rs);max-width:380px;margin:0 auto}
.corte-h{text-align:center;margin-bottom:12px;border-bottom:2px solid #333;padding-bottom:8px}
.corte-sec{margin:10px 0;padding:8px 0;border-bottom:1px dashed #ccc}
.corte-r{display:flex;justify-content:space-between;padding:2px 0}
.corte-tot{font-weight:700;font-size:13px;display:flex;justify-content:space-between;border-top:2px solid #333;padding-top:6px;margin-top:6px}
`;

// ══════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ══════════════════════════════════════════════════════════════
const fmt = (n) => `$${Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtInt = (n) => `$${Number(n || 0).toFixed(0)}`;
const now = () => new Date();
const dateStr = (d = new Date()) => d.toLocaleDateString('es-MX', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
const timeStr = (d = new Date()) => d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
const fullDT = (d = new Date()) => `${dateStr(d)} ${timeStr(d)}`;
const isoDate = (d = new Date()) => d.toISOString().split('T')[0];

const FOOD_CATS = ["Desayunos Salados", "Desayunos Dulces", "Snacks", "Panadería"];
const BEV_CATS = ["Bebidas Frías", "Bebidas Calientes"];
const ALL_CATS = [...BEV_CATS, ...FOOD_CATS, "Otro"];
const ORDER_TYPES = ["Persona", "Mesa", "Para Llevar", "Delivery"];
const PAY_METHODS = ["Efectivo", "Tarjeta", "Transferencia"];
const TIP_PCTS = [0, 10, 15, 18, 20];

let USERS = [
  { id: 1, name: "Admin",    role: "admin",   pin: "1234", color: "#c4704a" },
  { id: 2, name: "Gerente",  role: "manager", pin: "5678", color: "#7a8c6e" },
  { id: 3, name: "Cajero 1", role: "cashier", pin: "9090", color: "#c4a882" },
  { id: 4, name: "Cocina",   role: "kitchen", pin: "6060", color: "#5c7fc4" },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Latte Frío", category: "Bebidas Frías", price: 75, emoji: "🥛", active: true, mgs: ["leche","size"] },
  { id: 2, name: "Honey Latte", category: "Bebidas Frías", price: 85, emoji: "🍯", active: true, mgs: ["leche"] },
  { id: 3, name: "Latte Moka", category: "Bebidas Frías", price: 85, emoji: "🍫", active: true, mgs: ["leche"] },
  { id: 4, name: "Dirty Chai Latte", category: "Bebidas Frías", price: 85, emoji: "🌿", active: true, mgs: ["leche"] },
  { id: 5, name: "Banana Caramel", category: "Bebidas Frías", price: 85, emoji: "🍌", active: true, mgs: ["leche"] },
  { id: 6, name: "Espresso", category: "Bebidas Calientes", price: 40, emoji: "☕", active: true, mgs: [] },
  { id: 7, name: "Doppio", category: "Bebidas Calientes", price: 50, emoji: "☕", active: true, mgs: [] },
  { id: 8, name: "Americano", category: "Bebidas Calientes", price: 55, emoji: "☕", active: true, mgs: ["size"] },
  { id: 9, name: "Capuccino", category: "Bebidas Calientes", price: 60, emoji: "☕", active: true, mgs: ["leche","size"] },
  { id: 10, name: "Honey Capuccino", category: "Bebidas Calientes", price: 65, emoji: "🍯", active: true, mgs: ["leche"] },
  { id: 11, name: "Chai Latte Cal.", category: "Bebidas Calientes", price: 65, emoji: "🌿", active: true, mgs: ["leche"] },
  { id: 12, name: "Dirty Chai Cal.", category: "Bebidas Calientes", price: 75, emoji: "🌿", active: true, mgs: ["leche"] },
  { id: 13, name: "Latte Moka Cal.", category: "Bebidas Calientes", price: 80, emoji: "🍫", active: true, mgs: ["leche"] },
  { id: 14, name: "Grilled Cheese", category: "Desayunos Salados", price: 95, emoji: "🧀", active: true, mgs: [] },
  { id: 15, name: "Toast Humus", category: "Desayunos Salados", price: 95, emoji: "🫛", active: true, mgs: [] },
  { id: 16, name: "Sándwich Mozarella", category: "Desayunos Salados", price: 125, emoji: "🥪", active: true, mgs: [] },
  { id: 17, name: "Bagel Jamón/Queso", category: "Desayunos Salados", price: 135, emoji: "🥯", active: true, mgs: [] },
  { id: 18, name: "Entrada Humus", category: "Desayunos Salados", price: 110, emoji: "🫛", active: true, mgs: [] },
  { id: 19, name: "Waffle Blueberries", category: "Desayunos Dulces", price: 95, emoji: "🧇", active: true, mgs: [] },
  { id: 20, name: "Waffle Cacahuate", category: "Desayunos Dulces", price: 95, emoji: "🧇", active: true, mgs: [] },
  { id: 21, name: "Concha", category: "Panadería", price: 50, emoji: "🍞", active: true, mgs: [], cost: 50 },
  { id: 22, name: "Croissant", category: "Panadería", price: 50, emoji: "🥐", active: true, mgs: [], cost: 50 },
  { id: 23, name: "Croissant Limón", category: "Panadería", price: 50, emoji: "🥐", active: true, mgs: [], cost: 50 },
  { id: 24, name: "Pay de Nuez", category: "Panadería", price: 50, emoji: "🥧", active: true, mgs: [], cost: 50 },
  { id: 25, name: "Carlota de Limón", category: "Panadería", price: 50, emoji: "🍋", active: true, mgs: [], cost: 50 },
];

const INIT_MGS = {
  leche: { id: "leche", name: "Leche", type: "single", options: [
    { id: "l1", name: "Entera", priceAdj: 0 }, { id: "l2", name: "Descremada", priceAdj: 0 },
    { id: "l3", name: "Avena", priceAdj: 15 }, { id: "l4", name: "Almendra", priceAdj: 15 },
    { id: "l5", name: "Coco", priceAdj: 15 }, { id: "l6", name: "Sin leche", priceAdj: 0 },
  ]},
  size: { id: "size", name: "Tamaño", type: "single", options: [
    { id: "s1", name: "8oz", priceAdj: 0 }, { id: "s2", name: "12oz", priceAdj: 10 }, { id: "s3", name: "16oz", priceAdj: 20 },
  ]},
  extras: { id: "extras", name: "Extras", type: "multi", options: [
    { id: "e1", name: "Extra queso", priceAdj: 20 }, { id: "e2", name: "Aguacate", priceAdj: 25 },
    { id: "e3", name: "Extra miel", priceAdj: 10 }, { id: "e4", name: "Nutella", priceAdj: 20 },
  ]},
};

const INIT_INVENTORY = [
  { id: 1, name: "Café en grano 1kg", category: "Insumos", barcode: "7501234567890", stock: 5, minStock: 2, unit: "kg", cost: 280 },
  { id: 2, name: "Leche entera 1L", category: "Lácteos", barcode: "7509876543210", stock: 12, minStock: 5, unit: "L", cost: 25 },
  { id: 3, name: "Leche de avena 1L", category: "Lácteos", barcode: "7504321098765", stock: 8, minStock: 4, unit: "L", cost: 65 },
  { id: 4, name: "Galletas choco", category: "Snacks", barcode: "7501122334455", stock: 24, minStock: 10, unit: "pz", cost: 18 },
  { id: 5, name: "Bolsa fruta mixta", category: "Frutas", barcode: "7509988776655", stock: 6, minStock: 3, unit: "bolsa", cost: 45 },
];

// ══════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════
// ── Supabase Integration ────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("pos");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [mgs, setMgs] = useState(INIT_MGS);
  const [inventory, setInventory] = useState(INIT_INVENTORY);
  const [shift, setShift] = useState(null);
  const [shiftOrders, setShiftOrders] = useState([]);
  const [allShifts, setAllShifts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [folioCounter, setFolioCounter] = useState(1);
  const [costosHistory, setCostosHistory] = useState([]);
  const [usersVersion, setUsersVersion] = useState(0);
  const refreshUsers = () => { setUsersVersion(v => v + 1); };

  useEffect(() => {
    async function initSupabase() {
      const [{ data: p }, { data: inv }, { data: ord }, { data: s }, { data: u }] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('shifts').select('*').order('id', { ascending: false }).limit(20),
        supabase.from('users').select('*')
      ]);
      if (p?.length > 0) setProducts(p);
      if (inv?.length > 0) setInventory(inv);
      if (s?.length > 0) {
        setAllShifts(s);
        const op = s.find(x => x.status === 'open');
        if (op) setShift(op);
      }
      if (ord?.length > 0) setShiftOrders(ord);
      if (u?.length > 0) USERS = u; // Global update
    }
    initSupabase();
  }, []);

  useEffect(() => {
    const ch = supabase.channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        setShiftOrders(prev => {
          const o = payload.new;
          if (prev.find(x => x.id === o.id)) return prev.map(x => x.id === o.id ? o : x);
          return [o, ...prev];
        });
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const addOrder = async (order) => {
    setShiftOrders(prev => [order, ...prev]);
    await supabase.from('orders').insert([order]);
  };

  const updateOrder = async (id, changes) => {
    setShiftOrders(prev => prev.map(o => o.id === id ? { ...o, ...changes } : o));
    await supabase.from('orders').update(changes).eq('id', id);
  };

  const canSee = (t) => {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "manager") return ["pos","orders","inventory","costos","gastos","balance","reports","catalog"].includes(t);
    // cashier: full pos + orders (cuentas)
    if (user.role === "cashier") return ["pos","orders"].includes(t);
    // kitchen: only kitchen view
    if (user.role === "kitchen") return t === "kitchen";
    return false;
  };

  if (!user) return <LoginScreen onLogin={(u) => { setUser(u); setTab("pos"); }} />;

  const shiftOpen = shift && shift.status === "open";
  const canManageShift = user.role === "admin" || user.role === "manager";

  const NAV_ITEMS = [
    { id: "pos",       icon: "🛒", label: "Pedido" },
    { id: "orders",    icon: "📋", label: "Cuentas" },
    { id: "inventory", icon: "📦", label: "Inventario" },
    { id: "costos",    icon: "🧮", label: "Costos" },
    { id: "gastos",    icon: "🧾", label: "Gastos" },
    { id: "balance",   icon: "💼", label: "Balance" },
    { id: "catalog",   icon: "📝", label: "Catálogo" },
    { id: "reports",   icon: "📊", label: "Reportes" },
    { id: "config",    icon: "⚙️",  label: "Config" },
    { id: "kitchen",   icon: "🍳",  label: "Cocina" },
  ].filter(t => canSee(t.id));

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <nav className="nav">
          <span className="nav-logo">mesa teresa</span>

          {/* ── ICON SIDEBAR NAV ── */}
          <div className="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`snav-item ${tab === item.id ? "active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <span className="snav-icon">{item.icon}</span>
                <span className="snav-label">{item.label}</span>
              </button>
            ))}

            {/* divider */}
            <div className="snav-divider" />

            {/* Cerrar / Abrir turno */}
            {canManageShift && shiftOpen && (
              <button
                className={`snav-item danger ${tab === "cerrar_turno" ? "active" : ""}`}
                onClick={() => setTab("cerrar_turno")}
              >
                <span className="snav-icon">🔴</span>
                <span className="snav-label">Cerrar turno</span>
              </button>
            )}
            {canManageShift && !shiftOpen && (
              <button
                className="snav-item success"
                onClick={() => setTab("pos")}
              >
                <span className="snav-icon">🟢</span>
                <span className="snav-label">Abrir turno</span>
              </button>
            )}
          </div>

          {/* right side: shift status + user */}
          <span className={`shift-badge ${shiftOpen ? "shift-open" : "shift-closed"}`}>
            {shiftOpen ? "✅ Abierto" : "⛔ Cerrado"}
          </span>
          <span className="role-badge" style={{ marginLeft: 5 }}>{user.name}</span>
          <button
            className="btn btn-sm"
            style={{ marginLeft: 5, background: "rgba(255,255,255,.08)", color: "var(--sand)", border: "1px solid rgba(255,255,255,.12)", fontSize: 11 }}
            onClick={() => setUser(null)}
          >Salir</button>
        </nav>

        {tab === "pos" && (
          <POSScreen products={products} mgs={mgs} shift={shift} setShift={setShift}
            shiftOrders={shiftOrders} setShiftOrders={setShiftOrders}
            addOrder={addOrder}
            allShifts={allShifts} setAllShifts={setAllShifts} user={user}
            folioCounter={folioCounter} setFolioCounter={setFolioCounter}
            inventory={inventory} />
        )}
        {tab === "orders" && (
          <OrdersScreen shiftOrders={shiftOrders} setShiftOrders={setShiftOrders}
            updateOrder={updateOrder}
            inventory={inventory} setInventory={setInventory} />
        )}
        {tab === "inventory" && (
          <InventoryScreen inventory={inventory} setInventory={setInventory} user={user} />
        )}
        {tab === "costos" && (
          <CostosScreen products={products} costosHistory={costosHistory} setCostosHistory={setCostosHistory} />
        )}
        {tab === "gastos" && (
          <GastosScreen gastos={gastos} setGastos={setGastos} user={user} />
        )}
        {tab === "catalog" && (
          <CatalogScreen products={products} setProducts={setProducts} mgs={mgs} setMgs={setMgs} user={user} />
        )}
        {tab === "reports" && (
          <ReportsScreen allShifts={allShifts} products={products} />
        )}
        {tab === "balance" && (user.role === "admin" || user.role === "manager") && (
          <BalanceScreen allShifts={allShifts} purchases={purchases} setPurchases={setPurchases}
            fixedExpenses={fixedExpenses} setFixedExpenses={setFixedExpenses} products={products}
            gastos={gastos}
            isAdmin={user.role === "admin"} />
        )}
        {tab === "cerrar_turno" && canManageShift && (
          <ShiftClosePanel
            shift={shift} setShift={setShift}
            shiftOrders={shiftOrders}
            allShifts={allShifts} setAllShifts={setAllShifts}
            user={user} onDone={() => setTab("reports")}
          />
        )}
        {tab === "config" && (
          <ConfigScreen mgs={mgs} setMgs={setMgs} user={user} refreshUsers={refreshUsers} usersVersion={usersVersion} />
        )}
        {tab === "kitchen" && (
          <KitchenScreen shiftOrders={shiftOrders} setShiftOrders={setShiftOrders} updateOrder={updateOrder} />
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const handleKey = (k) => {
    if (k === "del") { setPin(p => p.slice(0, -1)); setErr(false); return; }
    if (k === "ok") {
      const u = USERS.find(u => u.pin === pin);
      if (u) { onLogin(u); setPin(""); }
      else { setErr(true); setTimeout(() => { setPin(""); setErr(false); }, 700); }
      return;
    }
    if (pin.length >= 8) return;
    setPin(pin + k);
  };

  return (
    <>
      <style>{style}</style>
      <div className="ls">
        <div className="lc">
          <div className="ll">mesa teresa</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Sistema POS · Ingresa tu PIN</div>
          <div className="pn" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 12 }}>
            {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
              <div key={i} className={`pd ${i < pin.length ? "f" : ""}`} style={err ? { borderColor: "#e05555", background: i < pin.length ? "#e05555" : "" } : {}} />
            ))}
          </div>
          {err && <div style={{ color: "#e05555", fontSize: 12, marginBottom: 6 }}>PIN incorrecto</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
            {["1","2","3","4","5","6","7","8","9","✓","0","⌫"].map((k, i) => (
              <button key={i} className="pk" style={k === "✓" ? { background: "var(--sage)", color: "white" } : {}}
                onClick={() => handleKey(k === "⌫" ? "del" : k === "✓" ? "ok" : k)}>{k}</button>
            ))}
          </div>
          <div style={{ marginTop: 18, fontSize: 11, color: "var(--muted)" }}>Pin variable. Presiona ✓ para entrar.</div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SHIFT GATE (Inicio/Cierre de turno)
// ══════════════════════════════════════════════════════════════
function ShiftGate({ shift, setShift, allShifts, setAllShifts, shiftOrders, user }) {
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [openCash, setOpenCash] = useState("");
  const [showCorte, setShowCorte] = useState(null);

  const canManageShift = user.role === "admin" || user.role === "manager";

  const verifyPin = (callback) => {
    const u = USERS.find(u => u.pin === pin && (u.role === "admin" || u.role === "manager"));
    if (u) { setPin(""); setPinErr(false); callback(u); }
    else { setPinErr(true); }
  };

  const doOpen = () => verifyPin((u) => {
    const s = {
      id: Date.now(), openedBy: u.name, openedAt: fullDT(), openedAtTs: Date.now(),
      openingCash: Number(openCash) || 0, status: "open", date: isoDate(),
    };
    setShift(s); setOpening(false); setOpenCash("");
  });

  const buildCorte = () => {
    // Only count orders that have been paid (paid === true)
    const paid = shiftOrders.filter(o => o.paid === true);
    const totEfec = paid.filter(o => o.payment === "Efectivo").reduce((s, o) => s + o.total, 0);
    const totCard = paid.filter(o => o.payment === "Tarjeta").reduce((s, o) => s + o.total, 0);
    const totTrans = paid.filter(o => o.payment === "Transferencia").reduce((s, o) => s + o.total, 0);
    const tipCard = paid.filter(o => o.payment === "Tarjeta").reduce((s, o) => s + (o.tip || 0), 0);
    const totSales = totEfec + totCard + totTrans;
    const foodSales = paid.reduce((s, o) => s + o.items.filter(i => FOOD_CATS.includes(i.prod.category)).reduce((a, i) => a + i.price * i.qty, 0), 0);
    const bevSales = paid.reduce((s, o) => s + o.items.filter(i => BEV_CATS.includes(i.prod.category)).reduce((a, i) => a + i.price * i.qty, 0), 0);
    const prodCount = {};
    paid.forEach(o => o.items.forEach(i => {
      if (!prodCount[i.prod.name]) prodCount[i.prod.name] = { qty: 0, total: 0, cat: i.prod.category };
      prodCount[i.prod.name].qty += i.qty;
      prodCount[i.prod.name].total += i.price * i.qty;
    }));
    const pendingCount = shiftOrders.filter(o => !o.paid && o.status !== "cancelada").length;
    // Canceled orders — included in corte for audit trail
    const canceled = shiftOrders.filter(o => o.status === "cancelada");
    const totCanceled = canceled.reduce((s, o) => s + o.total, 0);
    return { totEfec, totCard, totTrans, tipCard, totSales, foodSales, bevSales, prodCount, orderCount: paid.length, pendingCount, canceled, totCanceled, openingCash: shift.openingCash, expectedCash: shift.openingCash + totEfec };
  };

  const doClose = () => verifyPin((u) => {
    const corte = buildCorte();
    const closedShift = { ...shift, closedBy: u.name, closedAt: fullDT(), closedAtTs: Date.now(), status: "closed", corte };
    setAllShifts(prev => [closedShift, ...prev]);
    setShift(null);
    setShowCorte(corte);
    setClosing(false);
  });

  return (
    <div className="shift-screen">
      <div className="shift-card">
        <div style={{ fontSize: 48, marginBottom: 8 }}>☕</div>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontStyle: "italic", color: "var(--bark)", marginBottom: 4 }}>mesa teresa</div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>{dateStr()}</div>

        {!shift ? (
          <>
            <div style={{ background: "rgba(224,85,85,.1)", borderRadius: 12, padding: "14px 20px", marginBottom: 20, color: "#c03030", fontSize: 14 }}>
              ⛔ No hay turno activo. {canManageShift ? "Abre el turno para comenzar." : "Espera a que el gerente o admin abra el turno."}
            </div>
            {canManageShift && (
              <button className="btn btn-green" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}
                onClick={() => setOpening(true)}>🟢 Abrir Turno</button>
            )}
          </>
        ) : (
          <>
            <div style={{ background: "rgba(122,140,110,.15)", borderRadius: 12, padding: "14px 20px", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "var(--bark)", marginBottom: 4 }}>✅ Turno activo</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Abierto por: {shift.openedBy}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Desde: {shift.openedAt}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Fondo inicial: {fmt(shift.openingCash)}</div>
              <div style={{ fontSize: 13, marginTop: 6, fontWeight: 700, color: "var(--bark)" }}>Órdenes: {shiftOrders.length}</div>
            </div>
            {/* Cashier sees a "ready" state — shift management is not their role */}
            {!canManageShift && (
              <div style={{ background: "rgba(122,140,110,.12)", borderRadius: 10, padding: "12px 16px", textAlign: "center", color: "var(--sage)", fontSize: 14, fontWeight: 600 }}>
                🟢 Turno activo — selecciona <strong>Pedido</strong> o <strong>Cuentas</strong> en la barra superior para comenzar
              </div>
            )}
            {canManageShift && (
              <button className="btn btn-danger" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}
                onClick={() => setClosing(true)}>🔴 Cerrar Turno y Corte de Caja</button>
            )}
          </>
        )}

        {/* Open modal */}
        {opening && (
          <div className="mo">
            <div className="mc">
              <div className="mo-title">🟢 Abrir Turno</div>
              <div className="fg">
                <label className="lbl">Fondo de caja inicial ($)</label>
                <input className="inp" type="number" value={openCash} onChange={e => setOpenCash(e.target.value)} placeholder="Ej: 500" />
              </div>
              <div className="fg">
                <label className="lbl">PIN de gerente o administrador</label>
                <input className="inp" type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" onKeyDown={e => e.key === "Enter" && doOpen()} />
                {pinErr && <div style={{ color: "#e05555", fontSize: 12, marginTop: 4 }}>PIN incorrecto o sin permisos</div>}
              </div>
              <div className="fx g8">
                <button className="btn btn-green f1" style={{ justifyContent: "center" }} onClick={doOpen}>Confirmar apertura</button>
                <button className="btn btn-outline" onClick={() => { setOpening(false); setPin(""); setPinErr(false); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Close modal */}
        {closing && (
          <div className="mo">
            <div className="mc mc-lg">
              <div className="mo-title">🔴 Cerrar Turno</div>
              <div style={{ background: "rgba(224,85,85,.07)", borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 13 }}>
                ⚠️ Al cerrar el turno se generará el corte de caja. Esta acción no se puede deshacer.
              </div>
              {(() => {
                const c = buildCorte();
                return (
                  <div style={{ marginBottom: 16 }}>
                    <div className="g3" style={{ marginBottom: 12 }}>
                      <div className="sc"><div className="sn">{fmt(c.totEfec)}</div><div className="sl">Efectivo</div></div>
                      <div className="sc"><div className="sn">{fmt(c.totCard)}</div><div className="sl">Tarjeta</div></div>
                      <div className="sc"><div className="sn">{fmt(c.totTrans)}</div><div className="sl">Transfer.</div></div>
                    </div>
                    <div className="g2">
                      <div className="sc"><div className="sn">{fmt(c.totSales)}</div><div className="sl">Total ventas</div></div>
                      <div className="sc"><div className="sn" style={{ color: "var(--terra)" }}>{fmt(c.tipCard)}</div><div className="sl">Propinas tarjeta (a repartir)</div></div>
                    </div>
                  </div>
                );
              })()}
              <div className="fg">
                <label className="lbl">PIN de gerente o administrador para confirmar cierre</label>
                <input className="inp" type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" onKeyDown={e => e.key === "Enter" && doClose()} />
                {pinErr && <div style={{ color: "#e05555", fontSize: 12, marginTop: 4 }}>PIN incorrecto</div>}
              </div>
              <div className="fx g8">
                <button className="btn btn-danger f1" style={{ justifyContent: "center" }} onClick={doClose}>Confirmar cierre y generar corte</button>
                <button className="btn btn-outline" onClick={() => { setClosing(false); setPin(""); setPinErr(false); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Corte result */}
        {showCorte && (
          <div className="mo">
            <div className="mc mc-lg">
              <div className="mo-title">📄 Corte de Caja Generado</div>
              <CorteView corte={showCorte} shift={shift || {}} orders={shiftOrders} />
              <div className="fx g8 mt16">
                <button className="btn btn-primary f1" onClick={() => printCorte(showCorte, shiftOrders)}>🖨️ Imprimir corte</button>
                <button className="btn btn-sage" onClick={() => exportCorteXLSX(showCorte, shiftOrders)}>📊 Exportar Excel</button>
                <button className="btn btn-outline" onClick={() => setShowCorte(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SHIFT CLOSE PANEL  — dedicated full-page accessible from nav
// ══════════════════════════════════════════════════════════════
function ShiftClosePanel({ shift, setShift, shiftOrders, allShifts, setAllShifts, user, onDone }) {
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [corte, setCorte] = useState(null);

  const buildCorte = () => {
    const paid = shiftOrders.filter(o => o.paid === true);
    const totEfec = paid.filter(o => o.payment === "Efectivo").reduce((s, o) => s + o.total, 0);
    const totCard = paid.filter(o => o.payment === "Tarjeta").reduce((s, o) => s + o.total, 0);
    const totTrans = paid.filter(o => o.payment === "Transferencia").reduce((s, o) => s + o.total, 0);
    const tipCard = paid.filter(o => o.payment === "Tarjeta").reduce((s, o) => s + (o.tip || 0), 0);
    const totSales = totEfec + totCard + totTrans;
    const foodSales = paid.reduce((s, o) => s + o.items.filter(i => FOOD_CATS.includes(i.prod.category)).reduce((a, i) => a + i.price * i.qty, 0), 0);
    const bevSales = paid.reduce((s, o) => s + o.items.filter(i => BEV_CATS.includes(i.prod.category)).reduce((a, i) => a + i.price * i.qty, 0), 0);
    const prodCount = {};
    paid.forEach(o => o.items.forEach(i => {
      if (!prodCount[i.prod.name]) prodCount[i.prod.name] = { qty: 0, total: 0, cat: i.prod.category };
      prodCount[i.prod.name].qty += i.qty;
      prodCount[i.prod.name].total += i.price * i.qty;
    }));
    const pendingCount = shiftOrders.filter(o => !o.paid && o.status !== "cancelada").length;
    const canceled = shiftOrders.filter(o => o.status === "cancelada");
    const totCanceled = canceled.reduce((s, o) => s + o.total, 0);
    return { totEfec, totCard, totTrans, tipCard, totSales, foodSales, bevSales, prodCount, orderCount: paid.length, pendingCount, canceled, totCanceled, openingCash: shift?.openingCash || 0, expectedCash: (shift?.openingCash || 0) + totEfec };
  };

  const preview = buildCorte();

  const doClose = () => {
    const u = USERS.find(u => u.pin === pin && (u.role === "admin" || u.role === "manager"));
    if (!u) { setPinErr(true); return; }
    const c = buildCorte();
    const closedShift = { ...shift, closedBy: u.name, closedAt: fullDT(), closedAtTs: Date.now(), status: "closed", corte: c };
    setAllShifts(prev => [closedShift, ...prev]);
    setShift(null);
    setCorte(c);
    setConfirmed(true);
    setPin(""); setPinErr(false);
  };

  if (!shift) {
    return (
      <div className="sp" style={{ maxWidth: 600 }}>
        <div className="card tc" style={{ padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontFamily: "Playfair Display,serif", fontSize: 20, color: "var(--bark)", marginBottom: 8 }}>No hay turno activo</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>El turno ya fue cerrado o no se ha iniciado uno nuevo.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp" style={{ maxWidth: 760 }}>
      <div className="sec-title">🔴 Cerrar Turno y Corte de Caja</div>
      <div className="sec-sub">Revisa el resumen del turno y confirma el cierre con tu PIN</div>

      {/* Shift info */}
      <div className="card mb16" style={{ borderTop: "3px solid var(--terra)" }}>
        <div className="g4">
          <div className="sc"><div className="sn">{fmt(preview.totSales)}</div><div className="sl">Total ventas</div></div>
          <div className="sc"><div className="sn">{preview.orderCount}</div><div className="sl">Órdenes</div></div>
          <div className="sc"><div className="sn" style={{ color: "var(--gold)" }}>{fmt(preview.tipCard)}</div><div className="sl">Propinas tarjeta</div></div>
          <div className="sc"><div className="sn" style={{ color: "var(--sage)" }}>{fmt(preview.expectedCash - preview.tipCard)}</div><div className="sl">Efectivo en caja</div></div>
        </div>
      </div>

      <div className="g2 mb16">
        {/* Desglose por método */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Ventas por método de pago</div>
          {[["💵 Efectivo", preview.totEfec], ["💳 Tarjeta", preview.totCard], ["📱 Transferencia", preview.totTrans]].map(([l,v]) => (
            <div key={l} className="fx g8" style={{ marginBottom: 8, padding: "8px 12px", background: "var(--chukum-lt)", borderRadius: 9 }}>
              <span className="f1" style={{ fontSize: 13 }}>{l}</span>
              <span style={{ fontWeight: 700 }}>{fmt(v)}</span>
              <span className="bdg bdg-b">{preview.totSales > 0 ? ((v/preview.totSales)*100).toFixed(0) : 0}%</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(196,112,74,.1)", borderRadius: 9, fontSize: 13 }}>
            <div className="fx g8"><span className="f1">🟡 Propinas (devolver a meseros)</span><span style={{ fontWeight: 700, color: "var(--terra)" }}>{fmt(preview.tipCard)}</span></div>
          </div>
        </div>

        {/* Alimentos vs Bebidas */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Ventas por tipo</div>
          {[["🍽️ Alimentos", preview.foodSales], ["☕ Bebidas", preview.bevSales]].map(([l,v]) => (
            <div key={l} className="fx g8" style={{ marginBottom: 8, padding: "8px 12px", background: "var(--chukum-lt)", borderRadius: 9 }}>
              <span className="f1" style={{ fontSize: 13 }}>{l}</span>
              <span style={{ fontWeight: 700 }}>{fmt(v)}</span>
              <span className="bdg bdg-g">{preview.totSales > 0 ? ((v/preview.totSales)*100).toFixed(0) : 0}%</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(122,140,110,.1)", borderRadius: 9, fontSize: 13 }}>
            <div className="fx g8"><span className="f1">Fondo inicial</span><span style={{ fontWeight: 700 }}>{fmt(preview.openingCash)}</span></div>
            <div className="fx g8 mt8"><span className="f1">Efectivo esperado en caja</span><span style={{ fontWeight: 800, color: "var(--sage)" }}>{fmt(preview.expectedCash - preview.tipCard)}</span></div>
          </div>
        </div>
      </div>

      {/* Productos del turno */}
      <div className="card mb16">
        <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Productos vendidos en el turno</div>
        {Object.keys(preview.prodCount).length === 0
          ? <div style={{ color: "var(--muted)", fontSize: 13 }}>Sin productos vendidos en este turno</div>
          : (
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead><tr><th>Producto</th><th>Categoría</th><th>Cant.</th><th>Total</th><th>%</th></tr></thead>
                <tbody>
                  {Object.entries(preview.prodCount).sort((a,b) => b[1].total - a[1].total).map(([n, v]) => (
                    <tr key={n}>
                      <td><strong>{n}</strong></td>
                      <td><span className="tag">{v.cat}</span></td>
                      <td style={{ fontWeight: 700 }}>{v.qty}</td>
                      <td style={{ fontWeight: 700, color: "var(--terra)" }}>{fmt(v.total)}</td>
                      <td style={{ fontSize: 12, color: "var(--muted)" }}>{preview.totSales > 0 ? ((v.total/preview.totSales)*100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Confirm close */}
      {!confirmed ? (
        <div className="card" style={{ borderTop: "3px solid #e05555", background: "rgba(224,85,85,.05)" }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: "#c03030", fontSize: 15 }}>⚠️ Confirmar cierre de turno</div>
          {preview.pendingCount > 0 && (
            <div style={{ background: "rgba(201,168,76,.15)", borderRadius: 9, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "var(--bark)" }}>
              ⚡ Hay <strong>{preview.pendingCount} cuenta{preview.pendingCount > 1 ? "s" : ""} pendiente{preview.pendingCount > 1 ? "s" : ""} por cobrar</strong> que no se incluirán en el corte. Se recomienda cobrarlas antes de cerrar.
            </div>
          )}
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
            Esta acción cerrará el turno definitivamente. Ingresa el PIN de gerente o administrador para continuar.
          </div>
          <div className="fg">
            <label className="lbl">PIN de confirmación</label>
            <input className="inp" type="password" value={pin} onChange={e => { setPin(e.target.value); setPinErr(false); }}
              placeholder="••••" style={{ maxWidth: 200 }} onKeyDown={e => e.key === "Enter" && doClose()} />
            {pinErr && <div style={{ color: "#e05555", fontSize: 12, marginTop: 4 }}>PIN incorrecto o sin permisos</div>}
          </div>
          <div className="fx g8">
            <button className="btn btn-danger" style={{ padding: "12px 24px", fontSize: 15 }} onClick={doClose}>
              🔴 Confirmar cierre y generar corte
            </button>
            <button className="btn btn-outline" onClick={onDone}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ borderTop: "3px solid var(--sage)" }}>
          <div style={{ fontWeight: 700, color: "var(--sage)", fontSize: 16, marginBottom: 12 }}>✅ Turno cerrado exitosamente</div>
          <CorteView corte={corte} shift={shift || {}} orders={shiftOrders} />
          <div className="fx g8 mt16" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => printCorte(corte, shiftOrders)}>🖨️ Imprimir corte</button>
            <button className="btn btn-sage" onClick={() => exportCorteXLSX(corte, shiftOrders)}>📊 Exportar Excel</button>
            <button className="btn btn-outline" onClick={onDone}>Ir a Reportes</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CORTE VIEW ──────────────────────────────────────────────
function CorteView({ corte, shift, orders }) {
  const foodPct = corte.totSales > 0 ? ((corte.foodSales / corte.totSales) * 100).toFixed(1) : 0;
  const bevPct = corte.totSales > 0 ? ((corte.bevSales / corte.totSales) * 100).toFixed(1) : 0;
  return (
    <div className="corte">
      <div className="corte-h">
        <div style={{ fontSize: 15, fontWeight: 700 }}>CORTE DE CAJA</div>
        <div style={{ fontSize: 13, fontStyle: "italic" }}>mesa teresa · @mesateresa_</div>
        <div style={{ fontSize: 11 }}>{shift.openedAt} → {shift.closedAt || fullDT()}</div>
        <div style={{ fontSize: 11 }}>Por: {shift.openedBy} / Cierre: {shift.closedBy}</div>
      </div>
      <div className="corte-sec">
        <div style={{ fontWeight: 700, marginBottom: 4 }}>VENTAS POR MÉTODO</div>
        <div className="corte-r"><span>💵 Efectivo</span><span>{fmt(corte.totEfec)}</span></div>
        <div className="corte-r"><span>💳 Tarjeta</span><span>{fmt(corte.totCard)}</span></div>
        <div className="corte-r"><span>📱 Transferencia</span><span>{fmt(corte.totTrans)}</span></div>
      </div>
      <div className="corte-sec">
        <div style={{ fontWeight: 700, marginBottom: 4 }}>VENTAS POR TIPO</div>
        <div className="corte-r"><span>🍽️ Alimentos</span><span>{fmt(corte.foodSales)} ({foodPct}%)</span></div>
        <div className="corte-r"><span>☕ Bebidas</span><span>{fmt(corte.bevSales)} ({bevPct}%)</span></div>
        <div className="corte-r"><span>📦 Órdenes totales</span><span>{corte.orderCount}</span></div>
      </div>
      <div className="corte-sec">
        <div style={{ fontWeight: 700, marginBottom: 4 }}>PROPINAS EN TARJETA</div>
        <div className="corte-r"><span>Propinas (devolver a meseros)</span><span>{fmt(corte.tipCard)}</span></div>
      </div>
      <div className="corte-sec">
        <div style={{ fontWeight: 700, marginBottom: 4 }}>CAJA EFECTIVO</div>
        <div className="corte-r"><span>Fondo inicial</span><span>{fmt(corte.openingCash)}</span></div>
        <div className="corte-r"><span>+ Ventas efectivo</span><span>{fmt(corte.totEfec)}</span></div>
        <div className="corte-r"><span>- Propinas a meseros</span><span>{fmt(corte.tipCard)}</span></div>
        <div className="corte-tot"><span>EN CAJA (esperado)</span><span>{fmt(corte.expectedCash - corte.tipCard)}</span></div>
      </div>
      <div className="corte-tot" style={{ fontSize: 14, marginTop: 8 }}>
        <span>TOTAL VENTAS DEL TURNO</span><span>{fmt(corte.totSales)}</span>
      </div>
      {/* Canceladas */}
      {corte.canceled && corte.canceled.length > 0 && (
        <div className="corte-sec" style={{ borderTop: "2px dashed #e05555", marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "#c03030" }}>🚫 CUENTAS CANCELADAS ({corte.canceled.length})</div>
          {corte.canceled.map((o, i) => (
            <div key={i} style={{ marginBottom: 6, paddingBottom: 6, borderBottom: "1px dashed #eee" }}>
              <div className="corte-r" style={{ color: "#c03030" }}>
                <span>{o.type}{o.ref ? ` — ${o.ref}` : ""}</span>
                <span style={{ fontWeight: 700 }}>-{fmt(o.total)}</span>
              </div>
              <div style={{ fontSize: 10, color: "#888" }}>
                {o.canceledAt} · Autorizó: {o.canceledBy}
              </div>
              {o.cancelReason && <div style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>Motivo: {o.cancelReason}</div>}
            </div>
          ))}
          <div className="corte-r" style={{ fontWeight: 700, color: "#c03030" }}>
            <span>TOTAL CANCELADO</span><span>{fmt(corte.totCanceled)}</span>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 11 }}>¡Gracias equipo! 🌿</div>
    </div>
  );
}

function printCorte(corte, orders) {
  const w = window.open("", "_blank", "width=400,height=700");
  if (!w) return;
  const foodPct = corte.totSales > 0 ? ((corte.foodSales / corte.totSales) * 100).toFixed(1) : 0;
  const bevPct = corte.totSales > 0 ? ((corte.bevSales / corte.totSales) * 100).toFixed(1) : 0;
  const rows = Object.entries(corte.prodCount).map(([n, v]) => `${n.padEnd(22)} ${String(v.qty).padStart(3)} ${fmt(v.total).padStart(10)}`).join("\n");
  var canceledLines = "";
  if (corte.canceled && corte.canceled.length > 0) {
    canceledLines += "CUENTAS CANCELADAS (" + corte.canceled.length + ")\n";
    corte.canceled.forEach(function(o) {
      canceledLines += "  " + o.type + (o.ref ? " - " + o.ref : "") + "    -" + fmt(o.total) + "\n";
      canceledLines += "  Autorizo: " + o.canceledBy + " · " + o.canceledAt + "\n";
      canceledLines += "  Motivo: " + (o.cancelReason || "Sin motivo") + "\n";
    });
    canceledLines += "Total cancelado: " + fmt(corte.totCanceled) + "\n";
    canceledLines += "================================================\n";
  }
  var body = [
    "================================================",
    "           CORTE DE CAJA",
    "       mesa teresa · @mesateresa_",
    "================================================",
    "VENTAS POR METODO DE PAGO",
    "  Efectivo:          " + fmt(corte.totEfec),
    "  Tarjeta:           " + fmt(corte.totCard),
    "  Transferencia:     " + fmt(corte.totTrans),
    "------------------------------------------------",
    "VENTAS POR TIPO",
    "  Alimentos:    " + fmt(corte.foodSales) + " (" + foodPct + "%)",
    "  Bebidas:      " + fmt(corte.bevSales) + " (" + bevPct + "%)",
    "  Ordenes:      " + corte.orderCount,
    "------------------------------------------------",
    "PROPINAS EN TARJETA",
    "  A devolver: " + fmt(corte.tipCard),
    "------------------------------------------------",
    "CAJA EFECTIVO",
    "  Fondo inicial:     " + fmt(corte.openingCash),
    "  + Ventas efectivo: " + fmt(corte.totEfec),
    "  - Propinas devol.: " + fmt(corte.tipCard),
    "  EN CAJA esperado:  " + fmt(corte.openingCash + corte.totEfec - corte.tipCard),
    "================================================",
    "TOTAL VENTAS TURNO:  " + fmt(corte.totSales),
    "================================================",
    canceledLines,
    "PRODUCTOS VENDIDOS",
    "Producto                 Qty    Importe",
    "----------------------------------------",
    rows,
    "================================================",
    "Gracias equipo! Mesa Teresa"
  ].join("\n");
  w.document.write("<pre style=\"font-family:monospace;font-size:12px;padding:16px;width:360px\">" + body + "</pre>");
  w.document.close(); w.print();
}

function exportCorteXLSX(corte, orders) {
  const rows = [
    ["CORTE DE CAJA - mesa teresa"],
    [],
    ["VENTAS POR MÉTODO"],
    ["Efectivo", corte.totEfec],
    ["Tarjeta", corte.totCard],
    ["Transferencia", corte.totTrans],
    [],
    ["VENTAS POR TIPO"],
    ["Alimentos", corte.foodSales, corte.totSales > 0 ? ((corte.foodSales / corte.totSales) * 100).toFixed(1) + "%" : ""],
    ["Bebidas", corte.bevSales, corte.totSales > 0 ? ((corte.bevSales / corte.totSales) * 100).toFixed(1) + "%" : ""],
    [],
    ["PROPINAS EN TARJETA", corte.tipCard],
    [],
    ["TOTAL VENTAS", corte.totSales],
    [],
    ...(corte.canceled && corte.canceled.length > 0 ? [
      ["CUENTAS CANCELADAS"],
      ["Tipo","Referencia","Total","Cancelado por","Fecha","Motivo"],
      ...corte.canceled.map(o => [o.type, o.ref || "", o.total, o.canceledBy, o.canceledAt, o.cancelReason || ""]),
      ["TOTAL CANCELADO", corte.totCanceled],
      [],
    ] : []),
    ["PRODUCTOS VENDIDOS"],
    ["Producto", "Categoría", "Cantidad", "Total"],
    ...Object.entries(corte.prodCount).map(([n, v]) => [n, v.cat, v.qty, v.total]),
  ];
  let csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `corte_caja_${isoDate()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════════════════════════
// POS SCREEN
// ══════════════════════════════════════════════════════════════
function POSScreen({ products, mgs, shift, setShift, shiftOrders, setShiftOrders, addOrder, allShifts, setAllShifts, user, folioCounter, setFolioCounter, inventory }) {
  const [cat, setCat] = useState("Todos");
  const [items, setItems] = useState([]);
  const [orderType, setOrderType] = useState("Persona");
  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");
  const [modModal, setModModal] = useState(null);

  if (!shift || shift.status !== "open") {
    return <ShiftGate shift={shift} setShift={setShift} allShifts={allShifts} setAllShifts={setAllShifts} shiftOrders={shiftOrders} user={user} />;
  }

  const active = products.filter(p => p.active);
  const cats = ["Todos", ...new Set(active.map(p => p.category))];
  const filtered = cat === "Todos" ? active : active.filter(p => p.category === cat);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const clickProd = (p) => {
    if (p.mgs && p.mgs.length > 0) setModModal({ prod: p });
    else openSpecModal(p, {}, 1);
  };

  const openSpecModal = (prod, mods, qty) => setModModal({ prod, mods, qty, specOnly: true });

  const addToOrder = (prod, mods, qty, spec) => {
    const adj = Object.values(mods).flat().reduce((s, o) => s + (o ? o.priceAdj || 0 : 0), 0);
    const modLabels = Object.values(mods).flat().filter(Boolean).map(o => o.name).join(", ");
    const key = `${prod.id}-${modLabels}-${spec || ""}`;
    setItems(prev => {
      const ex = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, prod, mods, modLabels, spec: spec || "", price: prod.price + adj, qty }];
    });
    setModModal(null);
  };

  const updQty = (key, d) => setItems(prev => prev.map(i => i.key === key ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));

  // Send order directly to Cuentas — assign consecutive folio
  const sendToCuentas = () => {
    if (!items.length) return;
    const folio = String(folioCounter).padStart(4, "0");
    setFolioCounter(n => n + 1);
    const order = {
      id: Date.now(), folio, items, total, type: orderType, ref, note,
      status: "pendiente",
      paid: false,
      createdAt: fullDT(),
      payment: null, cashReceived: null, change: null, tip: 0,
      user: user.name, shiftId: shift.id,
    };
    addOrder(order);
    setItems([]); setRef(""); setNote("");
  };

  // All types now show a reference field
  const refLabel = { "Mesa": "# Mesa", "Persona": "Nombre del cliente", "Para Llevar": "Nombre / # de pedido", "Delivery": "Dirección / Tel" };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 68px)", overflow: "hidden" }}>
      {/* LEFT — product grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {/* Tipo de pedido */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6 }}>Tipo de pedido</div>
          <div className="fx g8" style={{ flexWrap: "wrap" }}>
            {ORDER_TYPES.map(t => (
              <button key={t} className={`ct-btn ${orderType === t ? "active" : ""}`} onClick={() => { setOrderType(t); setRef(""); }}>{t}</button>
            ))}
          </div>
          {/* Reference field for ALL types */}
          <input className="inp" style={{ marginTop: 8, fontSize: 12 }}
            placeholder={refLabel[orderType] || "Referencia"} value={ref} onChange={e => setRef(e.target.value)} />
        </div>
        {/* Categories */}
        <div className="ct">
          {cats.map(c => <button key={c} className={`ct-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {/* Products grid */}
        <div className="g4">
          {filtered.map(p => {
            const invItem = inventory?.find(i => i.name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(i.name.toLowerCase()));
            const lowStock = invItem && invItem.stock <= invItem.minStock;
            const noStock  = invItem && invItem.stock === 0;
            return (
              <button key={p.id} className="pb" onClick={() => clickProd(p)}
                style={noStock ? { opacity: .5, position: "relative" } : lowStock ? { position: "relative" } : { position: "relative" }}>
                {lowStock && !noStock && <div style={{ position: "absolute", top: 4, right: 4, background: "#c9a84c", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "1px 5px" }}>BAJO</div>}
                {noStock && <div style={{ position: "absolute", top: 4, right: 4, background: "#e05555", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "1px 5px" }}>AGOTADO</div>}
                <div className="pb-em">{p.emoji}</div>
                <div className="pb-nm">{p.name}</div>
                <div className="pb-pr">{fmtInt(p.price)}</div>
                {p.mgs?.length > 0 && <div style={{ fontSize: 10, color: "var(--muted)" }}>+ opciones</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT — order summary */}
      <div style={{ width: 300, borderLeft: "1px solid var(--sand)", background: "rgba(255,255,255,.65)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "12px 14px", background: "var(--espresso)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ fontFamily: "Playfair Display,serif", fontStyle: "italic", color: "var(--chukum-lt)", fontSize: 15 }}>
            Pedido{ref ? ` — ${ref}` : ""}
          </div>
          <div className="fx g8" style={{ marginTop: 2, justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--sand)" }}>{orderType}</span>
            <span style={{ fontSize: 10, color: "rgba(196,168,130,.6)", fontWeight: 600 }}>Folio #{String(folioCounter).padStart(4,"0")}</span>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px" }}>
          {items.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 48, fontStyle: "italic" }}>
              Selecciona productos ☕
            </div>
          )}
          {items.map(item => (
            <div key={item.key} className="oi">
              <div className="oi-inf">
                <div className="oi-nm">{item.prod.emoji} {item.prod.name}</div>
                {item.modLabels && <div className="oi-mod">{item.modLabels}</div>}
                {item.spec && <div className="oi-mod" style={{ fontStyle: "italic", color: "var(--terra)" }}>📝 {item.spec}</div>}
              </div>
              <div className="fx g8" style={{ alignItems: "center" }}>
                <button className="qb" onClick={() => updQty(item.key, -1)}>−</button>
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                <button className="qb" onClick={() => updQty(item.key, 1)}>+</button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, minWidth: 52, textAlign: "right" }}>{fmtInt(item.price * item.qty)}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--sand)" }}>
          <input className="inp" placeholder="Nota de la orden..." value={note}
            onChange={e => setNote(e.target.value)} style={{ marginBottom: 8, fontSize: 12 }} />
          <div className="fx g8" style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 20, fontFamily: "Playfair Display,serif", color: "var(--espresso)" }}>{fmtInt(total)}</span>
          </div>
          <button
            className="btn btn-sage"
            style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 15, fontWeight: 800 }}
            onClick={sendToCuentas}
            disabled={!items.length}
          >
            📋 Enviar a Cuentas
          </button>
          <button className="btn btn-outline btn-sm"
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            onClick={() => { setItems([]); setRef(""); setNote(""); }}>
            Cancelar pedido
          </button>
        </div>
      </div>

      {/* MODIFIER + SPEC MODAL */}
      {modModal && (
        <ModSpecModal prod={modModal.prod} mgs={mgs} specOnly={modModal.specOnly}
          preMods={modModal.mods} preQty={modModal.qty}
          onConfirm={(mods, qty, spec) => addToOrder(modModal.prod, mods, qty, spec)}
          onClose={() => setModModal(null)} />
      )}
    </div>
  );
}

// ── MOD + SPEC MODAL ──────────────────────────────────────────
function ModSpecModal({ prod, mgs, specOnly, preMods, preQty, onConfirm, onClose }) {
  const [sels, setSels] = useState(preMods || {});
  const [qty, setQty] = useState(preQty || 1);
  const [spec, setSpec] = useState("");
  const [step, setStep] = useState(specOnly ? "spec" : "mods");

  const groups = (prod.mgs || []).map(g => mgs[g]).filter(Boolean);
  const adj = Object.values(sels).flat().reduce((s, o) => s + (o ? o.priceAdj || 0 : 0), 0);

  const toggle = (group, opt) => {
    setSels(prev => {
      if (group.type === "single") return { ...prev, [group.id]: [opt] };
      const cur = prev[group.id] || [];
      return { ...prev, [group.id]: cur.find(o => o.id === opt.id) ? cur.filter(o => o.id !== opt.id) : [...cur, opt] };
    });
  };

  return (
    <div className="mo">
      <div className="mc">
        <div className="mo-title">{prod.emoji} {prod.name}</div>
        {step === "mods" && (
          <>
            {groups.map(g => (
              <div key={g.id} style={{ marginBottom: 14 }}>
                <div className="lbl">{g.name} {g.type === "single" ? "(1 opción)" : "(varias)"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {g.options.map(opt => {
                    const sel = (sels[g.id] || []).find(o => o.id === opt.id);
                    return (
                      <button key={opt.id} className={`mb-btn ${sel ? "sel" : ""}`} onClick={() => toggle(g, opt)}>
                        {opt.name}{opt.priceAdj > 0 && <span style={{ color: "var(--terra)", fontWeight: 700 }}> +{fmtInt(opt.priceAdj)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={() => setStep("spec")}>Continuar →</button>
          </>
        )}
        {step === "spec" && (
          <>
            <div className="fg">
              <label className="lbl">📝 Especificaciones del cliente</label>
              <textarea className="inp" rows={3} placeholder="Ej: Sin azúcar, extra caliente, poca leche, sin hielo, doble shot..."
                value={spec} onChange={e => setSpec(e.target.value)} style={{ resize: "none" }} />
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Escribe cualquier personalización adicional</div>
            </div>
            <div className="fx g8" style={{ alignItems: "center", marginBottom: 14 }}>
              <div className="lbl" style={{ marginBottom: 0 }}>Cantidad:</div>
              <button className="qb" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontWeight: 700, fontSize: 17, minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button className="qb" onClick={() => setQty(q => q + 1)}>+</button>
              <span style={{ marginLeft: "auto", fontWeight: 800, fontSize: 17, fontFamily: "Playfair Display,serif", color: "var(--espresso)" }}>
                {fmtInt((prod.price + adj) * qty)}
              </span>
            </div>
            <div className="fx g8">
              {!specOnly && <button className="btn btn-outline btn-sm" onClick={() => setStep("mods")}>← Atrás</button>}
              <button className="btn btn-accent f1" style={{ justifyContent: "center" }}
                onClick={() => onConfirm(sels, qty, spec)}>Agregar al pedido</button>
              <button className="btn btn-outline btn-sm" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── PAYMENT MODAL ────────────────────────────────────────────
function PayModal({ total, onPay, onPayNoPrint, onClose }) {
  const [method, setMethod]     = useState("Efectivo");
  const [cash, setCash]         = useState("");
  const [tipPct, setTipPct]     = useState(0);
  const [customTip, setCustomTip] = useState(""); // manual % input
  const [showCustomTip, setShowCustomTip] = useState(false);

  // Discount state
  const [discountOpen, setDiscountOpen]     = useState(false);
  const [discountType, setDiscountType]     = useState("porcentaje"); // porcentaje | fijo
  const [discountVal, setDiscountVal]       = useState("");
  const [discountFor, setDiscountFor]       = useState("");
  const [discountNote, setDiscountNote]     = useState(""); // familia/amigo/mesa/etc
  const [discountPin, setDiscountPin]       = useState("");
  const [discountErr, setDiscountErr]       = useState("");
  const [discountApplied, setDiscountApplied] = useState(null); // { amount, pct, for, note, authorizedBy }

  // Effective tip
  const activeTipPct = showCustomTip ? (parseFloat(customTip) || 0) : tipPct;
  const tipAmt = Math.round(total * activeTipPct / 100);

  // Effective discount
  const discountAmt = discountApplied ? discountApplied.amount : 0;
  const netTotal = Math.max(0, total - discountAmt);
  const chargeTotal = netTotal + tipAmt;
  const change = method === "Efectivo" && cash ? parseFloat(cash) - chargeTotal : 0;
  const quickAmts = [...new Set([chargeTotal, Math.ceil(chargeTotal/50)*50, Math.ceil(chargeTotal/100)*100, Math.ceil(chargeTotal/200)*200])];

  const isDisabled = method === "Efectivo" && (!cash || parseFloat(cash) < chargeTotal);
  const buildArgs = () => [method, parseFloat(cash) || chargeTotal, tipAmt, discountApplied];

  // Apply discount with PIN verification
  const applyDiscount = () => {
    if (!discountFor.trim()) { setDiscountErr("Escribe para quién es el descuento."); return; }
    if (!discountVal || parseFloat(discountVal) <= 0) { setDiscountErr("Ingresa un monto o porcentaje válido."); return; }
    const auth = USERS.find(u => u.pin === discountPin && (u.role === "admin" || u.role === "manager"));
    if (!auth) { setDiscountErr("PIN incorrecto — se requiere gerente o admin."); return; }
    let amt = 0;
    if (discountType === "porcentaje") {
      const pct = Math.min(100, parseFloat(discountVal));
      amt = Math.round(total * pct / 100);
    } else {
      amt = Math.min(total, parseFloat(discountVal));
    }
    setDiscountApplied({ amount: amt, type: discountType, val: parseFloat(discountVal), for: discountFor.trim(), note: discountNote.trim(), authorizedBy: auth.name });
    setDiscountOpen(false); setDiscountPin(""); setDiscountErr("");
  };

  const removeDiscount = () => { setDiscountApplied(null); setDiscountVal(""); setDiscountFor(""); setDiscountNote(""); setDiscountPin(""); };

  return (
    <div className="mo">
      <div className="mc" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="mo-title">💳 Cobrar cuenta</div>

        {/* Original total */}
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "Playfair Display,serif", color: "var(--espresso)", textAlign: "center", marginBottom: 4 }}>
          {fmt(total)}
        </div>

        {/* ── DESCUENTO BANNER ── */}
        {discountApplied ? (
          <div style={{ background: "rgba(122,140,110,.15)", border: "1.5px solid var(--sage)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
            <div className="fx g8" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--sage)", fontSize: 13 }}>🎁 Descuento aplicado</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  Para: <strong>{discountApplied.for}</strong>{discountApplied.note ? ` · ${discountApplied.note}` : ""}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Autorizó: {discountApplied.authorizedBy}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--sage)" }}>−{fmt(discountApplied.amount)}</div>
                <button className="btn btn-outline btn-sm" style={{ fontSize: 10, padding: "3px 8px", marginTop: 4 }} onClick={removeDiscount}>Quitar</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setDiscountOpen(true)} style={{ fontSize: 12 }}>
              🎁 Aplicar descuento
            </button>
          </div>
        )}

        {/* ── MÉTODO DE PAGO ── */}
        <div className="lbl">Método de pago</div>
        <div className="fx g8 mt8 mb12" style={{ flexWrap: "wrap" }}>
          {PAY_METHODS.map(m => (
            <button key={m} className={`mb-btn f1 ${method === m ? "sel" : ""}`}
              style={{ textAlign: "center", justifyContent: "center" }}
              onClick={() => setMethod(m)}>
              {m === "Efectivo" ? "💵" : m === "Tarjeta" ? "💳" : "📱"} {m}
            </button>
          ))}
        </div>

        {/* ── PROPINA ── */}
        <div style={{ marginBottom: 14 }}>
          <div className="lbl">Propina (opcional)</div>
          <div className="fx g8 mt8" style={{ flexWrap: "wrap" }}>
            {TIP_PCTS.map(p => (
              <button key={p} className={`mb-btn ${!showCustomTip && tipPct === p ? "sel" : ""}`}
                onClick={() => { setTipPct(p); setShowCustomTip(false); setCustomTip(""); }}>
                {p === 0 ? "Sin propina" : `${p}%`}
                {p > 0 && <span style={{ fontSize: 10, color: "var(--terra)", display: "block" }}>{fmtInt(Math.round(netTotal * p / 100))}</span>}
              </button>
            ))}
            {/* Custom % button */}
            <button className={`mb-btn ${showCustomTip ? "sel" : ""}`}
              onClick={() => { setShowCustomTip(true); setTipPct(0); }}>
              <span style={{ fontWeight: 700 }}>?%</span>
              <span style={{ fontSize: 10, color: "var(--muted)", display: "block" }}>Otro</span>
            </button>
          </div>
          {showCustomTip && (
            <div className="fx g8 mt8" style={{ alignItems: "center" }}>
              <input className="inp" type="number" min="0" max="100" placeholder="Ej: 12"
                value={customTip} onChange={e => setCustomTip(e.target.value)}
                style={{ maxWidth: 100, textAlign: "center", fontSize: 16, fontWeight: 700 }} />
              <span style={{ fontSize: 13, color: "var(--muted)" }}>% = {fmtInt(Math.round(netTotal * (parseFloat(customTip)||0) / 100))}</span>
            </div>
          )}
          {tipAmt > 0 && (
            <div style={{ background: "rgba(201,168,76,.12)", borderRadius: 9, padding: "8px 12px", marginTop: 8 }}>
              <div className="fx g8" style={{ justifyContent: "space-between", fontSize: 12 }}>
                <span>Propina ({activeTipPct}%)</span>
                <span style={{ fontWeight: 700, color: "var(--gold)" }}>+ {fmt(tipAmt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── EFECTIVO ── */}
        {method === "Efectivo" && (
          <>
            <div className="lbl">Efectivo recibido</div>
            <input className="inp" type="number" placeholder="0.00" value={cash}
              onChange={e => setCash(e.target.value)} style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }} />
            <div className="fx g8 mb12" style={{ flexWrap: "wrap" }}>
              {quickAmts.map(a => <button key={a} className="btn btn-outline btn-sm" onClick={() => setCash(String(a))}>{fmtInt(a)}</button>)}
            </div>
            {cash && change >= 0 && (
              <div style={{ background: "rgba(122,140,110,.15)", borderRadius: 9, padding: "10px 14px", marginBottom: 12, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Cambio</div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Playfair Display,serif", color: "var(--sage)" }}>{fmt(change)}</div>
              </div>
            )}
            {cash && change < 0 && (
              <div style={{ background: "rgba(224,85,85,.1)", borderRadius: 9, padding: "9px 14px", marginBottom: 12, color: "#c03030", fontSize: 13, textAlign: "center" }}>
                ⚠️ Falta {fmt(Math.abs(change))}
              </div>
            )}
          </>
        )}

        {/* ── RESUMEN FINAL ── */}
        <div style={{ background: "rgba(196,112,74,.07)", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          {discountApplied && (
            <>
              <div className="fx g8" style={{ justifyContent: "space-between", fontSize: 13 }}>
                <span>Subtotal original</span><span>{fmt(total)}</span>
              </div>
              <div className="fx g8" style={{ justifyContent: "space-between", fontSize: 13, color: "var(--sage)" }}>
                <span>Descuento ({discountApplied.for})</span><span>−{fmt(discountApplied.amount)}</span>
              </div>
              <div className="fx g8" style={{ justifyContent: "space-between", fontSize: 13 }}>
                <span>Subtotal con descuento</span><span>{fmt(netTotal)}</span>
              </div>
            </>
          )}
          {tipAmt > 0 && (
            <div className="fx g8" style={{ justifyContent: "space-between", fontSize: 13 }}>
              <span>Propina ({activeTipPct}%)</span><span style={{ color: "var(--gold)" }}>+ {fmt(tipAmt)}</span>
            </div>
          )}
          <div className="fx g8" style={{ justifyContent: "space-between", fontWeight: 800, fontSize: 18, marginTop: 6, paddingTop: 6, borderTop: "1px solid var(--sand)" }}>
            <span>TOTAL A COBRAR</span>
            <span style={{ color: "var(--espresso)", fontFamily: "Playfair Display,serif" }}>{fmt(chargeTotal)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 15, fontWeight: 800 }}
            onClick={() => onPay(...buildArgs())} disabled={isDisabled}>
            🖨️ Cobrar e Imprimir ticket
          </button>
          {onPayNoPrint && (
            <button className="btn btn-sage" style={{ width: "100%", justifyContent: "center", padding: 11 }}
              onClick={() => onPayNoPrint(...buildArgs())} disabled={isDisabled}>
              ✅ Cobrado — sin imprimir
            </button>
          )}
          <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
            onClick={onClose}>Cancelar</button>
        </div>

        {/* ══ DISCOUNT MODAL (nested) ════════════════════════════ */}
        {discountOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div className="mc" style={{ maxWidth: 400, width: "100%", background: "var(--cream)", borderRadius: 20, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,.25)" }}>
              <div className="mo-title">🎁 Aplicar Descuento</div>

              {/* Discount type */}
              <div className="fg">
                <label className="lbl">Tipo de descuento</label>
                <div className="fx g8">
                  <button className={`mb-btn f1 ${discountType === "porcentaje" ? "sel" : ""}`}
                    onClick={() => setDiscountType("porcentaje")} style={{ justifyContent: "center" }}>% Porcentaje</button>
                  <button className={`mb-btn f1 ${discountType === "fijo" ? "sel" : ""}`}
                    onClick={() => setDiscountType("fijo")} style={{ justifyContent: "center" }}>$ Monto fijo</button>
                </div>
              </div>

              {/* Amount */}
              <div className="fg">
                <label className="lbl">{discountType === "porcentaje" ? "Porcentaje de descuento" : "Monto a descontar ($)"}</label>
                <div className="fx g8" style={{ alignItems: "center" }}>
                  <input className="inp" type="number" min="0" max={discountType === "porcentaje" ? "100" : undefined}
                    value={discountVal} onChange={e => setDiscountVal(e.target.value)}
                    placeholder={discountType === "porcentaje" ? "Ej: 10" : "Ej: 50"}
                    style={{ textAlign: "center", fontSize: 18, fontWeight: 700 }} />
                  {discountVal && parseFloat(discountVal) > 0 && (
                    <span style={{ fontSize: 14, color: "var(--sage)", fontWeight: 700, whiteSpace: "nowrap" }}>
                      = −{fmt(discountType === "porcentaje" ? Math.round(total * parseFloat(discountVal) / 100) : Math.min(total, parseFloat(discountVal)))}
                    </span>
                  )}
                </div>
                {/* Quick % presets */}
                {discountType === "porcentaje" && (
                  <div className="fx g6 mt8" style={{ flexWrap: "wrap" }}>
                    {[5,10,15,20,25,50,100].map(p => (
                      <button key={p} className="btn btn-outline btn-sm" onClick={() => setDiscountVal(String(p))}>{p}%</button>
                    ))}
                  </div>
                )}
              </div>

              {/* For whom */}
              <div className="fg">
                <label className="lbl">Para quién es el descuento *</label>
                <input className="inp" value={discountFor} onChange={e => setDiscountFor(e.target.value)}
                  placeholder="Nombre de la persona" />
              </div>

              {/* Reason */}
              <div className="fg">
                <label className="lbl">Motivo / categoría</label>
                <div className="fx g6" style={{ flexWrap: "wrap", marginBottom: 8 }}>
                  {["Familiar", "Amigo", "Descuento mesa", "Cortesía", "Error cocina", "Empleado"].map(n => (
                    <button key={n} className={`btn btn-outline btn-sm ${discountNote === n ? "active" : ""}`}
                      style={{ fontSize: 11 }} onClick={() => setDiscountNote(n)}>{n}</button>
                  ))}
                </div>
                <input className="inp" value={discountNote} onChange={e => setDiscountNote(e.target.value)}
                  placeholder="O escribe el motivo..." style={{ fontSize: 12 }} />
              </div>

              {/* Auth PIN */}
              <div className="fg">
                <label className="lbl">🔐 PIN de gerente o administrador</label>
                <input className="inp" type="password" inputMode="numeric"
                  value={discountPin} onChange={e => { setDiscountPin(e.target.value.replace(/[^0-9]/g,"")); setDiscountErr(""); }}
                  placeholder="••••"
                  onKeyDown={e => e.key === "Enter" && applyDiscount()}
                  style={{ letterSpacing: 6, fontSize: 18, textAlign: "center", maxWidth: 160 }} />
                {discountErr && <div style={{ color: "#e05555", fontSize: 12, marginTop: 6 }}>⚠️ {discountErr}</div>}
              </div>

              <div className="fx g8" style={{ flexDirection: "column", marginTop: 8 }}>
                <button className="btn btn-sage" style={{ width: "100%", justifyContent: "center", padding: 13, fontWeight: 800 }}
                  onClick={applyDiscount} disabled={!discountPin || !discountFor || !discountVal}>
                  ✅ Aplicar descuento
                </button>
                <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setDiscountOpen(false); setDiscountPin(""); setDiscountErr(""); }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function printTicket(order) {
  var w = window.open("", "_blank", "width=350,height=600");
  if (!w) return;
  var netTotal = order.netTotal != null ? order.netTotal : order.total;
  var finalTotal = netTotal + (order.tip || 0);
  var lines = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    "       mesa teresa",
    "    @mesateresa_",
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    order.type + (order.ref ? " - " + order.ref : ""),
    (order.paidAt || order.createdAt) + (order.folio ? "\nFOLIO #" + order.folio : ""),
    "Cajero: " + order.user,
    "─────────────────────────"
  ];
  order.items.forEach(function(i) {
    lines.push(i.prod.name);
    if (i.modLabels) lines.push("  " + i.modLabels);
    if (i.spec) lines.push("  " + i.spec);
    lines.push("  " + i.qty + " x " + fmtInt(i.price) + "     " + fmtInt(i.price * i.qty));
  });
  lines.push("─────────────────────────");
  if (order.note) { lines.push("Nota: " + order.note); lines.push("─────────────────────────"); }
  lines.push("Subtotal:       " + fmtInt(order.total));
  if (order.discount) lines.push("Descuento (" + order.discount.for + "): -" + fmtInt(order.discount.amount));
  if (order.tip > 0) lines.push("Propina:        " + fmtInt(order.tip));
  lines.push("TOTAL:          " + fmtInt(finalTotal));
  lines.push("Pago:           " + order.payment);
  if (order.payment === "Efectivo") {
    lines.push("Recibido:       " + fmtInt(order.cashReceived));
    lines.push("Cambio:         " + fmtInt(order.change));
  }
  lines.push("─────────────────────────");
  lines.push("Gracias por tu visita!");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━");
  w.document.write("<pre style=\"font-family:monospace;font-size:12px;padding:16px;width:310px\">" + lines.join("\n") + "</pre>");
  w.document.close(); w.print();
}

function TicketView({ order }) {
  return (
    <div className="tkt">
      <div className="tkt-h">
        <div style={{ fontFamily: "Playfair Display,serif", fontSize: 16, fontStyle: "italic" }}>mesa teresa</div>
        <div style={{ fontSize: 10, color: "#666" }}>@mesateresa_</div>
        <div style={{ fontSize: 11, marginTop: 5 }}>{order.type}{order.ref ? ` — ${order.ref}` : ""}</div>
        <div style={{ fontSize: 10, color: "#888" }}>{order.createdAt} · {order.user}</div>
      </div>
      {order.items.map((item, i) => (
        <div key={i}>
          <div className="tkt-r"><span>{item.prod.name}</span><span>{fmtInt(item.price * item.qty)}</span></div>
          {item.modLabels && <div style={{ fontSize: 10, color: "#888", paddingLeft: 8 }}>{item.modLabels}</div>}
          {item.spec && <div style={{ fontSize: 10, color: "#c4704a", paddingLeft: 8, fontStyle: "italic" }}>✏️ {item.spec}</div>}
          {item.qty > 1 && <div style={{ fontSize: 10, color: "#888", paddingLeft: 8 }}>{item.qty} × {fmtInt(item.price)}</div>}
        </div>
      ))}
      {order.note && <div style={{ fontSize: 11, color: "#888", marginTop: 5, fontStyle: "italic" }}>Nota: {order.note}</div>}
      <div className="tkt-tot"><span>TOTAL</span><span>{fmtInt(order.total)}</span></div>
      {order.tip > 0 && <div className="tkt-r" style={{ fontWeight: 600 }}><span>Propina ({order.payment})</span><span>{fmtInt(order.tip)}</span></div>}
      {order.payment === "Efectivo" && <>
        <div className="tkt-r"><span>Recibido</span><span>{fmtInt(order.cashReceived)}</span></div>
        <div className="tkt-r"><span>Cambio</span><span>{fmtInt(order.change)}</span></div>
      </>}
      <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#888" }}>¡Gracias! 🌿</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CUENTAS SCREEN — solo órdenes pendientes por cobrar
// ══════════════════════════════════════════════════════════════
function OrdersScreen({ shiftOrders, setShiftOrders, updateOrder, inventory, setInventory }) {
  const [detail, setDetail]           = useState(null);
  const [payModal, setPayModal]       = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelPin, setCancelPin]     = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelErr, setCancelErr]     = useState("");
  // Ticket preview before printing
  const [previewModal, setPreviewModal] = useState(null); // { order, payment, cashReceived, tip }

  const pending = shiftOrders.filter(o => !o.paid && o.status !== "cancelada");
  const ST = { pendiente: "bdg-o", en_proceso: "bdg-au", lista: "bdg-g" };
  const SL = { pendiente: "Pendiente", en_proceso: "En proceso", lista: "Lista ✓" };

  const advance = (id) => {
    const o = shiftOrders.find(x => x.id === id);
    if (!o) return;
    const nextStatus = { pendiente: "en_proceso", en_proceso: "lista", lista: "lista" }[o.status] || o.status;
    updateOrder(id, { status: nextStatus });
  };

  // PayModal calls this — show preview first for "print" variant
  const handlePay = (order, payment, cashReceived, tip, discountApplied) => {
    const discountAmt = discountApplied ? discountApplied.amount : 0;
    const netTotal = Math.max(0, order.total - discountAmt);
    const paid = { ...order, paid: true, status: "cerrada", paidAt: fullDT(), payment, cashReceived, tip: tip || 0,
      discount: discountApplied || null, netTotal,
      change: payment === "Efectivo" ? cashReceived - (netTotal + (tip||0)) : 0 };
    updateOrder(order.id, paid);
    deductInventory(order);
    setPayModal(null); setDetail(null);
    setPreviewModal(paid);
  };

  const payOnly = (order, payment, cashReceived, tip, discountApplied) => {
    const discountAmt = discountApplied ? discountApplied.amount : 0;
    const netTotal = Math.max(0, order.total - discountAmt);
    const paid = { ...order, paid: true, status: "cerrada", paidAt: fullDT(), payment, cashReceived, tip: tip || 0,
      discount: discountApplied || null, netTotal,
      change: payment === "Efectivo" ? cashReceived - (netTotal + (tip||0)) : 0 };
    updateOrder(order.id, paid);
    deductInventory(order);
    setPayModal(null); setDetail(null);
  };

  // Auto-deduct inventory: match product name to inventory item name (case-insensitive)
  const deductInventory = (order) => {
    if (!inventory || !setInventory) return;
    setInventory(prev => {
      let updated = [...prev];
      order.items.forEach(item => {
        const idx = updated.findIndex(inv =>
          inv.name.toLowerCase().includes(item.prod.name.toLowerCase()) ||
          item.prod.name.toLowerCase().includes(inv.name.toLowerCase())
        );
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], stock: Math.max(0, updated[idx].stock - item.qty) };
        }
      });
      return updated;
    });
  };

  const openCancel = (order, e) => {
    e.stopPropagation();
    setCancelModal(order);
    setCancelPin(""); setCancelReason(""); setCancelErr("");
  };

  const confirmCancel = () => {
    const auth = USERS.find(u => u.pin === cancelPin && (u.role === "admin" || u.role === "manager"));
    if (!auth) { setCancelErr("PIN incorrecto o sin permisos de gerente/admin"); return; }
    updateOrder(cancelModal.id, { status: "cancelada", paid: false, canceledAt: fullDT(), canceledBy: auth.name, cancelReason: cancelReason || "Sin motivo" });
    setCancelModal(null); setCancelPin(""); setCancelReason(""); setCancelErr("");
    setDetail(null);
  };

  return (
    <div className="sp">
      {/* Header */}
      <div className="fx g12 mb16" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="f1">
          <div className="sec-title">📋 Cuentas</div>
          <div className="sec-sub">Pedidos pendientes de cobrar</div>
        </div>
        <div className="sc" style={{ padding: "10px 20px", minWidth: 120 }}>
          <div className="sn" style={{ fontSize: 28, color: pending.length > 0 ? "var(--terra)" : "var(--sage)" }}>{pending.length}</div>
          <div className="sl">Por cobrar</div>
        </div>
      </div>

      {pending.length === 0 && (
        <div className="card tc" style={{ padding: 56 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontFamily: "Playfair Display,serif", fontSize: 18, color: "var(--bark)", marginBottom: 6 }}>Sin cuentas pendientes</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Todas las cuentas del turno han sido cobradas 🌿</div>
        </div>
      )}

      <div className="g3">
        {pending.map(o => (
          <div key={o.id} className="card" style={{ borderTop: "3px solid var(--terra)", cursor: "pointer" }} onClick={() => setDetail(o)}>
            <div className="fx g8 mb8">
              <div className="f1">
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--bark)" }}>
                  {o.type}{o.ref ? ` — ${o.ref}` : ""}
                </div>
                {/* Date + folio */}
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{o.createdAt}</div>
                {o.folio && <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", marginTop: 1 }}>Folio #{o.folio}</div>}
              </div>
              <span className={`bdg ${ST[o.status] || "bdg-o"}`}>{SL[o.status] || "Pendiente"}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
              {o.items.map(i => `${i.qty}× ${i.prod.name}`).join(" · ")}
            </div>
            {o.note && <div style={{ fontSize: 11, fontStyle: "italic", color: "var(--terra)", marginBottom: 8 }}>📝 {o.note}</div>}
            <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "Playfair Display,serif", color: "var(--espresso)", marginBottom: 10 }}>
              {fmtInt(o.total)}
            </div>
            <div className="fx g8" style={{ flexWrap: "wrap", gap: 6 }}>
              <button className="btn btn-accent btn-sm f1" style={{ justifyContent: "center" }}
                onClick={e => { e.stopPropagation(); setPayModal(o); }}>
                💳 Cobrar
              </button>
              <button className="btn btn-sage btn-sm"
                onClick={e => { e.stopPropagation(); advance(o.id); }}>
                {o.status === "lista" ? "✓ Lista" : "→"}
              </button>
              <button className="btn btn-danger btn-sm"
                style={{ padding: "5px 10px" }}
                onClick={e => openCancel(o, e)}
                title="Cancelar cuenta">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {detail && !payModal && !cancelModal && (
        <div className="mo">
          <div className="mc">
            <div className="mo-title">🧾 {detail.type}{detail.ref ? ` — ${detail.ref}` : ""}
              {detail.folio && <span style={{ fontSize: 13, color: "var(--gold)", marginLeft: 8, fontFamily: "DM Sans,sans-serif", fontStyle: "normal" }}>Folio #{detail.folio}</span>}
            </div>
            <TicketView order={detail} />
            <div className="fx g8 mt16" style={{ flexDirection: "column" }}>
              <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 15, fontWeight: 800 }}
                onClick={() => setPayModal(detail)}>💳 Cobrar esta cuenta</button>
              <button className="btn btn-danger btn-sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={e => openCancel(detail, e)}>✕ Cancelar cuenta</button>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setDetail(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay modal */}
      {payModal && (
        <PayModal
          total={payModal.total}
          onPay={(payment, cashReceived, tip) => handlePay(payModal, payment, cashReceived, tip)}
          onPayNoPrint={(payment, cashReceived, tip) => payOnly(payModal, payment, cashReceived, tip)}
          onClose={() => setPayModal(null)}
        />
      )}

      {/* ── TICKET PREVIEW MODAL ──────────────────────────────── */}
      {previewModal && (
        <div className="mo">
          <div className="mc">
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontFamily: "Playfair Display,serif", fontSize: 18, color: "var(--bark)", marginBottom: 2 }}>Vista previa del ticket</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Revisa antes de imprimir</div>
            </div>

            {/* Ticket preview box */}
            <div style={{ background: "#fff", border: "1px dashed var(--chukum)", borderRadius: 10, padding: "16px 18px", fontFamily: "monospace", fontSize: 12, maxWidth: 300, margin: "0 auto 14px" }}>
              {/* Header */}
              <div style={{ textAlign: "center", borderBottom: "1px dashed #ccc", paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ fontFamily: "Playfair Display,serif", fontSize: 16, fontStyle: "italic", fontWeight: 700 }}>mesa teresa</div>
                <div style={{ fontSize: 10, color: "#666" }}>@mesateresa_</div>
                <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600 }}>{previewModal.type}{previewModal.ref ? ` — ${previewModal.ref}` : ""}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{previewModal.paidAt}</div>
                {previewModal.folio && <div style={{ fontSize: 11, fontWeight: 800, color: "#c4704a", marginTop: 2 }}>FOLIO #{previewModal.folio}</div>}
                <div style={{ fontSize: 10, color: "#888" }}>Cajero: {previewModal.user}</div>
              </div>

              {/* Items grouped */}
              {previewModal.items.map((item, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                    <span>{item.qty > 1 ? `${item.qty}×` : ""} {item.prod.name}</span>
                    <span>{fmtInt(item.price * item.qty)}</span>
                  </div>
                  {item.modLabels && <div style={{ fontSize: 10, color: "#888", paddingLeft: 8 }}>{item.modLabels}</div>}
                  {item.spec && <div style={{ fontSize: 10, color: "#c4704a", paddingLeft: 8 }}>✏️ {item.spec}</div>}
                  {item.qty > 1 && <div style={{ fontSize: 10, color: "#aaa", paddingLeft: 8 }}>{item.qty} × {fmtInt(item.price)} c/u</div>}
                </div>
              ))}

              {/* Totals */}
              <div style={{ borderTop: "1px dashed #ccc", paddingTop: 8, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span>Subtotal</span><span>{fmtInt(previewModal.total)}</span>
                </div>
                {previewModal.discount && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--sage)" }}>
                    <span>Descuento ({previewModal.discount.for})</span>
                    <span>−{fmtInt(previewModal.discount.amount)}</span>
                  </div>
                )}
                {previewModal.tip > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span>Propina</span><span>{fmtInt(previewModal.tip)}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14, marginTop: 4, paddingTop: 4, borderTop: "1px dashed #eee" }}>
                  <span>TOTAL</span><span>{fmtInt((previewModal.netTotal ?? previewModal.total) + (previewModal.tip||0))}</span>
                </div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                  {previewModal.payment === "Efectivo"
                    ? `Efectivo: ${fmtInt(previewModal.cashReceived)} · Cambio: ${fmtInt(previewModal.change)}`
                    : previewModal.payment === "Tarjeta" ? "Pago con tarjeta"
                    : "Transferencia"}
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#aaa" }}>¡Gracias por tu visita! 🌿</div>
            </div>

            <div className="fx g8" style={{ flexDirection: "column" }}>
              <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 15, fontWeight: 800 }}
                onClick={() => { printTicket(previewModal); setPreviewModal(null); }}>
                🖨️ Imprimir ticket
              </button>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setPreviewModal(null)}>
                Cerrar sin imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CANCEL MODAL ─────────────────────────────────────── */}
      {cancelModal && (
        <div className="mo">
          <div className="mc">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 44, marginBottom: 6 }}>🚫</div>
              <div style={{ fontFamily: "Playfair Display,serif", fontSize: 19, color: "#c03030", fontWeight: 700 }}>Cancelar cuenta</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {cancelModal.type}{cancelModal.ref ? ` — ${cancelModal.ref}` : ""}
                {cancelModal.folio && <span style={{ fontWeight: 700, color: "var(--gold)", marginLeft: 6 }}>Folio #{cancelModal.folio}</span>}
              </div>
            </div>

            <div style={{ background: "rgba(224,85,85,.07)", border: "1px solid rgba(224,85,85,.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Productos en la cuenta:</div>
              {cancelModal.items.map((i, idx) => (
                <div key={idx} className="fx g8" style={{ justifyContent: "space-between", fontSize: 13, padding: "3px 0" }}>
                  <span>{i.qty}× {i.prod.name}{i.modLabels ? ` (${i.modLabels})` : ""}</span>
                  <span style={{ fontWeight: 600 }}>{fmtInt(i.price * i.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px dashed rgba(224,85,85,.3)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15, color: "#c03030" }}>
                <span>Total a cancelar</span>
                <span>{fmtInt(cancelModal.total)}</span>
              </div>
            </div>

            <div className="fg">
              <label className="lbl">Motivo de cancelación</label>
              <input className="inp" value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Error en pedido, cambio de cliente, sin consumo..." />
            </div>

            <div className="fg">
              <label className="lbl">🔐 PIN de gerente o administrador</label>
              <input className="inp" type="password" value={cancelPin}
                onChange={e => { setCancelPin(e.target.value); setCancelErr(""); }}
                placeholder="••••"
                onKeyDown={e => e.key === "Enter" && confirmCancel()}
                style={{ letterSpacing: 6, fontSize: 18, textAlign: "center", maxWidth: 160 }} />
              {cancelErr && <div style={{ color: "#e05555", fontSize: 12, marginTop: 6, fontWeight: 600 }}>⚠️ {cancelErr}</div>}
            </div>

            <div style={{ background: "rgba(201,168,76,.12)", borderRadius: 9, padding: "9px 13px", marginBottom: 14, fontSize: 12, color: "var(--bark)" }}>
              ℹ️ La cancelación quedará registrada en el corte de caja con folio, motivo y quien autorizó.
            </div>

            <div className="fx g8" style={{ flexDirection: "column" }}>
              <button className="btn btn-danger"
                style={{ width: "100%", justifyContent: "center", padding: 13, fontSize: 15, fontWeight: 800 }}
                onClick={confirmCancel}
                disabled={!cancelPin}>
                🚫 Confirmar cancelación
              </button>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => { setCancelModal(null); setCancelPin(""); setCancelErr(""); }}>
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// COSTOS — calculadora de costo unitario, precio y utilidad
// ══════════════════════════════════════════════════════════════
// COSTOS — calculadora + base de datos histórica
// ══════════════════════════════════════════════════════════════
function CostosScreen({ products, costosHistory, setCostosHistory }) {
  const activeProds = products.filter(p => p.active);

  // Current editable rows (working copy for today)
  const [rows, setRows] = useState(() =>
    activeProds.map(p => ({
      id: p.id, name: p.name, category: p.category, emoji: p.emoji || "🍽️",
      costo: p.cost || 0, precio: p.price,
    }))
  );

  // View mode: "editor" | "historial"
  const [view, setView] = useState("editor");
  // History filter period
  const [period, setPeriod] = useState("dia");
  // Save confirmation flash
  const [saved, setSaved] = useState(false);
  // Expanded snapshot detail
  const [expanded, setExpanded] = useState(null);
  // Category filter for editor
  const [cat, setCat] = useState("Todos");

  const update = (id, field, val) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: parseFloat(val) || 0 } : r));

  const utilP  = (r) => r.precio - r.costo;
  const utilPct= (r) => r.precio > 0 ? ((r.precio - r.costo) / r.precio * 100) : 0;
  const mClass = (r) => {
    const pct = utilPct(r);
    if (pct >= 60) return { color: "#4a8c3f", bg: "rgba(122,140,110,.15)" };
    if (pct >= 40) return { color: "#c9a84c", bg: "rgba(201,168,76,.12)" };
    return { color: "#c03030", bg: "rgba(224,85,85,.1)" };
  };

  // Summary helpers for a given rows array
  const summary = (rws) => {
    const totV = rws.reduce((s, r) => s + r.precio, 0);
    const totC = rws.reduce((s, r) => s + r.costo, 0);
    const totU = totV - totC;
    const mg   = totV > 0 ? (totU / totV * 100) : 0;
    return { totV, totC, totU, mg };
  };

  const { totV, totC, totU, mg } = summary(rows);
  const cats = ["Todos", ...new Set(rows.map(r => r.category))];
  const filtered = cat === "Todos" ? rows : rows.filter(r => r.category === cat);

  // ── Save snapshot ───────────────────────────────────────────
  const saveSnapshot = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const snap = {
      id: Date.now(),
      date: today,
      savedAt: fullDT(),
      rows: rows.map(r => ({ ...r })),
      ...summary(rows),
    };
    setCostosHistory(prev => [snap, ...prev]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── History filter ──────────────────────────────────────────
  const now = new Date();
  const isoToday = now.toISOString().slice(0, 10);

  const filterSnaps = (snaps) => {
    return snaps.filter(s => {
      const d = new Date(s.date);
      const diffDays = Math.floor((now - d) / 86400000);
      if (period === "dia")      return s.date === isoToday;
      if (period === "semana")   return diffDays < 7;
      if (period === "quincena") return diffDays < 15;
      if (period === "mes")      return diffDays < 31;
      return true;
    });
  };

  const visSnaps = filterSnaps(costosHistory || []);

  // ── Load snapshot into editor ───────────────────────────────
  const loadSnap = (snap) => {
    setRows(snap.rows.map(r => ({ ...r })));
    setView("editor");
  };

  // ── Delete snapshot ─────────────────────────────────────────
  const deleteSnap = (id) =>
    setCostosHistory(prev => prev.filter(s => s.id !== id));

  // ── Margen color for badge ──────────────────────────────────
  const mgColor = (pct) => pct >= 60 ? "#4a8c3f" : pct >= 40 ? "#c9a84c" : "#c03030";

  return (
    <div className="sp">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="fx g12 mb16" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="f1">
          <div className="sec-title">🧮 Costos y Rentabilidad</div>
          <div className="sec-sub">Costo unitario · Precio · Utilidad · Margen — con historial por período</div>
        </div>
        {/* View toggle */}
        <div className="fx g8">
          <button className={`ct-btn ${view === "editor" ? "active" : ""}`} onClick={() => setView("editor")}>✏️ Editor</button>
          <button className={`ct-btn ${view === "historial" ? "active" : ""}`} onClick={() => setView("historial")}>
            📚 Historial {costosHistory?.length > 0 && <span style={{ background: "var(--terra)", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, marginLeft: 4 }}>{costosHistory.length}</span>}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          EDITOR VIEW
      ══════════════════════════════════════════════════════ */}
      {view === "editor" && (
        <>
          {/* KPIs */}
          <div className="g4 mb16">
            <div className="sc"><div className="sn">{fmt(totV)}</div><div className="sl">Suma precios venta</div></div>
            <div className="sc"><div className="sn" style={{ color: "var(--terra)" }}>{fmt(totC)}</div><div className="sl">Suma costos</div></div>
            <div className="sc"><div className="sn" style={{ color: "var(--sage)" }}>{fmt(totU)}</div><div className="sl">Utilidad total</div></div>
            <div className="sc">
              <div className="sn" style={{ color: mg >= 50 ? "var(--sage)" : "var(--gold)" }}>{mg.toFixed(1)}%</div>
              <div className="sl">Margen promedio</div>
            </div>
          </div>

          {/* Category filter + Save button */}
          <div className="fx g8 mb12" style={{ flexWrap: "wrap", alignItems: "center" }}>
            <div className="ct" style={{ flex: 1, marginBottom: 0 }}>
              {cats.map(c => <button key={c} className={`ct-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
            </div>
            <button
              className="btn btn-accent"
              style={{ padding: "10px 20px", fontWeight: 800, fontSize: 14, gap: 6 }}
              onClick={saveSnapshot}
            >
              {saved ? "✅ ¡Guardado!" : "💾 Guardar costos del día"}
            </button>
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl" style={{ minWidth: 680 }}>
                <thead>
                  <tr>
                    <th style={{ width: 36 }}></th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th style={{ width: 140 }}>Costo unitario ($)</th>
                    <th style={{ width: 140 }}>Precio de venta ($)</th>
                    <th style={{ width: 110 }}>Utilidad ($)</th>
                    <th style={{ width: 110 }}>Margen %</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const mc = mClass(r);
                    const up = utilP(r);
                    const upct = utilPct(r);
                    return (
                      <tr key={r.id}>
                        <td style={{ fontSize: 20, textAlign: "center", padding: "10px 8px" }}>{r.emoji}</td>
                        <td><strong style={{ fontSize: 13 }}>{r.name}</strong></td>
                        <td><span className="tag">{r.category}</span></td>
                        <td>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 12 }}>$</span>
                            <input type="number" min="0" step="0.5" value={r.costo}
                              onChange={e => update(r.id, "costo", e.target.value)}
                              style={{ width: "100%", padding: "7px 8px 7px 20px", border: "1.5px solid var(--sand)", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.9)", color: "var(--terra)", fontFamily: "DM Sans,sans-serif" }} />
                          </div>
                        </td>
                        <td>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 12 }}>$</span>
                            <input type="number" min="0" step="0.5" value={r.precio}
                              onChange={e => update(r.id, "precio", e.target.value)}
                              style={{ width: "100%", padding: "7px 8px 7px 20px", border: "1.5px solid var(--sand)", borderRadius: 8, fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,.9)", color: "var(--espresso)", fontFamily: "DM Sans,sans-serif" }} />
                          </div>
                        </td>
                        <td>
                          <div style={{ padding: "7px 10px", borderRadius: 8, background: mc.bg, textAlign: "right" }}>
                            <div style={{ fontWeight: 800, fontSize: 14, color: mc.color }}>{up >= 0 ? "+" : ""}{fmt(up)}</div>
                          </div>
                        </td>
                        <td>
                          <div style={{ padding: "5px 10px", borderRadius: 8, background: mc.bg }}>
                            <div style={{ fontWeight: 800, fontSize: 15, color: mc.color, textAlign: "center" }}>{upct.toFixed(1)}%</div>
                            <div style={{ background: "rgba(0,0,0,.08)", borderRadius: 4, height: 5, marginTop: 4, overflow: "hidden" }}>
                              <div style={{ height: 5, background: mc.color, width: `${Math.min(100, Math.max(0, upct))}%`, borderRadius: 4 }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "rgba(196,168,130,.12)", fontWeight: 800 }}>
                    <td colSpan={3} style={{ padding: "10px 11px", fontSize: 13, color: "var(--bark)" }}>TOTALES ({filtered.length} productos)</td>
                    <td style={{ padding: "10px 11px", color: "var(--terra)", fontSize: 13 }}>{fmt(filtered.reduce((s,r) => s+r.costo, 0))}</td>
                    <td style={{ padding: "10px 11px", color: "var(--espresso)", fontSize: 13 }}>{fmt(filtered.reduce((s,r) => s+r.precio, 0))}</td>
                    <td style={{ padding: "10px 11px", color: "var(--sage)", fontSize: 14 }}>+{fmt(filtered.reduce((s,r) => s+utilP(r), 0))}</td>
                    <td style={{ padding: "10px 11px", fontSize: 14, color: mg >= 50 ? "var(--sage)" : "var(--gold)" }}>
                      {(filtered.reduce((s,r)=>s+r.precio,0) > 0
                        ? filtered.reduce((s,r)=>s+utilP(r),0)/filtered.reduce((s,r)=>s+r.precio,0)*100
                        : 0).toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--muted)", borderTop: "1px solid var(--sand)" }}>
              💡 Edita costo o precio — la utilidad y margen se calculan al instante. Presiona <strong>Guardar costos del día</strong> para dejar registro histórico. Verde ≥60% · Amarillo ≥40% · Rojo &lt;40%
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          HISTORIAL VIEW
      ══════════════════════════════════════════════════════ */}
      {view === "historial" && (
        <>
          {/* Period filter */}
          <div className="fx g8 mb16" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".5px" }}>Período:</span>
            {[
              { id: "dia",      label: "Hoy" },
              { id: "semana",   label: "7 días" },
              { id: "quincena", label: "Quincena" },
              { id: "mes",      label: "Mes" },
            ].map(p => (
              <button key={p.id} className={`ct-btn ${period === p.id ? "active" : ""}`} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
              {visSnaps.length} registro{visSnaps.length !== 1 ? "s" : ""} encontrado{visSnaps.length !== 1 ? "s" : ""}
            </span>
          </div>

          {visSnaps.length === 0 && (
            <div className="card tc" style={{ padding: 56 }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>📭</div>
              <div style={{ fontFamily: "Playfair Display,serif", fontSize: 17, color: "var(--bark)", marginBottom: 6 }}>Sin registros en este período</div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 18 }}>
                Usa el editor para capturar los costos del día y presiona <strong>Guardar costos del día</strong>.
              </div>
              <button className="btn btn-accent" onClick={() => setView("editor")}>✏️ Ir al editor</button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visSnaps.map(snap => {
              const isOpen = expanded === snap.id;
              return (
                <div key={snap.id} className="card" style={{ padding: 0, overflow: "hidden", border: "1.5px solid var(--sand)" }}>
                  {/* Snapshot header row */}
                  <div
                    className="fx g12"
                    style={{ padding: "14px 16px", cursor: "pointer", alignItems: "center", flexWrap: "wrap", background: isOpen ? "rgba(196,168,130,.08)" : "transparent" }}
                    onClick={() => setExpanded(isOpen ? null : snap.id)}
                  >
                    {/* Date + time */}
                    <div style={{ minWidth: 120 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--bark)" }}>
                        📅 {snap.date}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{snap.savedAt}</div>
                    </div>

                    {/* KPI pills */}
                    <div className="fx g8" style={{ flex: 1, flexWrap: "wrap" }}>
                      <div style={{ background: "rgba(196,112,74,.1)", borderRadius: 8, padding: "5px 11px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>Costos</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--terra)" }}>{fmt(snap.totC)}</div>
                      </div>
                      <div style={{ background: "rgba(196,168,130,.12)", borderRadius: 8, padding: "5px 11px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>Precios</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--espresso)" }}>{fmt(snap.totV)}</div>
                      </div>
                      <div style={{ background: "rgba(122,140,110,.12)", borderRadius: 8, padding: "5px 11px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>Utilidad</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--sage)" }}>+{fmt(snap.totU)}</div>
                      </div>
                      <div style={{ background: `${snap.mg >= 60 ? "rgba(122,140,110,.15)" : snap.mg >= 40 ? "rgba(201,168,76,.12)" : "rgba(224,85,85,.1)"}`, borderRadius: 8, padding: "5px 14px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>Margen</div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: mgColor(snap.mg) }}>{snap.mg.toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="fx g6">
                      <button className="btn btn-sage btn-sm"
                        onClick={e => { e.stopPropagation(); loadSnap(snap); }}
                        title="Cargar en editor">
                        📥 Cargar
                      </button>
                      <button className="btn btn-danger btn-sm"
                        onClick={e => { e.stopPropagation(); deleteSnap(snap.id); }}
                        title="Eliminar registro">
                        🗑️
                      </button>
                      <span style={{ fontSize: 18, color: "var(--muted)", userSelect: "none" }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded detail table */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--sand)", overflowX: "auto" }}>
                      <table className="tbl" style={{ minWidth: 560 }}>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Utilidad</th>
                            <th>Margen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snap.rows.map(r => {
                            const up = r.precio - r.costo;
                            const upct = r.precio > 0 ? (up / r.precio * 100) : 0;
                            const mc = upct >= 60 ? "#4a8c3f" : upct >= 40 ? "#c9a84c" : "#c03030";
                            return (
                              <tr key={r.id}>
                                <td style={{ fontSize: 18, textAlign: "center" }}>{r.emoji}</td>
                                <td><strong style={{ fontSize: 12 }}>{r.name}</strong></td>
                                <td><span className="tag">{r.category}</span></td>
                                <td style={{ color: "var(--terra)", fontWeight: 600, fontSize: 12 }}>{fmt(r.costo)}</td>
                                <td style={{ color: "var(--espresso)", fontWeight: 700, fontSize: 12 }}>{fmt(r.precio)}</td>
                                <td style={{ color: mc, fontWeight: 700, fontSize: 12 }}>{up >= 0 ? "+" : ""}{fmt(up)}</td>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <div style={{ background: "rgba(0,0,0,.07)", borderRadius: 3, height: 6, width: 60, overflow: "hidden" }}>
                                      <div style={{ height: 6, background: mc, width: `${Math.min(100, Math.max(0, upct))}%` }} />
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: 12, color: mc }}>{upct.toFixed(1)}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "rgba(196,168,130,.1)", fontWeight: 800, fontSize: 12 }}>
                            <td colSpan={3} style={{ padding: "8px 11px", color: "var(--bark)" }}>TOTALES</td>
                            <td style={{ padding: "8px 11px", color: "var(--terra)" }}>{fmt(snap.totC)}</td>
                            <td style={{ padding: "8px 11px", color: "var(--espresso)" }}>{fmt(snap.totV)}</td>
                            <td style={{ padding: "8px 11px", color: "var(--sage)" }}>+{fmt(snap.totU)}</td>
                            <td style={{ padding: "8px 11px", color: mgColor(snap.mg) }}>{snap.mg.toFixed(1)}%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// INVENTORY
// ══════════════════════════════════════════════════════════════
function InventoryScreen({ inventory, setInventory, user }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Insumos", barcode: "", stock: 0, minStock: 1, unit: "pz", cost: 0 });
  const fileRef = useRef();

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.barcode || "").includes(search));
  const save = () => {
    const d = { ...form, stock: +form.stock, minStock: +form.minStock, cost: +form.cost };
    if (modal === "add") setInventory(prev => [...prev, { ...d, id: Date.now() }]);
    else setInventory(prev => prev.map(i => i.id === d.id ? d : i));
    setModal(null);
  };
  const st = (i) => i.stock === 0 ? { l: "Sin stock", c: "bdg-r" } : i.stock <= i.minStock ? { l: "Bajo", c: "bdg-o" } : { l: "OK", c: "bdg-g" };

  return (
    <div className="sp">
      <div className="fx g12 mb16" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <div className="f1"><div className="sec-title">Inventario</div><div className="sec-sub">Gestión de insumos y productos del almacén</div></div>
        <button className="btn btn-accent" onClick={() => { setForm({ name: "", category: "Insumos", barcode: "", stock: 0, minStock: 1, unit: "pz", cost: 0 }); setModal("add"); }}>+ Agregar</button>
      </div>
      <div className="g4 mb16">
        <div className="sc"><div className="sn">{inventory.length}</div><div className="sl">Productos</div></div>
        <div className="sc"><div className="sn" style={{ color: "var(--terra)" }}>{inventory.filter(i => i.stock > 0 && i.stock <= i.minStock).length}</div><div className="sl">Stock bajo</div></div>
        <div className="sc"><div className="sn" style={{ color: "#c03030" }}>{inventory.filter(i => i.stock === 0).length}</div><div className="sl">Sin stock</div></div>
        <div className="sc"><div className="sn">{fmt(inventory.reduce((s, i) => s + i.stock * i.cost, 0))}</div><div className="sl">Valor inventario</div></div>
      </div>
      <div className="card">
        <input className="inp" placeholder="🔍 Buscar por nombre o código..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 14 }} />
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Código</th><th>Stock</th><th>Costo</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {filtered.map(item => {
                const s = st(item);
                return (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 11 }}>{item.barcode || "—"}</td>
                    <td>
                      <div className="fx g8">
                        <button className="qb" onClick={() => setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i))}>−</button>
                        <span style={{ fontWeight: 700, minWidth: 40, textAlign: "center", fontSize: 13 }}>{item.stock} {item.unit}</span>
                        <button className="qb" onClick={() => setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock + 1 } : i))}>+</button>
                      </div>
                    </td>
                    <td>{fmt(item.cost)}</td>
                    <td><span className={`bdg ${s.c}`}>{s.l}</span></td>
                    <td>
                      <div className="fx g8">
                        <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...item }); setModal("edit"); }}>✏️</button>
                        {user.role === "admin" && <button className="btn btn-danger btn-sm" onClick={() => setInventory(p => p.filter(i => i.id !== item.id))}>✕</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="mo">
          <div className="mc">
            <div className="mo-title">{modal === "add" ? "Nuevo producto" : "Editar producto"}</div>
            <div className="fg"><label className="lbl">Nombre</label><input className="inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="g2">
              <div className="fg"><label className="lbl">Categoría</label>
                <select className="inp" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {["Insumos","Lácteos","Frutas","Snacks","Bebidas","Limpieza","Otro"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label className="lbl">Unidad</label><input className="inp" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} /></div>
            </div>
            <div className="fg"><label className="lbl">Código de barras</label><input className="inp" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} /></div>
            <div className="g3">
              <div className="fg"><label className="lbl">Stock</label><input className="inp" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></div>
              <div className="fg"><label className="lbl">Mínimo</label><input className="inp" type="number" value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} /></div>
              <div className="fg"><label className="lbl">Costo</label><input className="inp" type="number" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} /></div>
            </div>
            <div className="fx g8 mt12">
              <button className="btn btn-primary f1" onClick={save} disabled={!form.name}>Guardar</button>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CATALOG
// ══════════════════════════════════════════════════════════════
function CatalogScreen({ products, setProducts, mgs, setMgs, user }) {
  const [tab, setTab] = useState("prods");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", category: ALL_CATS[0], price: 0, emoji: "☕", active: true, mgs: [] });
  const [img, setImg] = useState(null);
  const fileRef = useRef();
  const emojis = ["☕","🍯","🍫","🌿","🍌","🥛","🧋","🫖","🥤","🧇","🥪","🧀","🫛","🥯","🍰","🫚","🍵","🧃","🎂","🥗"];

  const save = () => {
    const d = { ...form, price: +form.price, img };
    if (modal === "add") setProducts(prev => [...prev, { ...d, id: Date.now() }]);
    else setProducts(prev => prev.map(p => p.id === d.id ? d : p));
    setModal(null);
  };

  return (
    <div className="sp">
      <div className="fx g12 mb16" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <div className="f1"><div className="sec-title">Catálogo de Productos</div><div className="sec-sub">Administra el menú y modificadores</div></div>
        {tab === "prods" && <button className="btn btn-accent" onClick={() => { setForm({ name: "", category: ALL_CATS[0], price: 0, emoji: "☕", active: true, mgs: [] }); setImg(null); setModal("add"); }}>+ Nuevo producto</button>}
      </div>
      <div className="fx g8 mb16">
        <button className={`ct-btn ${tab === "prods" ? "active" : ""}`} onClick={() => setTab("prods")}>Productos ({products.length})</button>
        <button className={`ct-btn ${tab === "mods" ? "active" : ""}`} onClick={() => setTab("mods")}>Modificadores</button>
      </div>
      {tab === "prods" && (
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Modificadores</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="fx g8">
                      {p.img ? <img src={p.img} className="img-pv" alt="" /> : <div className="img-ph">{p.emoji}</div>}
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className="tag">{p.category}</span></td>
                  <td style={{ fontWeight: 700, color: "var(--terra)" }}>{fmtInt(p.price)}</td>
                  <td>{(p.mgs || []).map(g => <span key={g} className="tag">{mgs[g]?.name || g}</span>)}</td>
                  <td>
                    <button className={`bdg ${p.active ? "bdg-g" : "bdg-r"}`} style={{ cursor: "pointer", border: "none" }}
                      onClick={() => setProducts(prev => prev.map(pp => pp.id === p.id ? { ...pp, active: !pp.active } : pp))}>
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td>
                    <div className="fx g8">
                      <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...p }); setImg(p.img || null); setModal("edit"); }}>✏️</button>
                      {user.role === "admin" && <button className="btn btn-danger btn-sm" onClick={() => setProducts(prev => prev.filter(pp => pp.id !== p.id))}>✕</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "mods" && <ModGroupsEditor mgs={mgs} setMgs={setMgs} />}

      {modal && (
        <div className="mo">
          <div className="mc">
            <div className="mo-title">{modal === "add" ? "Nuevo producto" : "Editar producto"}</div>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div onClick={() => fileRef.current?.click()} style={{ cursor: "pointer", display: "inline-block" }}>
                {img ? <img src={img} style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", border: "2px solid var(--chukum)" }} alt="" />
                  : <div style={{ width: 72, height: 72, borderRadius: 12, background: "var(--chukum-lt)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "2px dashed var(--sand)", margin: "0 auto" }}>{form.emoji}</div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImg(r.result); r.readAsDataURL(f); }} />
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5 }}>Toca para cambiar (foto/galería)</div>
            </div>
            <div className="fg">
              <div className="lbl">Emoji</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {emojis.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    style={{ fontSize: 20, padding: 5, borderRadius: 7, border: form.emoji === e ? "2px solid var(--bark)" : "1.5px solid var(--sand)", background: form.emoji === e ? "var(--chukum-lt)" : "#fff", cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="fg"><label className="lbl">Nombre</label><input className="inp" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="g2">
              <div className="fg"><label className="lbl">Categoría</label>
                <select className="inp" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {ALL_CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label className="lbl">Precio base</label><input className="inp" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            </div>
            <div className="fg">
              <div className="lbl">Grupos de modificadores</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {Object.values(mgs).map(g => {
                  const sel = (form.mgs || []).includes(g.id);
                  return (
                    <button key={g.id} className={`mb-btn ${sel ? "sel" : ""}`}
                      onClick={() => setForm(f => ({ ...f, mgs: sel ? (f.mgs||[]).filter(id => id !== g.id) : [...(f.mgs||[]), g.id] }))}>
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="fx g8 mt12">
              <button className="btn btn-primary f1" onClick={save} disabled={!form.name}>Guardar</button>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModGroupsEditor({ mgs, setMgs }) {
  const [sel, setSel] = useState(Object.keys(mgs)[0]);
  const [newGName, setNewGName] = useState("");
  const [newOptN, setNewOptN] = useState("");
  const [newOptP, setNewOptP] = useState(0);
  const g = mgs[sel];
  return (
    <div className="g2">
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Grupos</div>
        {Object.values(mgs).map(gg => (
          <button key={gg.id} className={`mb-btn ${sel === gg.id ? "sel" : ""}`} style={{ display: "block", width: "100%", marginBottom: 5, textAlign: "left" }} onClick={() => setSel(gg.id)}>
            {gg.name} <span className="bdg bdg-au" style={{ marginLeft: 6 }}>{gg.options.length}</span>
          </button>
        ))}
        <div className="div" />
        <div className="fx g8">
          <input className="inp f1" placeholder="Nuevo grupo..." value={newGName} onChange={e => setNewGName(e.target.value)} style={{ fontSize: 12 }} />
          <button className="btn btn-sage btn-sm" onClick={() => { if (!newGName) return; const id = newGName.toLowerCase().replace(/\s+/g,"_"); setMgs(p => ({ ...p, [id]: { id, name: newGName, type: "single", options: [] } })); setNewGName(""); setSel(id); }}>+</button>
        </div>
      </div>
      {g && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--bark)" }}>{g.name}</div>
          <div className="fx g8 mb12">
            <button className={`mb-btn ${g.type === "single" ? "sel" : ""}`} onClick={() => setMgs(p => ({ ...p, [g.id]: { ...g, type: "single" } }))}>1 opción</button>
            <button className={`mb-btn ${g.type === "multi" ? "sel" : ""}`} onClick={() => setMgs(p => ({ ...p, [g.id]: { ...g, type: "multi" } }))}>Varios</button>
          </div>
          {g.options.map(opt => (
            <div key={opt.id} className="fx g8" style={{ padding: "6px 10px", background: "var(--chukum-lt)", borderRadius: 7, marginBottom: 6 }}>
              <span className="f1" style={{ fontSize: 13 }}>{opt.name}</span>
              {opt.priceAdj > 0 && <span style={{ color: "var(--terra)", fontWeight: 700, fontSize: 12 }}>+{fmtInt(opt.priceAdj)}</span>}
              <button className="qb" style={{ width: 20, height: 20, fontSize: 11 }} onClick={() => setMgs(p => ({ ...p, [g.id]: { ...g, options: g.options.filter(o => o.id !== opt.id) } }))}>✕</button>
            </div>
          ))}
          <div className="div" />
          <div className="fx g8">
            <input className="inp f1" placeholder="Nombre..." value={newOptN} onChange={e => setNewOptN(e.target.value)} style={{ fontSize: 12 }} />
            <input className="inp" type="number" placeholder="+$" value={newOptP} onChange={e => setNewOptP(e.target.value)} style={{ width: 70, fontSize: 12 }} />
            <button className="btn btn-sage btn-sm" onClick={() => {
              if (!newOptN) return;
              const opt = { id: `o${Date.now()}`, name: newOptN, priceAdj: +newOptP };
              setMgs(p => ({ ...p, [g.id]: { ...g, options: [...g.options, opt] } }));
              setNewOptN(""); setNewOptP(0);
            }}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════
function ReportsScreen({ allShifts, products }) {
  const [period, setPeriod] = useState("semana");
  const [dateFrom, setDateFrom] = useState(isoDate(new Date(Date.now() - 7 * 86400000)));
  const [dateTo, setDateTo] = useState(isoDate());

  const filteredShifts = allShifts.filter(s => {
    if (!s.corte) return false;
    const d = s.date || isoDate();
    return d >= dateFrom && d <= dateTo;
  });

  const applyPeriod = (p) => {
    const today = new Date();
    setPeriod(p);
    if (p === "hoy") { setDateFrom(isoDate(today)); setDateTo(isoDate(today)); }
    else if (p === "semana") { setDateFrom(isoDate(new Date(Date.now() - 7 * 86400000))); setDateTo(isoDate(today)); }
    else if (p === "mes") { setDateFrom(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-01`); setDateTo(isoDate(today)); }
    else if (p === "trimestre") { setDateFrom(isoDate(new Date(Date.now() - 90 * 86400000))); setDateTo(isoDate(today)); }
  };

  const totVentas = filteredShifts.reduce((s, sh) => s + (sh.corte?.totSales || 0), 0);
  const totEfec = filteredShifts.reduce((s, sh) => s + (sh.corte?.totEfec || 0), 0);
  const totCard = filteredShifts.reduce((s, sh) => s + (sh.corte?.totCard || 0), 0);
  const totTrans = filteredShifts.reduce((s, sh) => s + (sh.corte?.totTrans || 0), 0);
  const totFood = filteredShifts.reduce((s, sh) => s + (sh.corte?.foodSales || 0), 0);
  const totBev = filteredShifts.reduce((s, sh) => s + (sh.corte?.bevSales || 0), 0);
  const totOrders = filteredShifts.reduce((s, sh) => s + (sh.corte?.orderCount || 0), 0);
  const totTips = filteredShifts.reduce((s, sh) => s + (sh.corte?.tipCard || 0), 0);

  // Aggregate product counts
  const prodAgg = {};
  filteredShifts.forEach(sh => {
    if (!sh.corte?.prodCount) return;
    Object.entries(sh.corte.prodCount).forEach(([n, v]) => {
      if (!prodAgg[n]) prodAgg[n] = { qty: 0, total: 0, cat: v.cat };
      prodAgg[n].qty += v.qty;
      prodAgg[n].total += v.total;
    });
  });
  const topProds = Object.entries(prodAgg).sort((a, b) => b[1].total - a[1].total);

  const exportReport = () => {
    const rows = [
      ["REPORTE DE VENTAS - mesa teresa"],
      ["Período", dateFrom, "al", dateTo],
      [],
      ["RESUMEN"],
      ["Total ventas", totVentas],
      ["Efectivo", totEfec],
      ["Tarjeta", totCard],
      ["Transferencia", totTrans],
      ["Alimentos", totFood, totVentas > 0 ? ((totFood/totVentas)*100).toFixed(1)+"%" : ""],
      ["Bebidas", totBev, totVentas > 0 ? ((totBev/totVentas)*100).toFixed(1)+"%" : ""],
      ["Total órdenes", totOrders],
      ["Propinas en tarjeta", totTips],
      [],
      ["PRODUCTOS VENDIDOS"],
      ["Producto","Categoría","Cantidad","Total","% del total"],
      ...topProds.map(([n, v]) => [n, v.cat, v.qty, v.total, totVentas > 0 ? ((v.total/totVentas)*100).toFixed(1)+"%" : ""]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `reporte_${dateFrom}_${dateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sp">
      <div className="fx g12 mb16" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <div className="f1"><div className="sec-title">Reportes de Ventas</div><div className="sec-sub">Análisis por período</div></div>
        <button className="btn btn-sage" onClick={exportReport}>📊 Exportar Excel</button>
      </div>

      {/* Period selector */}
      <div className="card mb16">
        <div className="fx g8" style={{ flexWrap: "wrap", marginBottom: 12 }}>
          {[["hoy","Hoy"],["semana","7 días"],["mes","Este mes"],["trimestre","90 días"],["custom","Personalizado"]].map(([v,l]) => (
            <button key={v} className={`ct-btn ${period === v ? "active" : ""}`} onClick={() => applyPeriod(v)}>{l}</button>
          ))}
        </div>
        {period === "custom" && (
          <div className="fx g8">
            <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Desde</label><input className="inp" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} min="2026-03-17" max="2035-03-17" /></div>
            <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Hasta</label><input className="inp" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} min="2026-03-17" max="2035-03-17" /></div>
          </div>
        )}
      </div>

      {filteredShifts.length === 0 ? (
        <div className="card tc" style={{ padding: 40, color: "var(--muted)" }}>No hay datos para el período seleccionado. Las ventas aparecerán aquí después de cerrar turnos.</div>
      ) : (
        <>
          <div className="g4 mb16">
            <div className="sc"><div className="sn">{fmt(totVentas)}</div><div className="sl">Total ventas</div></div>
            <div className="sc"><div className="sn">{totOrders}</div><div className="sl">Órdenes</div></div>
            <div className="sc"><div className="sn">{totOrders > 0 ? fmt(totVentas / totOrders) : "$0"}</div><div className="sl">Ticket promedio</div></div>
            <div className="sc"><div className="sn" style={{ color: "var(--gold)" }}>{fmt(totTips)}</div><div className="sl">Propinas tarjeta</div></div>
          </div>
          <div className="g3 mb16">
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Por método de pago</div>
              {[["💵 Efectivo", totEfec],["💳 Tarjeta", totCard],["📱 Transferencia", totTrans]].map(([l, v]) => (
                <div key={l} className="fx g8" style={{ marginBottom: 8 }}>
                  <span className="f1" style={{ fontSize: 13 }}>{l}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(v)}</span>
                  <span className="bdg bdg-b" style={{ minWidth: 42, textAlign: "center" }}>{totVentas > 0 ? ((v/totVentas)*100).toFixed(0) : 0}%</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Por tipo de venta</div>
              {[["🍽️ Alimentos", totFood],["☕ Bebidas", totBev]].map(([l, v]) => (
                <div key={l} className="fx g8" style={{ marginBottom: 8 }}>
                  <span className="f1" style={{ fontSize: 13 }}>{l}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(v)}</span>
                  <span className="bdg bdg-b" style={{ minWidth: 42, textAlign: "center" }}>{totVentas > 0 ? ((v/totVentas)*100).toFixed(0) : 0}%</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)" }}>Turnos cerrados</div>
              {filteredShifts.slice(0, 6).map(s => (
                <div key={s.id} className="fx g8" style={{ marginBottom: 7, padding: "6px 10px", background: "var(--chukum-lt)", borderRadius: 8 }}>
                  <span className="f1" style={{ fontSize: 12 }}>{s.date} · {s.openedBy}</span>
                  <span style={{ fontWeight: 700, fontSize: 12 }}>{fmt(s.corte?.totSales || 0)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--bark)" }}>Productos más vendidos</div>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead><tr><th>#</th><th>Producto</th><th>Categoría</th><th>Cantidad</th><th>Total</th><th>% ventas</th></tr></thead>
                <tbody>
                  {topProds.map(([n, v], i) => (
                    <tr key={n}>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>#{i+1}</td>
                      <td><strong>{n}</strong></td>
                      <td><span className="tag">{v.cat}</span></td>
                      <td style={{ fontWeight: 700 }}>{v.qty}</td>
                      <td style={{ fontWeight: 700, color: "var(--terra)" }}>{fmt(v.total)}</td>
                      <td><div style={{ background: "var(--sand)", borderRadius: 4, height: 6, width: 80, overflow: "hidden" }}><div style={{ height: 6, background: "var(--terra)", width: `${totVentas > 0 ? (v.total/totVentas*100) : 0}%` }} /></div><span style={{ fontSize: 11, color: "var(--muted)" }}>{totVentas > 0 ? ((v.total/totVentas)*100).toFixed(1) : 0}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// GASTOS SCREEN
// ══════════════════════════════════════════════════════════════
const GASTO_CATS = [
  { id: "renta",     label: "Renta",             icon: "🏠", color: "#7a8c6e" },
  { id: "cfe",       label: "Luz CFE",            icon: "💡", color: "#c9a84c" },
  { id: "nomina",    label: "Nóminas",             icon: "👥", color: "#5c7fc4" },
  { id: "insumos",   label: "Compras e Insumos",   icon: "🛒", color: "#c4704a" },
  { id: "inversion", label: "Inversión",           icon: "📈", color: "#4a8c3f" },
  { id: "varios",    label: "Gastos Varios",        icon: "🗂️", color: "#8c6e5c" },
];

function GastosScreen({ gastos, setGastos, user }) {
  const [activeCat, setActiveCat] = useState("todos");
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [filterDate, setFilterDate] = useState(isoDate());
  const [filterMode, setFilterMode] = useState("mes"); // dia | mes | todos
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`;

  const [form, setForm] = useState({
    categoria: "renta", descripcion: "", monto: "", fecha: isoDate(),
    proveedor: "", notas: "", foto: null,
  });

  const resetForm = () => {
    setForm({ categoria: "renta", descripcion: "", monto: "", fecha: isoDate(), proveedor: "", notas: "", foto: null });
    setImgPreview(null);
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { setImgPreview(r.result); setForm(f => ({ ...f, foto: r.result })); };
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!form.descripcion || !form.monto) return;
    setGastos(prev => [{
      ...form, id: Date.now(), monto: +form.monto, creadoEn: fullDT(), creadoPor: user.name,
    }, ...prev]);
    setModal(false);
    resetForm();
  };

  // Filter
  const filtered = gastos.filter(g => {
    const catOk = activeCat === "todos" || g.categoria === activeCat;
    let dateOk = true;
    if (filterMode === "dia") dateOk = g.fecha === filterDate;
    else if (filterMode === "mes") dateOk = g.fecha.startsWith(filterDate.slice(0,7));
    return catOk && dateOk;
  });

  const totFilt = filtered.reduce((s, g) => s + g.monto, 0);
  const catTotals = GASTO_CATS.map(c => ({
    ...c,
    total: filtered.filter(g => g.categoria === c.id).reduce((s, g) => s + g.monto, 0),
    count: filtered.filter(g => g.categoria === c.id).length,
  }));

  const catInfo = (id) => GASTO_CATS.find(c => c.id === id) || { label: id, icon: "🗂️", color: "#888" };

  return (
    <div className="sp">
      {/* Header */}
      <div className="fx g12 mb16" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <div className="f1">
          <div className="sec-title">🧾 Gastos</div>
          <div className="sec-sub">Registro de todos los egresos con evidencia fotográfica</div>
        </div>
        <button className="btn btn-accent" onClick={() => { resetForm(); setModal(true); }}>+ Registrar gasto</button>
      </div>

      {/* Date filter */}
      <div className="card mb16">
        <div className="fx g8" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <div className="lbl" style={{ marginBottom: 0 }}>Ver por:</div>
          {[["dia","Día específico"],["mes","Mes"],["todos","Todos"]].map(([v,l]) => (
            <button key={v} className={`ct-btn ${filterMode === v ? "active" : ""}`} onClick={() => setFilterMode(v)}>{l}</button>
          ))}
          {filterMode === "dia" && (
            <input className="inp" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              min="2026-03-17" max="2035-03-17" style={{ width: 160, fontSize: 12 }} />
          )}
          {filterMode === "mes" && (
            <input className="inp" type="month" value={filterDate.slice(0,7)}
              onChange={e => setFilterDate(e.target.value + "-01")}
              min="2026-03" max="2035-03" style={{ width: 150, fontSize: 12 }} />
          )}
        </div>
      </div>

      {/* Category summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 16 }}>
        <div
          className="sc"
          style={{ cursor: "pointer", borderTop: `3px solid var(--bark)`, borderColor: activeCat === "todos" ? "var(--espresso)" : undefined, background: activeCat === "todos" ? "rgba(44,24,16,.08)" : undefined }}
          onClick={() => setActiveCat("todos")}
        >
          <div className="sn" style={{ fontSize: 20 }}>{fmt(totFilt)}</div>
          <div className="sl">🗂️ Todos los gastos</div>
        </div>
        {catTotals.map(c => (
          <div
            key={c.id}
            className="sc"
            style={{ cursor: "pointer", borderTop: `3px solid ${c.color}`, background: activeCat === c.id ? `${c.color}18` : undefined }}
            onClick={() => setActiveCat(activeCat === c.id ? "todos" : c.id)}
          >
            <div className="sn" style={{ fontSize: 18, color: c.color }}>{fmt(c.total)}</div>
            <div className="sl">{c.icon} {c.label}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{c.count} registro{c.count !== 1 ? "s" : ""}</div>
          </div>
        ))}
      </div>

      {/* Expense list */}
      {filtered.length === 0 ? (
        <div className="card tc" style={{ padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🧾</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Sin gastos registrados en este período</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
          {filtered.map(g => {
            const ci = catInfo(g.categoria);
            return (
              <div key={g.id} className="card" style={{ borderLeft: `4px solid ${ci.color}`, cursor: "pointer" }}
                onClick={() => setDetailModal(g)}>
                <div className="fx g8 mb8">
                  <div style={{ fontSize: 22 }}>{ci.icon}</div>
                  <div className="f1">
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--bark)" }}>{g.descripcion}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{ci.label} · {g.fecha}</div>
                    {g.proveedor && <div style={{ fontSize: 11, color: "var(--muted)" }}>📍 {g.proveedor}</div>}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "Playfair Display,serif", color: ci.color }}>
                    {fmt(g.monto)}
                  </div>
                </div>
                {g.notas && <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", marginBottom: 8 }}>{g.notas}</div>}
                <div className="fx g8" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Por: {g.creadoPor}</div>
                  <div className="fx g8">
                    {g.foto && (
                      <span style={{ fontSize: 11, background: "rgba(122,140,110,.2)", color: "var(--sage)", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                        📷 Comprobante
                      </span>
                    )}
                    <button className="btn btn-danger btn-sm" style={{ padding: "3px 8px" }}
                      onClick={e => { e.stopPropagation(); setGastos(prev => prev.filter(gg => gg.id !== g.id)); }}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD MODAL */}
      {modal && (
        <div className="mo">
          <div className="mc" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="mo-title">🧾 Registrar Gasto</div>

            {/* Category selector */}
            <div className="fg">
              <div className="lbl">Categoría de gasto</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {GASTO_CATS.map(c => (
                  <button key={c.id}
                    onClick={() => setForm(f => ({ ...f, categoria: c.id }))}
                    style={{
                      padding: "10px 8px", borderRadius: 10, border: `2px solid ${form.categoria === c.id ? c.color : "var(--sand)"}`,
                      background: form.categoria === c.id ? `${c.color}18` : "#fff",
                      cursor: "pointer", textAlign: "center", transition: "all .15s",
                    }}>
                    <div style={{ fontSize: 22 }}>{c.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: form.categoria === c.id ? c.color : "var(--muted)", marginTop: 3 }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="g2">
              <div className="fg">
                <label className="lbl">Descripción *</label>
                <input className="inp" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Ej: Renta local marzo..." />
              </div>
              <div className="fg">
                <label className="lbl">Monto ($) *</label>
                <input className="inp" type="number" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
                  placeholder="0.00" />
              </div>
            </div>

            <div className="g2">
              <div className="fg">
                <label className="lbl">Fecha</label>
                <input className="inp" type="date" value={form.fecha} min="2026-03-17" max="2035-03-17"
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
              </div>
              <div className="fg">
                <label className="lbl">Proveedor / A quién se paga</label>
                <input className="inp" value={form.proveedor} onChange={e => setForm(f => ({ ...f, proveedor: e.target.value }))}
                  placeholder="Nombre, empresa..." />
              </div>
            </div>

            <div className="fg">
              <label className="lbl">Notas adicionales</label>
              <textarea className="inp" rows={2} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                style={{ resize: "none" }} placeholder="Observaciones, número de recibo, período..." />
            </div>

            {/* Photo upload */}
            <div className="fg">
              <div className="lbl">📷 Foto del comprobante / recibo</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: 90, height: 90, borderRadius: 12, cursor: "pointer", overflow: "hidden",
                    border: `2px dashed ${imgPreview ? "var(--sage)" : "var(--sand)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: imgPreview ? "transparent" : "var(--chukum-lt)",
                    flexShrink: 0,
                  }}>
                  {imgPreview
                    ? <img src={imgPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="comprobante" />
                    : <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)" }}>
                        <div style={{ fontSize: 28 }}>📷</div>
                        <div>Toca para<br/>agregar foto</div>
                      </div>
                  }
                </div>
                <div>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleFoto} />
                  <button className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                    {imgPreview ? "📷 Cambiar foto" : "📷 Tomar foto / galería"}
                  </button>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>
                    Foto del ticket, factura o recibo como evidencia del gasto
                  </div>
                  {imgPreview && (
                    <button className="btn btn-danger btn-sm" style={{ marginTop: 6 }}
                      onClick={() => { setImgPreview(null); setForm(f => ({ ...f, foto: null })); }}>
                      Eliminar foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="fx g8 mt12">
              <button className="btn btn-accent f1" style={{ justifyContent: "center" }}
                onClick={save} disabled={!form.descripcion || !form.monto}>
                Guardar gasto
              </button>
              <button className="btn btn-outline" onClick={() => { setModal(false); resetForm(); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModal && (
        <div className="mo">
          <div className="mc">
            <div className="mo-title">{catInfo(detailModal.categoria).icon} Detalle del gasto</div>
            <div style={{ background: "var(--chukum-lt)", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 22, fontFamily: "Playfair Display,serif", color: catInfo(detailModal.categoria).color, marginBottom: 6 }}>
                {fmt(detailModal.monto)}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--bark)", marginBottom: 4 }}>{detailModal.descripcion}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{catInfo(detailModal.categoria).label}</div>
              {detailModal.proveedor && <div style={{ fontSize: 13, color: "var(--muted)" }}>📍 {detailModal.proveedor}</div>}
              <div style={{ fontSize: 13, color: "var(--muted)" }}>📅 {detailModal.fecha}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Registrado por: {detailModal.creadoPor} · {detailModal.creadoEn}</div>
            </div>
            {detailModal.notas && (
              <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 14, fontStyle: "italic", background: "rgba(255,255,255,.7)", borderRadius: 8, padding: "10px 12px" }}>
                📝 {detailModal.notas}
              </div>
            )}
            {detailModal.foto && (
              <div style={{ marginBottom: 14 }}>
                <div className="lbl">Comprobante / Recibo</div>
                <img src={detailModal.foto} style={{ width: "100%", borderRadius: 12, border: "2px solid var(--sand)", maxHeight: 320, objectFit: "contain", background: "#fff" }} alt="comprobante" />
              </div>
            )}
            <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setDetailModal(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// BALANCE GENERAL (Admin only)
// ══════════════════════════════════════════════════════════════
function BalanceScreen({ allShifts, purchases, setPurchases, fixedExpenses, setFixedExpenses, products, gastos = [], isAdmin = true }) {
  const [tab, setTab] = useState("compras");
  const [period, setPeriod] = useState("mes");
  const [dateFrom, setDateFrom] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-01`);
  const [dateTo, setDateTo] = useState(isoDate());
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [pForm, setPForm] = useState({ supplier: "", date: isoDate(), items: [{ name: "", qty: 1, unit: "pz", cost: 0 }] });
  const [eForm, setEForm] = useState({ name: "", category: "Nómina", amount: 0, date: isoDate(), notes: "" });

  const applyPeriod = (p) => {
    const today = new Date();
    setPeriod(p);
    if (p === "diario") { setDateFrom(isoDate(today)); setDateTo(isoDate(today)); }
    else if (p === "semanal") { setDateFrom(isoDate(new Date(Date.now() - 7 * 86400000))); setDateTo(isoDate(today)); }
    else if (p === "quincenal") { setDateFrom(isoDate(new Date(Date.now() - 15 * 86400000))); setDateTo(isoDate(today)); }
    else if (p === "mensual") { setDateFrom(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-01`); setDateTo(isoDate(today)); }
    else if (p === "anual") { setDateFrom(`${today.getFullYear()}-01-01`); setDateTo(isoDate(today)); }
  };

  // Filtered data
  const filtShifts = allShifts.filter(s => s.date >= dateFrom && s.date <= dateTo && s.corte);
  const filtPurchases = purchases.filter(p => p.date >= dateFrom && p.date <= dateTo);
  const filtExpenses = fixedExpenses.filter(e => e.date >= dateFrom && e.date <= dateTo);
  const filtGastos = gastos.filter(g => g.fecha >= dateFrom && g.fecha <= dateTo);

  const totIngresos = filtShifts.reduce((s, sh) => s + (sh.corte?.totSales || 0), 0);
  const totCompras = filtPurchases.reduce((s, p) => s + p.items.reduce((a, i) => a + i.qty * i.cost, 0), 0);
  const totGastosFijos = filtExpenses.reduce((s, e) => s + e.amount, 0);
  // gastos from GastosScreen — grouped by category
  const totGastosReg = filtGastos.reduce((s, g) => s + g.monto, 0);
  const gastosPorCat = GASTO_CATS.map(c => ({
    ...c,
    total: filtGastos.filter(g => g.categoria === c.id).reduce((s, g) => s + g.monto, 0),
    count: filtGastos.filter(g => g.categoria === c.id).length,
  }));
  const totEgresos = totCompras + totGastosFijos + totGastosReg;
  const utilidad = totIngresos - totEgresos;
  const margen = totIngresos > 0 ? ((utilidad / totIngresos) * 100).toFixed(1) : 0;

  // Product profitability (simple: revenue vs estimated cost based on inventory)
  const prodRevenue = {};
  filtShifts.forEach(sh => {
    if (!sh.corte?.prodCount) return;
    Object.entries(sh.corte.prodCount).forEach(([n, v]) => {
      if (!prodRevenue[n]) prodRevenue[n] = { revenue: 0, qty: 0, cat: v.cat };
      prodRevenue[n].revenue += v.total;
      prodRevenue[n].qty += v.qty;
    });
  });
  const topRevProd = Object.entries(prodRevenue).sort((a, b) => b[1].revenue - a[1].revenue);

  const addPurchaseItem = () => setPForm(f => ({ ...f, items: [...f.items, { name: "", qty: 1, unit: "pz", cost: 0 }] }));
  const updatePItem = (i, k, v) => setPForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));
  const savePurchase = () => {
    const total = pForm.items.reduce((s, i) => s + +i.qty * +i.cost, 0);
    setPurchases(prev => [{ ...pForm, id: Date.now(), total }, ...prev]);
    setPurchaseModal(false);
    setPForm({ supplier: "", date: isoDate(), items: [{ name: "", qty: 1, unit: "pz", cost: 0 }] });
  };
  const saveExpense = () => {
    setFixedExpenses(prev => [{ ...eForm, id: Date.now(), amount: +eForm.amount }, ...prev]);
    setExpenseModal(false);
    setEForm({ name: "", category: "Nómina", amount: 0, date: isoDate(), notes: "" });
  };

  const exportBalance = () => {
    const rows = [
      ["BALANCE GENERAL - mesa teresa"],
      ["Período", dateFrom, "al", dateTo],
      [],
      ["INGRESOS", totIngresos],
      ["EGRESOS TOTAL", totEgresos],
      ["  Compras de insumos", totCompras],
      ["  Gastos fijos", totGastosFijos],
      ["UTILIDAD BRUTA", utilidad],
      ["MARGEN", margen + "%"],
      [],
      ["COMPRAS"],
      ["Fecha","Proveedor","Producto","Cant","Costo unit","Total"],
      ...filtPurchases.flatMap(p => p.items.map(i => [p.date, p.supplier, i.name, i.qty, i.cost, +i.qty * +i.cost])),
      [],
      ["GASTOS FIJOS"],
      ["Fecha","Concepto","Categoría","Monto"],
      ...filtExpenses.map(e => [e.date, e.name, e.category, e.amount]),
      [],
      ["VENTAS POR PRODUCTO"],
      ["Producto","Categoría","Cantidad","Ingresos"],
      ...topRevProd.map(([n, v]) => [n, v.cat, v.qty, v.revenue]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `balance_${dateFrom}_${dateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // AI Financial Analysis
  const [analysis, setAnalysis] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const runAnalysis = async () => {
    setLoadingAnalysis(true); setAnalysis("");
    const summary = {
      period: `${dateFrom} al ${dateTo}`,
      ingresos: totIngresos, compras: totCompras, gastosFijos: totGastosFijos,
      utilidad, margen: margen + "%",
      topProductos: topRevProd.slice(0, 8).map(([n, v]) => ({ nombre: n, ingresos: v.revenue, cantidad: v.qty })),
      turnos: filtShifts.length,
      ticketPromedio: filtShifts.reduce((s,sh) => s + (sh.corte?.orderCount||0),0) > 0 ? (totIngresos / filtShifts.reduce((s,sh) => s+(sh.corte?.orderCount||0),0)).toFixed(0) : 0,
      ventasAlimentos: filtShifts.reduce((s,sh) => s+(sh.corte?.foodSales||0),0),
      ventasBebidas: filtShifts.reduce((s,sh) => s+(sh.corte?.bevSales||0),0),
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Eres un analista financiero senior especializado en restaurantes y cafeterías en México. Analiza los datos financieros de manera clara, directa y práctica. Usa pesos mexicanos (MXN). Sé concreto con recomendaciones accionables. Usa emojis para hacer el análisis más legible. Responde en español.",
          messages: [{ role: "user", content: `Analiza los siguientes datos financieros de la cafetería "mesa teresa" y dame un análisis detallado como analista financiero de alto nivel:\n\n${JSON.stringify(summary, null, 2)}\n\nIncluye:\n1. Estado financiero general del período\n2. Productos más rentables y cuáles necesitan atención\n3. Análisis de márgenes\n4. Alertas y riesgos detectados\n5. Recomendaciones concretas para mejorar la rentabilidad\n6. Comparativa alimentos vs bebidas` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("\n") || "No se pudo obtener el análisis.";
      setAnalysis(text);
    } catch (e) {
      setAnalysis("Error al conectar con el análisis. Verifica tu conexión e intenta de nuevo.");
    }
    setLoadingAnalysis(false);
  };

  return (
    <div className="sp">
      <div className="fx g12 mb16" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <div className="f1">
          <div className="sec-title">💼 Balance General</div>
          <div className="sec-sub">Vista financiera completa — Solo administrador</div>
        </div>
        <button className="btn btn-sage" onClick={exportBalance}>📊 Exportar Excel</button>
        {isAdmin && (
          <button className="btn btn-gold" onClick={runAnalysis} disabled={loadingAnalysis}>
            {loadingAnalysis ? "⏳ Analizando..." : "🤖 Análisis IA"}
          </button>
        )}
      </div>

      {/* Period */}
      <div className="card mb16">
        <div className="fx g8" style={{ flexWrap: "wrap" }}>
          {[["diario","Hoy"],["semanal","Semanal"],["quincenal","Quincenal"],["mensual","Mensual"],["anual","Anual"],["custom","Personalizado"]].map(([v,l]) => (
            <button key={v} className={`ct-btn ${period === v ? "active" : ""}`} onClick={() => applyPeriod(v)}>{l}</button>
          ))}
        </div>
        {period === "custom" && (
          <div className="fx g8 mt8">
            <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Desde</label><input className="inp" type="date" value={dateFrom} min="2026-03-17" max="2035-03-17" onChange={e => setDateFrom(e.target.value)} /></div>
            <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Hasta</label><input className="inp" type="date" value={dateTo} min="2026-03-17" max="2035-03-17" onChange={e => setDateTo(e.target.value)} /></div>
          </div>
        )}
      </div>

      {/* KPI summary */}
      <div className="g4 mb16">
        <div className="sc" style={{ borderTop: "3px solid var(--sage)" }}>
          <div className="sn" style={{ color: "var(--sage)" }}>{fmt(totIngresos)}</div><div className="sl">📈 Ingresos</div>
        </div>
        <div className="sc" style={{ borderTop: "3px solid var(--terra)" }}>
          <div className="sn" style={{ color: "var(--terra)" }}>{fmt(totEgresos)}</div><div className="sl">📉 Egresos</div>
        </div>
        <div className="sc" style={{ borderTop: `3px solid ${utilidad >= 0 ? "var(--sage)" : "#e05555"}` }}>
          <div className="sn" style={{ color: utilidad >= 0 ? "var(--sage)" : "#e05555" }}>{fmt(utilidad)}</div><div className="sl">💰 Utilidad</div>
        </div>
        <div className="sc" style={{ borderTop: "3px solid var(--gold)" }}>
          <div className="sn" style={{ color: "var(--gold)" }}>{margen}%</div><div className="sl">📊 Margen</div>
        </div>
      </div>

      <div className="g2 mb16">
        <div className="sc">
          <div className="sn">{fmt(totCompras)}</div><div className="sl">Compras insumos (Balance)</div>
        </div>
        <div className="sc">
          <div className="sn">{fmt(totGastosFijos)}</div><div className="sl">Gastos fijos (Balance)</div>
        </div>
      </div>
      {/* Gastos from GastosScreen by category */}
      {filtGastos.length > 0 && (
        <div className="card mb16">
          <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--bark)" }}>🧾 Gastos registrados ({filtGastos.length}) — {fmt(totGastosReg)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8 }}>
            {gastosPorCat.filter(c => c.count > 0).map(c => (
              <div key={c.id} style={{ padding: "10px 12px", borderRadius: 10, borderLeft: `3px solid ${c.color}`, background: `${c.color}10` }}>
                <div style={{ fontSize: 18 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, color: c.color, fontSize: 15 }}>{fmt(c.total)}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.label} · {c.count} reg.</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {analysis && (
        <div className="card mb16" style={{ background: "rgba(201,168,76,.08)", borderColor: "var(--gold)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--bark)", marginBottom: 12, fontFamily: "Playfair Display,serif" }}>🤖 Análisis Financiero IA</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{analysis}</div>
        </div>
      )}

      {/* SUB TABS */}
      <div className="fx g8 mb12">
        {[["compras","🛒 Compras"],["productos","📦 Productos"]].map(([v,l]) => (
          <button key={v} className={`ct-btn ${tab === v ? "active" : ""}`} onClick={() => setTab(v)}>{l}</button>
        ))}
        <button className={`ct-btn ${tab === "gastos_bal" ? "active" : ""}`} onClick={() => setTab("gastos_bal")}>🧾 Gastos registrados</button>
        {isAdmin && (
          <button className={`ct-btn ${tab === "gastos" ? "active" : ""}`} onClick={() => setTab("gastos")}>💳 Gastos Fijos</button>
        )}
      </div>

      {/* COMPRAS */}
      {tab === "compras" && (
        <>
          <div className="fx g8 mb12">
            <button className="btn btn-accent" onClick={() => setPurchaseModal(true)}>+ Registrar compra</button>
            <div style={{ marginLeft: "auto", fontWeight: 700, fontSize: 14, color: "var(--bark)" }}>Total compras: <span style={{ color: "var(--terra)" }}>{fmt(totCompras)}</span></div>
          </div>
          {filtPurchases.length === 0 && <div className="card tc" style={{ padding: 30, color: "var(--muted)" }}>Sin compras registradas en este período</div>}
          {filtPurchases.map(p => (
            <div key={p.id} className="card mb12">
              <div className="fx g8 mb8">
                <div className="f1">
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--bark)" }}>{p.supplier || "Compra sin proveedor"}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.date}</div>
                </div>
                <div style={{ fontWeight: 800, color: "var(--terra)", fontSize: 16, fontFamily: "Playfair Display,serif" }}>{fmt(p.total)}</div>
                <button className="btn btn-danger btn-sm" onClick={() => setPurchases(prev => prev.filter(pp => pp.id !== p.id))}>✕</button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead><tr><th>Producto</th><th>Cant.</th><th>Unidad</th><th>Costo unit.</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {p.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name}</td><td>{it.qty}</td><td>{it.unit}</td>
                        <td>{fmt(it.cost)}</td><td style={{ fontWeight: 700 }}>{fmt(+it.qty * +it.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {/* GASTOS FIJOS */}
      {tab === "gastos" && (
        <>
          <div className="fx g8 mb12">
            <button className="btn btn-accent" onClick={() => setExpenseModal(true)}>+ Agregar gasto</button>
            <div style={{ marginLeft: "auto", fontWeight: 700, fontSize: 14, color: "var(--bark)" }}>Total: <span style={{ color: "var(--terra)" }}>{fmt(totGastosFijos)}</span></div>
          </div>
          {filtExpenses.length === 0 && <div className="card tc" style={{ padding: 30, color: "var(--muted)" }}>Sin gastos registrados en este período</div>}
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr><th>Fecha</th><th>Concepto</th><th>Categoría</th><th>Monto</th><th>Notas</th><th></th></tr></thead>
              <tbody>
                {filtExpenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontSize: 12 }}>{e.date}</td>
                    <td><strong>{e.name}</strong></td>
                    <td><span className="tag">{e.category}</span></td>
                    <td style={{ fontWeight: 700, color: "var(--terra)" }}>{fmt(e.amount)}</td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{e.notes}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => setFixedExpenses(prev => prev.filter(ee => ee.id !== e.id))}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PRODUCTO RENTABILIDAD */}
      {tab === "productos" && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--bark)" }}>Rentabilidad por producto (período seleccionado)</div>
          {topRevProd.length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>Sin datos. Cierra turnos para generar estadísticas.</div>}
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr><th>#</th><th>Producto</th><th>Categoría</th><th>Cantidad</th><th>Ingresos</th><th>% del total</th><th>Promedio/unidad</th></tr></thead>
              <tbody>
                {topRevProd.map(([n, v], i) => (
                  <tr key={n}>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>#{i+1}</td>
                    <td><strong>{n}</strong></td>
                    <td><span className="tag">{v.cat}</span></td>
                    <td style={{ fontWeight: 700 }}>{v.qty}</td>
                    <td style={{ fontWeight: 700, color: "var(--terra)" }}>{fmt(v.revenue)}</td>
                    <td>
                      <div style={{ background: "var(--sand)", borderRadius: 4, height: 7, width: 80, overflow: "hidden" }}>
                        <div style={{ height: 7, background: i < 3 ? "var(--sage)" : "var(--terra)", width: `${totIngresos > 0 ? (v.revenue/totIngresos*100) : 0}%` }} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{totIngresos > 0 ? ((v.revenue/totIngresos)*100).toFixed(1) : 0}%</span>
                    </td>
                    <td style={{ color: "var(--sage)", fontWeight: 600 }}>{fmt(v.qty > 0 ? v.revenue / v.qty : 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GASTOS REGISTRADOS TAB (from GastosScreen) */}
      {tab === "gastos_bal" && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--bark)" }}>🧾 Gastos registrados — período seleccionado</div>
          {filtGastos.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
              Sin gastos registrados en este período. Agrégalos desde la sección 🧾 Gastos.
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8, marginBottom: 16 }}>
                {gastosPorCat.filter(c => c.count > 0).map(c => (
                  <div key={c.id} style={{ padding: "10px 12px", borderRadius: 10, borderLeft: `3px solid ${c.color}`, background: `${c.color}10` }}>
                    <div style={{ fontSize: 18 }}>{c.icon}</div>
                    <div style={{ fontWeight: 700, color: c.color, fontSize: 15 }}>{fmt(c.total)}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.label} · {c.count} reg.</div>
                  </div>
                ))}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Proveedor</th><th>Monto</th><th>Foto</th></tr></thead>
                  <tbody>
                    {filtGastos.sort((a,b) => b.fecha.localeCompare(a.fecha)).map(g => {
                      const ci = GASTO_CATS.find(c => c.id === g.categoria) || { label: g.categoria, icon: "🗂️", color: "#888" };
                      return (
                        <tr key={g.id}>
                          <td style={{ fontSize: 12 }}>{g.fecha}</td>
                          <td><span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>{ci.icon} <span className="tag">{ci.label}</span></span></td>
                          <td><strong>{g.descripcion}</strong>{g.notas && <div style={{ fontSize: 11, color: "var(--muted)" }}>{g.notas}</div>}</td>
                          <td style={{ fontSize: 12, color: "var(--muted)" }}>{g.proveedor || "—"}</td>
                          <td style={{ fontWeight: 800, color: ci.color }}>{fmt(g.monto)}</td>
                          <td>
                            {g.foto
                              ? <img src={g.foto} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid var(--sand)", cursor: "pointer" }}
                                  alt="" onClick={() => window.open(g.foto, "_blank")} />
                              : <span style={{ fontSize: 11, color: "var(--muted)" }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, textAlign: "right", marginTop: 12, color: "var(--terra)", fontFamily: "Playfair Display,serif" }}>
                Total: {fmt(totGastosReg)}
              </div>
            </>
          )}
        </div>
      )}

      {/* PURCHASE MODAL */}
      {purchaseModal && (
        <div className="mo">
          <div className="mc mc-xl" style={{ maxHeight: "88vh", overflowY: "auto" }}>
            <div className="mo-title">🛒 Registrar Compra / Nota de super</div>
            <div className="g2">
              <div className="fg"><label className="lbl">Proveedor / Tienda</label><input className="inp" value={pForm.supplier} onChange={e => setPForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Super, Costco, Mercado..." /></div>
              <div className="fg"><label className="lbl">Fecha</label><input className="inp" type="date" value={pForm.date} min="2026-03-17" max="2035-03-17" onChange={e => setPForm(f => ({ ...f, date: e.target.value }))} /></div>
            </div>
            <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--bark)" }}>Productos comprados</div>
            {pForm.items.map((it, i) => (
              <div key={i} className="fx g8 mb8" style={{ flexWrap: "wrap", background: "var(--chukum-lt)", padding: "10px 12px", borderRadius: 10 }}>
                <input className="inp" style={{ flex: 2, minWidth: 120, fontSize: 12 }} placeholder="Nombre producto" value={it.name} onChange={e => updatePItem(i, "name", e.target.value)} />
                <input className="inp" type="number" style={{ width: 70, fontSize: 12 }} placeholder="Cant" value={it.qty} onChange={e => updatePItem(i, "qty", e.target.value)} />
                <input className="inp" style={{ width: 70, fontSize: 12 }} placeholder="Unidad" value={it.unit} onChange={e => updatePItem(i, "unit", e.target.value)} />
                <input className="inp" type="number" style={{ width: 90, fontSize: 12 }} placeholder="Costo/u" value={it.cost} onChange={e => updatePItem(i, "cost", e.target.value)} />
                <span style={{ fontWeight: 700, minWidth: 70, textAlign: "right", fontSize: 13, color: "var(--terra)" }}>{fmt(+it.qty * +it.cost)}</span>
                {pForm.items.length > 1 && <button className="qb" onClick={() => setPForm(f => ({ ...f, items: f.items.filter((_,j) => j !== i) }))}>✕</button>}
              </div>
            ))}
            <button className="btn btn-outline btn-sm mt8" onClick={addPurchaseItem}>+ Agregar producto</button>
            <div style={{ fontWeight: 800, fontSize: 16, textAlign: "right", marginTop: 12, color: "var(--espresso)", fontFamily: "Playfair Display,serif" }}>
              Total: {fmt(pForm.items.reduce((s, i) => s + +i.qty * +i.cost, 0))}
            </div>
            <div className="fx g8 mt12">
              <button className="btn btn-accent f1" style={{ justifyContent: "center" }} onClick={savePurchase}>Guardar compra</button>
              <button className="btn btn-outline" onClick={() => setPurchaseModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {expenseModal && (
        <div className="mo">
          <div className="mc">
            <div className="mo-title">💳 Agregar Gasto Fijo</div>
            <div className="fg"><label className="lbl">Concepto</label><input className="inp" value={eForm.name} onChange={e => setEForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Nómina semana, Renta local, Gas..." /></div>
            <div className="g2">
              <div className="fg"><label className="lbl">Categoría</label>
                <select className="inp" value={eForm.category} onChange={e => setEForm(f => ({ ...f, category: e.target.value }))}>
                  {["Nómina","Renta","Servicios","Gas/Electricidad","Internet","Publicidad","Mantenimiento","Varios"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label className="lbl">Fecha</label><input className="inp" type="date" value={eForm.date} min="2026-03-17" max="2035-03-17" onChange={e => setEForm(f => ({ ...f, date: e.target.value }))} /></div>
            </div>
            <div className="fg"><label className="lbl">Monto ($)</label><input className="inp" type="number" value={eForm.amount} onChange={e => setEForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div className="fg"><label className="lbl">Notas</label><textarea className="inp" rows={2} value={eForm.notes} onChange={e => setEForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: "none" }} /></div>
            <div className="fx g8 mt12">
              <button className="btn btn-accent f1" style={{ justifyContent: "center" }} onClick={saveExpense} disabled={!eForm.name || !eForm.amount}>Guardar gasto</button>
              <button className="btn btn-outline" onClick={() => setExpenseModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════
function ConfigScreen({ mgs, setMgs, user, refreshUsers, usersVersion }) {
  // ── User management state ───────────────────────────────────
  const [userModal, setUserModal] = useState(null); // null | { mode:"edit"|"add", user? }
  const [uForm, setUForm]         = useState({ name: "", role: "cashier", pin: "", pin2: "" });
  const [uErr, setUErr]           = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // user id to delete
  const [adminPin, setAdminPin]   = useState("");
  const [adminPinErr, setAdminPinErr] = useState("");

  const ROLE_COLORS = { admin: "#c4704a", manager: "#7a8c6e", cashier: "#c4a882" };
  const ROLE_LABELS = { admin: "Admin", manager: "Gerente", cashier: "Cajero" };

  // Only admin can manage users
  const isAdmin = user.role === "admin";

  const openAdd = () => {
    setUForm({ name: "", role: "cashier", pin: "", pin2: "" });
    setUErr("");
    setUserModal({ mode: "add" });
  };

  const openEdit = (u) => {
    setUForm({ name: u.name, role: u.role, pin: "", pin2: "" });
    setUErr("");
    setUserModal({ mode: "edit", user: u });
  };

  const validateForm = () => {
    if (!uForm.name.trim()) return "El nombre es obligatorio.";
    if (uForm.pin.length < 4) return "El PIN debe tener mínimo 4 dígitos.";
    if (!/^\d+$/.test(uForm.pin)) return "El PIN solo puede contener números.";
    if (uForm.pin !== uForm.pin2) return "Los PINs no coinciden.";
    const conflict = USERS.find(u =>
      u.pin === uForm.pin &&
      (userModal?.mode === "add" || u.id !== userModal?.user?.id)
    );
    if (conflict) return `El PIN ${uForm.pin} ya lo usa "${conflict.name}".`;
    return null;
  };

  const saveUser = () => {
    const err = validateForm();
    if (err) { setUErr(err); return; }

    if (userModal.mode === "add") {
      const nextId = Math.max(...USERS.map(u => u.id)) + 1;
      const color = ["#5c7fc4","#a05ca0","#5ca07c","#c45c7f","#7c5ca0"][nextId % 5];
      USERS.push({ id: nextId, name: uForm.name.trim(), role: uForm.role, pin: uForm.pin, color });
    } else {
      const idx = USERS.findIndex(u => u.id === userModal.user.id);
      if (idx !== -1) {
        USERS[idx] = { ...USERS[idx], name: uForm.name.trim(), role: uForm.role, pin: uForm.pin };
      }
    }
    refreshUsers();
    setUserModal(null);
  };

  const confirmDelete = () => {
    const auth = USERS.find(u => u.pin === adminPin && u.role === "admin");
    if (!auth) { setAdminPinErr("PIN de admin incorrecto"); return; }
    // Cannot delete the last admin
    const admins = USERS.filter(u => u.role === "admin");
    if (admins.length === 1 && USERS.find(u => u.id === deleteConfirm)?.role === "admin") {
      setAdminPinErr("No puedes eliminar el único admin del sistema."); return;
    }
    USERS.splice(USERS.findIndex(u => u.id === deleteConfirm), 1);
    refreshUsers();
    setDeleteConfirm(null); setAdminPin(""); setAdminPinErr("");
  };

  return (
    <div className="sp">
      <div className="sec-title">⚙️ Configuración</div>
      <div className="sec-sub mb16">Sistema, dispositivos y usuarios</div>

      <div className="g2">
        {/* ── IMPRESORA ── */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)", fontFamily: "Playfair Display,serif" }}>🖨️ Impresora Bluetooth 80mm</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Compatible: Epson TM-T20, Star TSP100, Rongta, Munbyn · Bluetooth o USB</div>
          <button className="btn btn-primary" onClick={async () => {
            try {
              if (navigator.bluetooth) { const d = await navigator.bluetooth.requestDevice({ acceptAllDevices: true }); alert(`Dispositivo: ${d.name}`); }
              else alert("Usa Chrome en Android/PC para Web Bluetooth. En iOS: conecta primero desde Ajustes Bluetooth del dispositivo.");
            } catch { alert("Conecta primero la impresora desde Ajustes Bluetooth del dispositivo."); }
          }}>📡 Buscar impresora</button>
        </div>

        {/* ── USUARIOS ── */}
        <div className="card">
          <div className="fx g8 mb12" style={{ alignItems: "center" }}>
            <div style={{ fontWeight: 700, color: "var(--bark)", fontFamily: "Playfair Display,serif", flex: 1 }}>👥 Usuarios del sistema</div>
            {isAdmin && (
              <button className="btn btn-accent btn-sm" onClick={openAdd}>+ Agregar usuario</button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {USERS.map(u => (
              <div key={u.id} className="fx g10" style={{ padding: "10px 12px", background: "var(--chukum-lt)", borderRadius: 12, alignItems: "center" }}>
                {/* Avatar */}
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                  {u.name[0].toUpperCase()}
                </div>
                {/* Info */}
                <div className="f1">
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--bark)" }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {ROLE_LABELS[u.role]} · PIN: {"•".repeat(u.pin.length)}
                    {u.id === user.id && <span style={{ marginLeft: 6, color: "var(--terra)", fontWeight: 700 }}>(tú)</span>}
                  </div>
                </div>
                {/* Role badge */}
                <span className={`bdg ${u.role === "admin" ? "bdg-r" : u.role === "manager" ? "bdg-o" : "bdg-g"}`}>
                  {ROLE_LABELS[u.role]}
                </span>
                {/* Edit / Delete — admin only */}
                {isAdmin && (
                  <div className="fx g6">
                    <button className="btn btn-sage btn-sm" onClick={() => openEdit(u)} title="Editar">✏️</button>
                    {u.id !== user.id && (
                      <button className="btn btn-danger btn-sm" onClick={() => { setDeleteConfirm(u.id); setAdminPin(""); setAdminPinErr(""); }} title="Eliminar">🗑️</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isAdmin && (
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>
              Solo el Administrador puede modificar usuarios.
            </div>
          )}
        </div>

        {/* ── VIGENCIA ── */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)", fontFamily: "Playfair Display,serif" }}>📅 Vigencia del sistema</div>
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
            Sistema activo desde <strong>17 marzo 2026</strong><br />hasta <strong>17 marzo 2035</strong><br /><br />
            Fechas válidas para todos los reportes, turnos y balance general.
          </div>
        </div>

        {/* ── PLATAFORMAS ── */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--bark)", fontFamily: "Playfair Display,serif" }}>📱 Acceso multiplataforma</div>
          <div style={{ fontSize: 13, lineHeight: 1.8 }}>
            ✅ iPhone / iPad (Safari)<br />
            ✅ Android (Chrome)<br />
            ✅ Computadora (cualquier navegador)<br />
            ✅ Cámara para fotos y escaneo<br />
            ✅ Exportación CSV/Excel<br />
            ✅ Impresión desde cualquier dispositivo
          </div>
        </div>
      </div>

      {/* ══ ADD / EDIT USER MODAL ════════════════════════════════ */}
      {userModal && (
        <div className="mo">
          <div className="mc">
            <div className="mo-title">
              {userModal.mode === "add" ? "➕ Agregar usuario" : `✏️ Editar — ${userModal.user?.name}`}
            </div>

            {/* Name */}
            <div className="fg">
              <label className="lbl">Nombre del usuario</label>
              <input className="inp" value={uForm.name}
                onChange={e => { setUForm(f => ({ ...f, name: e.target.value })); setUErr(""); }}
                placeholder="Ej: Cajero 2, Barista, Ana..." />
            </div>

            {/* Role */}
            <div className="fg">
              <label className="lbl">Rol y permisos</label>
              <div className="fx g8" style={{ flexWrap: "wrap" }}>
                {[
                  { id: "cashier", label: "🛒 Cajero", desc: "Pedido + Cuentas" },
                  { id: "manager", label: "📊 Gerente", desc: "Todo excepto Config" },
                  { id: "admin",   label: "🔑 Admin",   desc: "Acceso total" },
                ].map(r => (
                  <button key={r.id}
                    className={`mb-btn ${uForm.role === r.id ? "sel" : ""}`}
                    style={{ flex: "1 1 120px", flexDirection: "column", gap: 2, padding: "10px 12px" }}
                    onClick={() => setUForm(f => ({ ...f, role: r.id }))}>
                    <span style={{ fontWeight: 700 }}>{r.label}</span>
                    <span style={{ fontSize: 10, color: uForm.role === r.id ? "var(--espresso)" : "var(--muted)" }}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PIN */}
            <div className="g2">
              <div className="fg">
                <label className="lbl">PIN nuevo {userModal.mode === "edit" && "(dejar vacío = sin cambio)"}</label>
                <input className="inp" type="password" inputMode="numeric" maxLength={8}
                  value={uForm.pin}
                  onChange={e => { setUForm(f => ({ ...f, pin: e.target.value.replace(/[^0-9]/g,"") })); setUErr(""); }}
                  placeholder="Mín. 4 dígitos"
                  style={{ letterSpacing: 6, fontSize: 18, textAlign: "center" }} />
              </div>
              <div className="fg">
                <label className="lbl">Confirmar PIN</label>
                <input className="inp" type="password" inputMode="numeric" maxLength={8}
                  value={uForm.pin2}
                  onChange={e => { setUForm(f => ({ ...f, pin2: e.target.value.replace(/[^0-9]/g,"") })); setUErr(""); }}
                  placeholder="Repetir PIN"
                  style={{ letterSpacing: 6, fontSize: 18, textAlign: "center" }} />
              </div>
            </div>

            {/* PIN strength hint */}
            {uForm.pin.length > 0 && (
              <div style={{ fontSize: 11, color: uForm.pin.length >= 6 ? "var(--sage)" : uForm.pin.length >= 4 ? "var(--gold)" : "#e05555", marginBottom: 4 }}>
                {uForm.pin.length >= 6 ? "✅ PIN seguro" : uForm.pin.length >= 4 ? "⚠️ PIN aceptable (recomendamos 6+)" : "❌ PIN muy corto"}
              </div>
            )}

            {uErr && (
              <div style={{ background: "rgba(224,85,85,.1)", border: "1px solid rgba(224,85,85,.3)", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#c03030", marginBottom: 4 }}>
                ⚠️ {uErr}
              </div>
            )}

            <div className="fx g8 mt8" style={{ flexDirection: "column" }}>
              <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: 13, fontWeight: 800 }}
                onClick={saveUser}>
                {userModal.mode === "add" ? "➕ Agregar usuario" : "💾 Guardar cambios"}
              </button>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setUserModal(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM MODAL ═════════════════════════════════ */}
      {deleteConfirm !== null && (() => {
        const target = USERS.find(u => u.id === deleteConfirm);
        return (
          <div className="mo">
            <div className="mc">
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 42, marginBottom: 8 }}>🗑️</div>
                <div style={{ fontFamily: "Playfair Display,serif", fontSize: 18, color: "#c03030", fontWeight: 700 }}>Eliminar usuario</div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
                  ¿Eliminar a <strong>{target?.name}</strong> ({ROLE_LABELS[target?.role]})?
                </div>
              </div>
              <div style={{ background: "rgba(224,85,85,.07)", border: "1px solid rgba(224,85,85,.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "var(--bark)" }}>
                ⚠️ Esta acción es permanente. El usuario perderá acceso inmediatamente.
              </div>
              <div className="fg">
                <label className="lbl">🔐 Confirma con tu PIN de administrador</label>
                <input className="inp" type="password" inputMode="numeric"
                  value={adminPin}
                  onChange={e => { setAdminPin(e.target.value.replace(/[^0-9]/g,"")); setAdminPinErr(""); }}
                  placeholder="PIN Admin"
                  onKeyDown={e => e.key === "Enter" && confirmDelete()}
                  style={{ letterSpacing: 6, fontSize: 18, textAlign: "center", maxWidth: 160 }} />
                {adminPinErr && <div style={{ color: "#e05555", fontSize: 12, marginTop: 6 }}>⚠️ {adminPinErr}</div>}
              </div>
              <div className="fx g8" style={{ flexDirection: "column", marginTop: 8 }}>
                <button className="btn btn-danger" style={{ width: "100%", justifyContent: "center", padding: 13, fontWeight: 800 }}
                  onClick={confirmDelete} disabled={!adminPin}>
                  🗑️ Confirmar eliminación
                </button>
                <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => { setDeleteConfirm(null); setAdminPin(""); setAdminPinErr(""); }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// KITCHEN SCREEN — vista dedicada para pantalla de cocina
// ══════════════════════════════════════════════════════════════
function KitchenScreen({ shiftOrders, setShiftOrders, updateOrder }) {
  const [tick, setTick] = useState(0);

  // Auto-refresh every 8 seconds
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const active = shiftOrders.filter(o => !o.paid && o.status !== "cancelada");

  const advance = (id) => {
    const o = shiftOrders.find(x => x.id === id);
    if (!o) return;
    const next = { pendiente: "en_proceso", en_proceso: "lista", lista: "lista" }[o.status] || o.status;
    updateOrder(id, { status: next });
  };

  const statusStyle = {
    pendiente:   { border: "3px solid #e05555", bg: "rgba(224,85,85,.07)",  label: "🔴 NUEVO",       btn: "Empezar →",   btnClass: "btn-danger" },
    en_proceso:  { border: "3px solid #c9a84c", bg: "rgba(201,168,76,.08)", label: "🟡 EN PROCESO",  btn: "Listo ✓",     btnClass: "btn-accent" },
    lista:       { border: "3px solid #4a8c3f", bg: "rgba(74,140,63,.08)",  label: "🟢 LISTO",       btn: "✓ Entregado", btnClass: "btn-sage"   },
  };

  // Elapsed time display
  const elapsed = (createdAt) => {
    try {
      // createdAt is "DD/MM/YYYY HH:MM" format from fullDT()
      const parts = createdAt.match(/(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)/);
      if (!parts) return "";
      const d = new Date(parts[3], parts[2]-1, parts[1], parts[4], parts[5]);
      const mins = Math.floor((Date.now() - d.getTime()) / 60000);
      if (mins < 1) return "< 1 min";
      if (mins < 60) return `${mins} min`;
      return `${Math.floor(mins/60)}h ${mins%60}m`;
    } catch { return ""; }
  };

  return (
    <div style={{ background: "#1a1a1a", minHeight: "calc(100vh - 68px)", padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "Playfair Display,serif", fontStyle: "italic", fontSize: 22, color: "#f5ede0" }}>mesa teresa · Cocina</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Se actualiza automáticamente · {active.length} orden{active.length !== 1 ? "es" : ""} activa{active.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["pendiente","en_proceso","lista"].map(s => (
            <div key={s} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s === "pendiente" ? "#e05555" : s === "en_proceso" ? "#c9a84c" : "#4a8c3f" }}>
                {active.filter(o => o.status === s).length}
              </div>
              <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase" }}>
                {s === "pendiente" ? "Nuevas" : s === "en_proceso" ? "En proceso" : "Listas"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {active.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: 80, color: "#555" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <div style={{ fontFamily: "Playfair Display,serif", fontSize: 22, color: "#888" }}>Sin órdenes pendientes</div>
          <div style={{ fontSize: 14, color: "#555", marginTop: 8 }}>¡Turno tranquilo! ☕</div>
        </div>
      )}

      {/* Ticket grid — sorted: pendiente first, then en_proceso, then lista */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {[...active].sort((a,b) => {
          const order = { pendiente: 0, en_proceso: 1, lista: 2 };
          return (order[a.status]||0) - (order[b.status]||0);
        }).map(o => {
          const ss = statusStyle[o.status] || statusStyle.pendiente;
          const mins = elapsed(o.createdAt);
          return (
            <div key={o.id} style={{ background: "#2a2a2a", borderRadius: 16, border: ss.border, padding: 16, background: ss.bg.replace("rgba","rgba").replace(".07",",.15").replace(".08",",.12") }}>
              {/* Order header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#f0e8d8" }}>
                    {o.type}{o.ref ? ` — ${o.ref}` : ""}
                  </div>
                  {o.folio && <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 700 }}>Folio #{o.folio}</div>}
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{mins && `⏱ ${mins}`}</div>
                </div>
                <div style={{ background: ss.border.replace("3px solid ",""), color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  {ss.label}
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 14, borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 10 }}>
                {o.items.map((item, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#f0e8d8", fontWeight: 700, fontSize: 15 }}>
                      <span>{item.qty > 1 && <span style={{ color: "#c9a84c", marginRight: 4 }}>{item.qty}×</span>}{item.prod.name}</span>
                      <span style={{ fontSize: 14 }}>{item.prod.emoji}</span>
                    </div>
                    {item.modLabels && <div style={{ fontSize: 11, color: "#aaa", paddingLeft: 12 }}>{item.modLabels}</div>}
                    {item.spec && <div style={{ fontSize: 11, color: "#e09050", paddingLeft: 12 }}>✏️ {item.spec}</div>}
                  </div>
                ))}
                {o.note && (
                  <div style={{ background: "rgba(224,130,50,.15)", borderRadius: 8, padding: "6px 10px", marginTop: 6, fontSize: 12, color: "#e09050" }}>
                    📝 {o.note}
                  </div>
                )}
              </div>

              {/* Action button */}
              {o.status !== "lista" && (
                <button
                  className={`btn ${ss.btnClass}`}
                  style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15, fontWeight: 800 }}
                  onClick={() => advance(o.id)}>
                  {ss.btn}
                </button>
              )}
              {o.status === "lista" && (
                <div style={{ textAlign: "center", padding: "10px", color: "#4a8c3f", fontWeight: 700, fontSize: 14, border: "1px solid rgba(74,140,63,.3)", borderRadius: 10 }}>
                  🟢 LISTO PARA SERVIR
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
