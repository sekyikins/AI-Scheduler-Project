import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Show scrollbar only on the actively scrolled element
let scrollbarHideTimer: number | undefined;
let activeScrollable: Element | null = null;

const clearActive = () => {
  if (activeScrollable) {
    activeScrollable.classList.remove('show-scrollbar');
    activeScrollable = null;
  }
};

const resolveElementFromTarget = (target: EventTarget | null): Element => {
  if (target && (target as Element).nodeType === 1) {
    return target as Element;
  }
  if (target && (target as Document).nodeType === 9) {
    const doc = target as Document;
    return (doc.scrollingElement as Element) || doc.documentElement;
  }
  return (document.scrollingElement as Element) || document.documentElement;
};

const setActiveScrollable = (rawTarget: EventTarget | null) => {
  const startEl = resolveElementFromTarget(rawTarget);
  // Find nearest scrollable ancestor
  let node: Element | null = startEl;
  while (node) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const isScrollable = (
      (overflowY === 'auto' || overflowY === 'scroll') && (node as HTMLElement).scrollHeight > (node as HTMLElement).clientHeight
    ) || (
      (overflowX === 'auto' || overflowX === 'scroll') && (node as HTMLElement).scrollWidth > (node as HTMLElement).clientWidth
    );
    if (isScrollable) break;
    node = node.parentElement;
  }
  if (!node) node = document.documentElement;

  if (activeScrollable && activeScrollable !== node) {
    activeScrollable.classList.remove('show-scrollbar');
  }
  activeScrollable = node;
  activeScrollable.classList.add('show-scrollbar');

  if (scrollbarHideTimer) window.clearTimeout(scrollbarHideTimer);
  scrollbarHideTimer = window.setTimeout(() => {
    clearActive();
  }, 800);
};

const onAnyScroll = (e: Event) => {
  setActiveScrollable(e.target);
};

window.addEventListener('scroll', onAnyScroll, { passive: true, capture: true });
window.addEventListener('wheel', onAnyScroll, { passive: true, capture: true });
window.addEventListener('touchmove', onAnyScroll, { passive: true, capture: true });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 