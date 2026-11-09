import { ChildrenProps } from "@/libs/props/mod.ts";
import React, { JSX } from "react";

React;

export function InMenuAnchor(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 select-none group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function InMenuButton(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 select-none cursor-pointer group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function WideNakedMenuAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"]) {
  const { children, ...rest } = props

  return <a className="group flex-1 po-2 rounded-xl focus-visible:outline-none whitespace-nowrap hover:bg-default-double-contrast focus-visible:bg-default-double-contrast inert:opacity-50"
    {...rest}>
    <InMenuAnchor>
      {children}
    </InMenuAnchor>
  </a>
}

export function WideNakedMenuButton(props: ChildrenProps & JSX.IntrinsicElements["button"] & { type: "button" }) {
  const { children, ...rest } = props

  return <button className="group flex-1 po-2 rounded-xl focus-visible:outline-none whitespace-nowrap hover:bg-default-double-contrast focus-visible:bg-default-double-contrast inert:opacity-50"
    {...rest}>
    <InMenuButton>
      {children}
    </InMenuButton>
  </button>
}