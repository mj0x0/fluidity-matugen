import {
  Children,
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { css } from "@emotion/react"
import styled from "@emotion/styled"

import { Orientation } from "../../../data/data"

const StyledAccordionContainer = styled.div<{
  vertical: boolean
  narrow: boolean
}>`
  display: flex;
  flex: 1;
  overflow: hidden;
  ${({ vertical, narrow }) =>
    vertical &&
    (narrow
      ? `
      flex-direction: column;
      min-height: 0;
      overflow-y: auto;
      scrollbar-width: none;
      ::-webkit-scrollbar {
        display: none;
      }
      --bar: 44px;
    `
      : `
      flex-direction: column;
      justify-content: safe center;
      min-width: 0;
      --column: calc(clamp(150px, 22vw, 400px) + 24px);
      height: calc(100% - 220px);
      min-height: var(--column);
      --bar: clamp(28px, calc(var(--column) * 0.55 / var(--groups, 4) - 11px), 42px);
    `)}
`

export const AccordionContainer = ({
  orientation = "horizontal",
  narrow = false,
  children,
}: PropsWithChildren<{ orientation?: Orientation; narrow?: boolean }>) => (
  <StyledAccordionContainer
    vertical={orientation === "vertical"}
    narrow={narrow}
    style={{ "--groups": Children.count(children) } as CSSProperties}
  >
    {children}
  </StyledAccordionContainer>
)

const StyledAccordionGroup = styled.div<{ active: boolean; vertical: boolean }>`
  display: flex;
  ${({ active, vertical }) =>
    vertical
      ? `
      flex-direction: column;
      flex-shrink: 0;
      padding: 4px 0;
      border-bottom: 3px solid var(--default-color);
      :first-of-type {
        border-top: 3px solid var(--default-color);
      }
    `
      : `
      height: clamp(150px, 22vw, 400px);
      ${active ? "flex: 1;" : ""}
      min-width: calc(clamp(40px, 5.5vw, 90px) + 20px);
      padding: 0 10px;
      flex-direction: row;
      border-right: 3px solid var(--default-color);
      :first-of-type {
        border-left: 3px solid var(--default-color);
      }
    `}
`

const AccordionContent = styled.div<{ vertical: boolean; narrow: boolean }>`
  overflow: hidden;
  ${({ vertical, narrow }) =>
    vertical && narrow
      ? `
      display: flex;
      flex-direction: column;
      justify-content: safe center;
      padding-left: 24px;
      transition: height 300ms;
    `
      : vertical
      ? `
      display: grid;
      grid-auto-flow: column;
      grid-template-rows: repeat(var(--rows, 1), max-content);
      grid-auto-columns: max-content;
      column-gap: calc(40px * var(--fit, 1));
      align-content: safe center;
      padding-left: 24px;
      transition: height 300ms;
    `
      : `
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: safe center;
      transition: 300ms;
    `}

  /* Collapsed groups shouldn't catch clicks on their clipped links. */
  &[aria-hidden="true"] {
    pointer-events: none;
  }
`

const AccordionTitleWrapper = styled.button<{
  active: boolean
  vertical: boolean
}>`
  padding: 0;
  background-color: var(--bg-color);
  border: 4px solid var(--accent-color);
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  position: relative;
  ${({ vertical }) =>
    vertical
      ? `
      width: 100%;
      height: var(--bar);
      flex-shrink: 0;
      justify-content: flex-start;
      gap: 14px;
      padding: 0 20px;
    `
      : `
      height: 100%;
      width: clamp(40px, 5.5vw, 90px);
    `}
  ::before {
    content: "";
    position: absolute;
    background-color: var(--accent-color);
    transition: ${({ active }) => (active ? "1s" : ".5s")};
    ${({ active, vertical }) =>
      vertical
        ? `
        left: 0;
        top: 0;
        height: 100%;
        width: ${active ? "calc(100% - 10px)" : "0"};
      `
        : `
        bottom: 0px;
        width: 100%;
        height: ${active ? "calc(100% - 10px)" : "0"};
      `}
  }
  :hover,
  :focus {
    outline: none;
    ${({ active, vertical }) =>
      !active &&
      (vertical
        ? `
            ::before {
                width: 50%;
            }
            > .wave {
                right: 50%;
            }
        `
        : `
            ::before {
                height: 50%;
            }
            > .wave {
                top: 50%;
                ::before{
                    animation: wave 12s infinite cubic-bezier(0.71, 0.33, 0.33, 0.68);
                    top: -25%;
                    left: 50%;
                }
            }
        `)}
  }

  > .wave {
    /* Waves Source: https://codepen.io/mburakerman/pen/eRZZEv */
    position: absolute;
    overflow: hidden;
    transition: ${({ active }) => (active ? "1s" : ".5s")};
    ${({ active, vertical }) =>
      vertical
        ? `
        top: 0;
        width: 50px;
        height: 100%;
        right: ${active ? "0px" : "calc(100% - 50px)"};
      `
        : `
        width: calc(100% - 8px);
        height: 50px;
        top: ${active ? "0px" : "calc(100% - 50px)"};
      `}
    ::before {
      content: "";
      position: absolute;
      border-radius: 37%;
      background-color: var(--bg-color);
      animation: wave 12s infinite cubic-bezier(0.71, 0.33, 0.33, 0.68);
      ${({ vertical }) =>
        vertical
          ? `
          width: 185px;
          height: 180px;
          top: 50%;
          left: 17.5px;
          margin-top: -90px;
        `
          : `
          width: 180px;
          height: 185px;
          top: -25%;
          left: 50%;
          margin-left: -90px;
          margin-top: -140px;
        `}
    }
    @keyframes wave {
      from {
        transform: rotate(0deg);
      }
      from {
        transform: rotate(360deg);
      }
    }
  }

  ${({ active, vertical }) =>
    !active &&
    css`
      :hover {
        > * {
          color: var(--bg-color);
          text-shadow:
            5px 0px 0 var(--accent-color),
            4px 0px 0 var(--accent-color),
            3px 0px 0 var(--accent-color),
            2px 0px 0 var(--accent-color),
            1px 0px 0 var(--accent-color),
            -1px 0px 0 var(--accent-color),
            0px 1px 0 var(--accent-color),
            0px -1px 0 var(--accent-color);
        }
        ${vertical && "> .category-icon { background-color: var(--bg-color); }"}
      }
    `};
`

const AccordionTitle = styled.h1<{
  title: string
  active: boolean
  vertical: boolean
}>`
  ${({ vertical }) =>
    vertical
      ? `
      position: relative;
      z-index: 1;
      margin: 0;
      font-size: calc(var(--bar) * 0.48);
    `
      : "transform: rotate(90deg);"}
  min-width: max-content;
  color: ${({ active }) =>
    active ? "var(--bg-color)" : "var(--default-color)"};
  transition: 0.5s;
  letter-spacing: 5px;
`

// Mask-tinted category icon: top of the bar when horizontal, beside the title when vertical.
const CategoryIcon = styled.div<{
  src: string
  active: boolean
  vertical: boolean
}>`
  ${({ vertical }) =>
    vertical
      ? `
      position: relative;
      flex-shrink: 0;
      width: calc(var(--bar) * 0.5);
      height: calc(var(--bar) * 0.5);
    `
      : `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: clamp(18px, 2.2vw, 32px);
      height: clamp(18px, 2.2vw, 32px);
    `}
  z-index: 2;
  background-color: ${({ active, vertical }) =>
    !active ? "#fff" : vertical ? "var(--bg-color)" : "var(--accent-color)"};
  opacity: 0.9;
  transition: 0.5s;
  mask-image: url("${({ src }) => src}");
  -webkit-mask-image: url("${({ src }) => src}");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
`

type groupProps = PropsWithChildren<{
  active: boolean
  title: string
  icon?: string
  orientation?: Orientation
  narrow?: boolean
  openCount?: number
  onClick: () => void
  onMouseDown: (e: MouseEvent) => void
}>

const getAvailableContentWidth = (element: HTMLElement | null) => {
  const parent = element?.parentElement
  if (!parent) return 0
  if (parent.children.length === 1) return "100%"
  const button = element.firstElementChild as HTMLElement
  const style = getComputedStyle(element)
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
  return element.offsetWidth - (button?.offsetWidth ?? 90) - padding
}

// Rows needed at a column cap, or columns needed at a row cap.
const linesFor = (count: number, cap: number) =>
  Math.ceil(count / Math.max(1, Math.min(count, cap)))

// Vertical: one open group fills a column as tall as the image, wrapping links
// into columns first and shrinking them last. Expand-all hugs, up to the page.
const solveColumn = (container: HTMLElement) => {
  const gap = 40
  const margin = 8
  const row = 31
  let bars = 0
  let width = 0
  const open: { group: Element; count: number; text: number }[] = []
  for (const group of Array.from(container.children)) {
    const style = getComputedStyle(group)
    const button = group.firstElementChild as HTMLElement
    const content = group.lastElementChild as HTMLElement
    bars +=
      button.offsetHeight +
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth)
    if (content.hasAttribute("aria-hidden")) continue
    const links = Array.from(content.children) as HTMLElement[]
    const current = parseFloat(content.style.getPropertyValue("--fit")) || 1
    width = content.clientWidth - 48
    open.push({
      group,
      count: links.length,
      text: Math.max(0, ...links.map(link => link.offsetWidth - 30)) / current,
    })
  }

  const minRows = (fit: number) =>
    open.map(({ count, text }) =>
      linesFor(
        count,
        Math.floor((width + gap * fit) / (30 + (text + gap) * fit))
      )
    )
  const heightOf = (rows: number[], fit: number) =>
    rows.reduce((sum, r) => sum + r * row * fit + margin, 0)

  const matched = parseFloat(getComputedStyle(container).minHeight) - bars
  const fill = open.length === 1 && heightOf(minRows(0.55), 0.55) <= matched
  const free = Math.max(0, fill ? matched : container.clientHeight - bars)

  let step = 20
  while (step > 11 && heightOf(minRows(step / 20), step / 20) > free) step--
  const fit = step / 20
  const rows = minRows(fit)
  let spare = free - heightOf(rows, fit)

  // Spend what's left on fewer, longer columns, widest group first.
  const stuck = new Set<number>()
  for (;;) {
    let pick = -1
    let columns = 1
    rows.forEach((r, i) => {
      const c = linesFor(open[i]!.count, r)
      if (!stuck.has(i) && c > columns) {
        pick = i
        columns = c
      }
    })
    if (pick < 0) break
    const next = linesFor(open[pick]!.count, columns - 1)
    const cost = (next - rows[pick]!) * row * fit
    if (cost <= spare) {
      rows[pick] = next
      spare -= cost
    } else stuck.add(pick)
  }

  const squeeze = Math.min(1, free / heightOf(rows, fit))
  return new Map(
    open.map(({ group }, i) => [
      group,
      {
        height: Math.floor(
          fill ? free : (rows[i]! * row * fit + margin) * squeeze
        ),
        fit,
        rows: Math.max(1, rows[i]!),
      },
    ])
  )
}

