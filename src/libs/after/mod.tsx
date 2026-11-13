import React, { Fragment, ReactNode, useEffect, useState } from "react";

React;

export function After(props: { children?: ReactNode } & { delay?: number }) {
  const { children, delay = 0 } = props

  const [after, setAfter] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAfter(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!after)
    return null

  return <Fragment>
    {children}
  </Fragment>
}