import { MouseEvent, useState } from "react"

import styled from "@emotion/styled"

import { AccordionContainer, AccordionGroup } from "./Accordion/Accordion"
import { Orientation } from "../../data/data"
import * as Settings from "../Settings/settingsHandler"

const LinkItem = styled.a<{ dense?: boolean }>`
  max-width: fit-content;
  flex-shrink: 0;
  white-space: nowrap;
  position: relative;
  padding: ${({ dense }) => {
      const p = dense ? 5 : 10
      return `calc(${p}px * var(--fit, 1)) 0 calc(${p}px * var(--fit, 1)) 30px`
    }};
  font-size: calc(1rem * var(--fit, 1));
  overflow: hidden;
  text-overflow: ellipsis;

  ::before {
    position: absolute;
    left: 0px;
    bottom: calc(5px * var(--fit, 1));
    z-index: 0;
    content: "";
    height: calc(5px * var(--fit, 1));
    width: 100%;
    background-color: var(--accent-color);
    transition: 0.5s;
    opacity: 0.7;
  }

  /* Hide the underline bars that otherwise leak out of collapsed groups. */
  [aria-hidden="true"] &::before {
    display: none;
  }

  :hover,
  :focus {
    color: var(--accent-color2);
    animation: text-flicker 0.01s ease 0s infinite alternate;
    outline: none;
  }
`

type props = {
  orientation?: Orientation
  narrow?: boolean
  expandAll?: boolean
  onExitExpandAll?: () => void
}

export const LinkContainer = ({
  orientation = "horizontal",
  narrow = false,
  expandAll = false,
  onExitExpandAll,
}: props) => {
  const [active, setActive] = useState(0)
  const linkGroups = Settings.Links.getWithFallback()

  const isActive = (groupIndex: number) => expandAll || active === groupIndex

  // In expand-all mode, selecting a title collapses back down to that group.
  const selectGroup = (groupIndex: number) => {
    setActive(groupIndex)
    if (expandAll) onExitExpandAll?.()
  }

  const middleMouseHandler = (event: MouseEvent, groupIndex: number) => {
    setActive(groupIndex)
    if (event.button === 1) {
      linkGroups[groupIndex]?.links.forEach(link => {
        window.open(link.value, "_blank")
      })
    }
  }

  return (
    <AccordionContainer orientation={orientation} narrow={narrow}>
      {linkGroups.map((group, groupIndex) => (
        <AccordionGroup
          key={group.title}
          orientation={orientation}
          narrow={narrow}
          openCount={expandAll ? linkGroups.length : 1}
          active={isActive(groupIndex)}
          title={group.title}
          icon={group.icon}
          onClick={() => selectGroup(groupIndex)}
          onMouseDown={e => middleMouseHandler(e, groupIndex)}
        >
          {group.links.map(link => (
            <LinkItem
              dense={
                !narrow &&
                (orientation === "vertical" || group.links.length > 9)
              }
              tabIndex={!isActive(groupIndex) ? -1 : undefined}
              key={link.label}
              href={link.value}
            >
              {link.label}
            </LinkItem>
          ))}
        </AccordionGroup>
      ))}
    </AccordionContainer>
  )
}