export const AccordionGroup = ({
  active,
  title,
  icon,
  orientation = "horizontal",
  narrow = false,
  openCount = 1,
  children,
  onClick,
  onMouseDown,
}: groupProps) => {
  const vertical = orientation === "vertical"
  const groupRef = useRef<HTMLDivElement>(null)
  const [contentSize, setContentSize] = useState<number | string | null>(null)
  const [fit, setFit] = useState(1)
  const [rows, setRows] = useState(1)
  const count = Children.count(children)

  useLayoutEffect(() => {
    const group = groupRef.current
    const parent = group?.parentElement
    if (!group || !parent) return
    const measure = () => {
      if (vertical && narrow) {
        // Phones: one full-size list per group; the column scrolls instead.
        const links = Array.from(group.lastElementChild?.children ?? [])
        const height = links.reduce(
          (sum, link) => sum + (link as HTMLElement).offsetHeight,
          8
        )
        setContentSize(active ? height : 0)
        setFit(1)
        return
      }
      if (vertical) {
        const layout = active ? solveColumn(parent).get(group) : undefined
        setContentSize(layout?.height ?? 0)
        // Collapsed groups keep their last fit so links don't rescale mid-close.
        if (!layout) return
        setFit(layout.fit)
        setRows(layout.rows)
        return
      }
      setContentSize(active ? getAvailableContentWidth(group) : 0)
      // Shrink links just enough to fit the bar's height when a group is long.
      const base = count > 9 ? 30 : 40
      setFit(Math.min(1, Math.max(0.55, group.clientHeight / (count * base))))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(vertical ? parent : group)
    return () => observer.disconnect()
  }, [active, count, vertical, narrow, openCount])

  const size =
    typeof contentSize === "string" ? contentSize : `${contentSize ?? 0}px`

  return (
    <StyledAccordionGroup ref={groupRef} active={active} vertical={vertical}>
      <AccordionTitleWrapper
        active={active}
        vertical={vertical}
        onMouseDown={onMouseDown}
        onClick={onClick}
        tabIndex={active ? -1 : undefined}
      >
        {icon && (
          <CategoryIcon
            className="category-icon"
            src={icon}
            active={active}
            vertical={vertical}
          />
        )}
        <div className="wave" />
        <AccordionTitle active={active} vertical={vertical} title={title}>
          {title}
        </AccordionTitle>
      </AccordionTitleWrapper>
      <AccordionContent
        vertical={vertical}
        narrow={narrow}
        style={
          {
            [vertical ? "height" : "width"]: size,
            "--fit": fit,
            "--rows": rows,
          } as CSSProperties
        }
        aria-hidden={!active || undefined}
      >
        {children}
      </AccordionContent>
    </StyledAccordionGroup>
  )
}
