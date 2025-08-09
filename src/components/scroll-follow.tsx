"use client";

import { useEffect, useRef } from "react";

type Props = {
  selector?: string;
  ease?: number; // 0.1 ~ 0.2 권장
  topMargin?: number; // 상단 여백(고정 헤더 고려)
  bottomMargin?: number; // 하단 여백(푸터 겹침 방지)
};

export default function ScrollFollow({
  selector = "[data-toc-follower]",
  ease = 0.15,
  topMargin = 80,
  bottomMargin = 80,
}: Props) {
  const raf = useRef<number | null>(null);
  const current = useRef<number>(0);
  const velocity = useRef<number>(0);
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    elRef.current = document.querySelector<HTMLElement>(selector);
    const el = elRef.current;
    if (!el) return;

    const computeTarget = () => {
      const docHeight = document.documentElement.scrollHeight;
      const vh = window.innerHeight;
      const elHeight = el.offsetHeight;
      const desired = window.scrollY + vh / 2 - elHeight / 2; // 화면 중앙
      const min = topMargin;
      const max = Math.max(min, docHeight - bottomMargin - elHeight);
      return Math.min(max, Math.max(min, desired));
    };

    const loop = () => {
      const target = computeTarget();
      // 스프링 물리 기반 추적 (자석 느낌)
      const stiffness = ease; // 0.1~0.2 범위 권장
      const damping = 0.85; // 감쇠
      const force = (target - current.current) * stiffness;
      velocity.current = velocity.current * damping + force;
      current.current += velocity.current;

      // 속도 기반 스케일/그림자 변화
      const speed = Math.min(1, Math.abs(velocity.current) / 30);
      const scale = 0.98 + (1 - speed) * 0.02; // 빠를수록 0.98, 멈출수록 1.0
      const shadowStrength = 0.06 + speed * 0.06; // 0.06~0.12

      el.style.transform = `translate3d(0, ${Math.round(current.current)}px, 0) scale(${scale})`;
      el.style.filter = `drop-shadow(0 12px 24px rgb(0 0 0 / ${shadowStrength}))`;

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    const onResize = () => {
      // 리사이즈 시 위치 튀는 것을 완화하기 위해 현재 위치를 재계산
      current.current = computeTarget();
      el.style.transform = `translate3d(0, ${Math.round(current.current)}px, 0)`;
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [selector, ease, topMargin, bottomMargin]);

  return null;
}

